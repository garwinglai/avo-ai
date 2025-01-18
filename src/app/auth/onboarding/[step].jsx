import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useOnboardingUserStore,
  userOnboardingSteps,
  useOnboardingDietStore,
  useOnboardingWeightStore,
  useOnboardingFitnessStore,
} from "../../../store/onboardingStore";
import ProgressBar from "../../../components/ui/ProgressBar";
import RectangleButtonPrimary from "../../../components/ui/buttons/RectangleButtonPrimary";
import RectangleButtonSecondary from "../../../components/ui/buttons/RectangleButtonSecondary";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Page1 from "../../../components/onboarding/pages/page-1";
import StepHeader from "../../../components/onboarding/StepHeader";
import Page2 from "../../../components/onboarding/pages/page-2";
import Page3 from "../../../components/onboarding/pages/page-3";
import Page4 from "../../../components/onboarding/pages/page-4";
import { validatePages } from "../../../utils/onboarding/pageValidations";
import { calculateAge, getCurrentDate } from "../../../utils/date";
import axios from "axios";
import useSaveToFirestore from "../../../hooks/firebase/firestore/useSaveToFirestore";
import { useAccountInfoStore } from "../../../store/onboardingStore";
import usePasswordAuth from "../../../hooks/firebase/auth/usePasswordAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { validateUnitsRDA } from "../../../utils/unitValidations";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { nutritionSchema } from "../../../utils/schema/nutritionSchema";
import { showToast } from "../../../utils/toast";
import { auth } from "../../../../firebase/firebaseConfig";
import { deleteUser } from "firebase/auth";
import CustomModal from "../../../components/ui/Modal";
import * as Progress from "react-native-progress";
import LoadingModal from "../../../components/ui/LoadingModal";

