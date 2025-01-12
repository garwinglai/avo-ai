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
import HorizontalDivider from "../../../components/ui/dividers/HorizontalDivider";

const OnboardingStep = () => {
  const { step } = useLocalSearchParams();
  const { nextStep, previousStep } = userOnboardingSteps();
  const { userData, updateUserData } = useOnboardingUserStore();
  const {
    userDiet,
    updateUserDiet,
    updatePriority,
    addAllergen,
    removeAllergen,
    addExcludeFood,
    removeExcludeFood,
  } = useOnboardingDietStore();
  const { userWeight, updateUserWeight } = useOnboardingWeightStore();
  const { accountInfo } = useAccountInfoStore();
  const { userFitness, updateUserFitenssData } = useOnboardingFitnessStore();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const {
    saveToFirestoreCollection,
    saveToFirestoreDoc,
    isSavingToFirestore,
    errorSavingToFirestore,
  } = useSaveToFirestore();
  const {
    user,
    loggingIn,
    errorLogginIn,
    signInWithPassword,
    createUserWithPassword,
  } = usePasswordAuth();

  // Determine the current group of steps based on the step number
  const router = useRouter();
  const currentStep = steps[parseInt(step) - 1];

  const handleCreateCreateAccount = async () => {
    let userId;

    try {
      const { accessToken, uid } = await createUserWithPassword(
        accountInfo.email,
        accountInfo.password
      );

      userId = uid;
    } catch (error) {
      Alert.alert(
        "Signup failed",
        `(${error})` // This will appear on the second line
      );
      return;
    }
    console.log("Creating Account");

    // Fill in missing fields
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

    const completeUserData = {
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
      "You are a nutritionist. Generate precise nutritional recommendations based on the user's weight, goals, age, and diet preferences. Reply units should only be in g, mg, or mcg.";
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

    // return;
    try {
      const response = await axios.post(openAIURL, {
        message: conversation,
        model: "gpt-4o-mini",
        response_format: response_format,
      });

      const aiResponse = JSON.parse(response.data.content);
      const nutritionUpdatedUnits = validateUnitsRDA(aiResponse);
      completeUserData.dietaryAllowance = nutritionUpdatedUnits;

      // You can add additional logic here to handle the response from your backend
    } catch (error) {
      console.error("Error calling backend:", error);
    }
    console.log(completeUserData);

    try {
      completeUserData.uid = userId;
      completeUserData.email = accountInfo.email;
      const id = await saveToFirestoreDoc(`users`, userId, completeUserData);

      router.replace("/(tabs)");
    } catch (error) {
      console.log("error", error);

      showToast({
        type: "error",
        header: "Issue",
        body: "Error creating account.",
        position: "top",
        topOffset: 80,
      });
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

      setIsCreatingAccount(true);
      await handleCreateCreateAccount();
      setIsCreatingAccount(false);
    }
  };

  const handleBack = () => {
    if (parseInt(step) > 1) {
      previousStep();
      router.push(`/auth/onboarding/${parseInt(step) - 1}`);
    }
  };

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

  const handleBackToSignup = () => {
    router.push("/auth/signup");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 items-center bg-bg-light p-4">
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
