import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useOnboardingUserStore,
  userOnboardingSteps,
  useOnboardingDietStore,
  useOnboardingWeightStore,
} from "../../../store/onboardingStore";
import ProgressBar from "../../../components/ui/ProgressBar";
import RectangleButtonPrimary from "../../../components/ui/buttons/RectangleButtonPrimary";
import RectangleButtonSecondary from "../../../components/ui/buttons/RectangleButtonSecondary";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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
import { showToast } from "../../../utils/toast";
import { useAccountInfoStore } from "../../../store/onboardingStore";
import usePasswordAuth from "../../../hooks/firebase/auth/usePasswordAuth";
import AntDesign from "@expo/vector-icons/AntDesign";

const OnboardingStep = () => {
  const { step } = useLocalSearchParams();
  const { nextStep, previousStep } = userOnboardingSteps();
  const { userData, updateUserData } = useOnboardingUserStore();
  const { userDiet, updateUserDiet } = useOnboardingDietStore();
  const { userWeight, updateUserWeight } = useOnboardingWeightStore();
  const { accountInfo } = useAccountInfoStore();

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

    const updatedDietInfo = {
      ...userDiet,
      allergensArr: userDiet.allergens
        ? userDiet.allergens.split(",").map((item) => item.trim())
        : userDiet.allergensArr,
      excludeFoodsArr: userDiet.exludeFoods
        ? userDiet.exludeFoods.split(",").map((item) => item.trim())
        : userDiet.excludeFoodsArr,
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

    const prompt =
      "Please provide the nutrition recommendations based on my data.";
    const openAIURL = "https://openai-openaimacros-i32lfigxrq-uc.a.run.app";
    const completeUserData = {
      ...updatedUserData,
      diet: {
        ...updatedDietInfo,
      },
      weight: {
        ...updatedWeightData,
      },
    };

    const userDataForGPT = {
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
    };

    try {
      const response = await axios.post(openAIURL, {
        prompt: prompt,
        userData: userDataForGPT,
        dietInfo: userDiet,
        weightData: userWeight,
      });

      completeUserData.nutritionGoals = JSON.parse(response.data.content);

      // You can add additional logic here to handle the response from your backend
    } catch (error) {
      console.error("Error calling backend:", error);
    }

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

    if (!validatePages(step, userData, userDiet, userWeight)) {
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

  const handleUserWeightGoalsChange = (key, value) => {
    updateUserWeight(key, value);
  };

  const handleDietChange = (key, value) => {
    updateUserDiet(key, value);
  };

  const handleBackToSignup = () => {
    router.push("/auth/signup");
  };

  return (
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
      <View className="mt-16 w-full justify-center">
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
            data={userWeight}
            handleDataChange={handleUserWeightGoalsChange}
          />
        )}
        <View className="flex flex-row w-full gap-4 items-center justify-between mt-4">
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
      </View>
    </SafeAreaView>
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
