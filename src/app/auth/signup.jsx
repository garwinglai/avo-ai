import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAccountInfoStore } from "../../store/onboardingStore";
import Feather from "@expo/vector-icons/Feather";
import {
  isValidEmail,
  validatePassword,
} from "../../utils/onboarding/signupValidation";
import { showToast } from "../../utils/toast";

const Signup = () => {
  const { accountInfo, clearAccountInfo } = useAccountInfoStore();
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState(
    accountInfo.email ? accountInfo.email : ""
  );
  const [password, setPassword] = useState(
    accountInfo.password ? accountInfo.password : ""
  );
  const [confirmPassword, setConfirmPassword] = useState(
    accountInfo.password ? accountInfo.password : ""
  );

  const { updateAccountInfo } = useAccountInfoStore();
  const router = useRouter();

  const handleSignup = async () => {
    // check if password is empty
    if (!password || !confirmPassword) {
      showToast({
        type: "error",
        header: "Missing password.",
        position: "top",
        topOffset: 80,
      });
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      showToast({
        type: "error",
        header: "Invalid email address.",
        position: "top",
        topOffset: 80,
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        type: "error",
        header: "Passwords do not match.",
        position: "top",
        topOffset: 80,
      });
      return;
    }

    if (!validatePassword(password)) {
      showToast({
        type: "error",
        header: "Invalid - weak password.",
        // body: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        position: "top",
        topOffset: 80,
      });
      return;
    }

    updateAccountInfo({ email, password });

    //save email & pw
    router.push("/auth/onboarding/1");
  };

  const handleNavigateToLoginCleanup = () => {
    clearAccountInfo();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center px-6 bg-bg-light">
          <Text className="text-h1 font-bold text-primary-dark mb-8">
            Sign Up for Avo
          </Text>
          <TextInput
            className="w-full h-12 border border-secondary rounded-lg px-4 mb-4 bg-white"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View className="flex-row items-center gap-4 mb-2">
            <View className="flex-grow gap-4">
              <TextInput
                className="flex-grow h-12 border border-secondary rounded-lg px-4  bg-white"
                placeholder="Password"
                value={password}
                secureTextEntry={!viewPassword}
                onChangeText={setPassword}
              />
              <TextInput
                className="w-full h-12 border border-secondary rounded-lg px-4  bg-white"
                placeholder="Confirm Password"
                value={confirmPassword}
                secureTextEntry={!viewPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <Pressable onPress={() => setViewPassword(!viewPassword)}>
              <Feather
                name={viewPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
          <Text className="text-sm text-gray-600 mb-6">
            Password should be at least 8 characters long, 1 uppercase letter, 1
            lowercase letter, and 1 special character.
          </Text>

          <TouchableOpacity
            className="w-full h-12 bg-primary rounded-lg justify-center items-center mb-4"
            onPress={handleSignup}
          >
            <Text className="text-white font-semibold text-h5">Sign Up</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2 mt-6">
            <Text className="text-p text-primary-dark">
              Already have an account?{" "}
            </Text>
            <Link replace href="/auth/login" asChild>
              <Pressable onPress={handleNavigateToLoginCleanup}>
                <Text className="text-secondary-dark font-semibold">
                  Log In
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Signup;