const OnboardingStep = () => {
  const { step } = useLocalSearchParams();
  const { nextStep, previousStep } = userOnboardingSteps();
  const { userData, updateUserData } = useOnboardingUserStore();
  const { userDiet, updateUserDiet, updatePriority } = useOnboardingDietStore();
  const { userWeight, updateUserWeight } = useOnboardingWeightStore();
  const { accountInfo } = useAccountInfoStore();
  const { userFitness, updateUserFitenssData } = useOnboardingFitnessStore();
  const [signupProgress, setSignupProgress] = useState(0);
  const [signupLoadingText, setSignupLoadingText] = useState(
    "Creating account..."
  );
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { saveToFirestoreDoc, saveToFirestoreCollection } =
    useSaveToFirestore();
  const { createUserWithPassword } = usePasswordAuth();

  const router = useRouter();
  const currentStep = steps[parseInt(step) - 1];

  //* Action buttons Next/Back`
  const handleBack = () => {
    if (parseInt(step) > 1) {
      previousStep();
      router.push(`/auth/onboarding/${parseInt(step) - 1}`);
    }
  };

  const handleNext = async () => {
    //check if the steps has any empty values, if so, alert the user

    if (!validatePages(step, userData, userDiet, userWeight, userFitness)) {
      return;
    }

    if (parseInt(step) < steps.length) {
      nextStep();
      router.push(`/auth/onboarding/${parseInt(step) + 1}`);
    } else {
      // Complete onboarding
      setIsModalVisible(true);
      setIsCreatingAccount(true);
      await handleCreateCreateAccount();
      setIsCreatingAccount(false);
    }
  };

  const handleBackToSignup = () => {
    router.push("/auth/signup");
  };

  //* Handle form changes
  const handleUserDataChange = (key, value) => {
    updateUserData(key, value);
  };

  const handlePageFourDataChange = (key, value, store) => {
    if (store === "weight") {
      updateUserWeight(key, value);
    }

    if (store === "fitness") {
      updateUserFitenssData(key, value);
    }
  };

  const handleDietChange = (key, value) => {
    if (key == "preference") {
      updateUserDiet(key, value);
      return;
    }

    if (key == "priorities") {
      updatePriority(value);
    }

    if (key == "allergens") {
      updateAllergens(value);
    }

    if (key == "exludeFoods") {
      updateExcludeFoods(value);
    }
  };

  // * Create Accounts
  const handleCreateCreateAccount = async () => {
    // * Create new user in firebase auth
    setSignupProgress(0.15);
    setSignupLoadingText("Initializing.");
    const { userId, error } = await createNewUser();
    if (error) {
      showToast({
        type: "error",
        header: error,
        body: "Please try again.",
        position: "top",
        topOffset: 80,
      });

      setIsCreatingAccount(false);
      setIsModalVisible(false);
      return;
    }
    setSignupProgress(0.35);
    setSignupLoadingText("Creating your AI assistant. (10 seconds)");
    // * openAI generate nutritional goals
    const completeUserData = await aiGenerateNutritionGoals();
    if (!completeUserData) {
      await cleanupDeleteUser();

      showToast({
        type: "error",
        header: "Hmm.. seems like Avo AI is down.",
        body: "Please try again.",
        position: "top",
        topOffset: 80,
      });

      setIsCreatingAccount(false);
      setIsModalVisible(false);
      return;
    }
    setSignupProgress(0.75);
    setSignupLoadingText("AI awakening.");
    // * Save data to Firestore
    try {
      completeUserData.uid = userId;
      completeUserData.email = accountInfo.email;
      await saveToFirestoreDoc(`users`, userId, completeUserData);
      setSignupProgress(1);

      router.push("/(tabs)/");
    } catch (error) {
      console.log("Error saving data to firestore:", error);
      await cleanupDeleteUser();

      showToast({
        type: "error",
        header: "Error creating account.",
        body: "Please try again.",
        position: "top",
        topOffset: 80,
      });
    } finally {
      setIsModalVisible(false);
      setIsCreatingAccount(false);
    }
  };

  const cleanupDeleteUser = async () => {
    const user = auth.currentUser;

    try {
      await deleteUser(user);
    } catch (error) {
      console.log("Problem cleaning up: deleting user.", error);

      const data = {
        message: "Error cleaning up - deleting user in failed signup.",
        uid: user.uid,
      };
      await saveToFirestoreCollection("errors", data);
    }
  };

  const createNewUser = async () => {
    const { user, error } = await createUserWithPassword(
      accountInfo.email,
      accountInfo.password
    );

    if (error) {
      console.log("error", error);
      return { error };
    }

    return { userId: user.uid };
  };

  const aiGenerateNutritionGoals = async () => {
    console.log("generating ai...");

    const completeUserData = stuctureUserData();
    const { conversation, response_format, openAIURL } = createAIContext();

    try {
      const response = await axios.post(openAIURL, {
        message: conversation,
        model: "gpt-4o-mini",
        response_format: response_format,
      });

      const aiResponse = JSON.parse(response.data.content);
      const nutritionUpdatedUnits = validateUnitsRDA(aiResponse);
      completeUserData.dietaryAllowance = nutritionUpdatedUnits;

      return completeUserData;
      // You can add additional logic here to handle the response from your backend
    } catch (error) {
      console.log("error", error);

      return null;
    }
  };

  const stuctureUserData = () => {
    const updatedUserData = {
      ...userData,
      birthdayMonth: String(userData.birthdayMonth).padStart(2, "0"),
      birthdayDay: String(userData.birthdayDay).padStart(2, "0"),
      birthday: `${String(userData.birthdayMonth).padStart(2, "0")}/${String(
        userData.birthdayDay
      ).padStart(2, "0")}/${userData.birthdayYear}`,
      height: `${userData.heightFt}'${userData.heightIn}`,
      age: calculateAge(
        userData.birthdayMonth,
        userData.birthdayDay,
        userData.birthdayYear
      ),
    };

    const today = getCurrentDate();

    const updatedWeightData = {
      ...userWeight,
      weightTracking: {
        recordArr: [
          {
            date: today, // Call the function to get the current date in MM/DD/YYYY format
            dateEpoch: new Date().getTime(), // Get the current date in epoch (milliseconds since January 1, 1970)
            weight: userWeight.current,
          },
        ],
        recordOjc: {
          [today]: {
            weight: userWeight.current,
          },
        },
      },
    };

    return {
      ...updatedUserData,
      diet: {
        ...userDiet,
      },
      weight: {
        ...updatedWeightData,
      },
      exercise: {
        ...userFitness,
      },
    };
  };

  const createAIContext = () => {
    const userDetails = `
    The user's details are as follows:
    - Weight: ${userWeight.current} kg
    - Target Weight: ${userWeight.goal} kg
    - Fitness Goal: ${userFitness.goal}
    - Exercise per week: ${userFitness.exercisePerWeek}
    - Height: ${userData.height}
    - Age: ${userData.age} years
    - Gender: ${userData.gender}
    `;

    const openAIURL = "https://openai-chatopenai-i32lfigxrq-uc.a.run.app";
    const systemContent =
      "You are a nutritionist. Generate precise nutritional recommendations based on the user's weight, goals, age, and diet preferences. Reply units should only be in g, mg, mcg, or kcal.";
    const response_format = zodResponseFormat(nutritionSchema, "nutrition");
    const prompt = `Please provide the nutrition recommendations based on my data. ${userDetails}`;
    const conversation = [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return { conversation, response_format, openAIURL };
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 items-center bg-bg-light p-4">
          <CustomModal
            body={
              <LoadingModal
                progress={signupProgress}
                signupLoadingText={signupLoadingText}
              />
            }
            visible={isModalVisible}
            onClose={handleModalClose}
          />
          {/* create a button to go back */}
          <Pressable
            className="w-full flex-row items-center gap-2"
            onPress={handleBackToSignup}
          >
            <AntDesign name="back" size={16} color="black" />
            <Text>Sign up</Text>
          </Pressable>

          <Text className="text-h1 font-bold text-primary-dark mb-4">Avo</Text>
          <ProgressBar step={parseInt(step)} totalSteps={steps.length} />
          <StepHeader step={step} steps={steps.length} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="mt-8 w-full flex-1 mb-28 border-b border-black/10"
          >
            <Text className="text-primary-dark text-h3 font-medium mb-4">
              {currentStep.title}
            </Text>
            {step == 1 && (
              <Page1 data={userData} handleDataChange={handleUserDataChange} />
            )}
            {step == 2 && (
              <Page2 data={userData} handleDataChange={handleUserDataChange} />
            )}
            {step == 3 && (
              <Page3 data={userDiet} handleDataChange={handleDietChange} />
            )}
            {step == 4 && (
              <Page4
                weightData={userWeight}
                fitnessData={userFitness}
                handleDataChange={handlePageFourDataChange}
              />
            )}
          </ScrollView>

          <View className="absolute bottom-10 flex flex-row w-full gap-4 items-center justify-between mt-4">
            {parseInt(step) > 1 && (
              <RectangleButtonPrimary
                onPress={handleBack}
                disabled={isCreatingAccount}
              >
                <Text>Back</Text>
              </RectangleButtonPrimary>
            )}
            {isCreatingAccount ? (
              <View className="flex-grow ">
                <ActivityIndicator />
              </View>
            ) : (
              <RectangleButtonSecondary onPress={handleNext}>
                <Text>Next</Text>
              </RectangleButtonSecondary>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OnboardingStep;

const steps = [
  // Group 1: Personal Information
  {
    id: 1,
    title: "Personal info",
  },
  {
    id: 2,
    title: "Personal stats",
  },
  {
    id: 3,
    title: "Diet preferances",
  },
  {
    id: 4,
    title: "Goals",
  },
];
