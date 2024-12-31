import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { GoogleAuthProvider } from "firebase/auth";
import { Link, useRouter } from "expo-router";
import usePasswordAuth from "../../hooks/firebase/auth/usePasswordAuth";

const provider = new GoogleAuthProvider();

const Signup = () => {
  const [email, setEmail] = useState("laigarwing@gmail.com");
  const [password, setPassword] = useState("supermonkey1");
  const [confirmPassword, setConfirmPassword] = useState("supermonkey1");
  const {
    user,
    loggingIn,
    errorLogginIn,
    signInWithPassword,
    createUserWithPassword,
  } = usePasswordAuth();

  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Signup failed", "Passwords do not match");

      return;
    }

    try {
      const { accessToken, uid } = await createUserWithPassword(
        email,
        password
      );
      console.log("accessToken", accessToken);
      console.log("uid", uid);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Signup failed",
        `(${error})` // This will appear on the second line
      );
    }
  };

  return (
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
      <TextInput
        className="w-full h-12 border border-secondary rounded-lg px-4 mb-4 bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="w-full h-12 border border-secondary rounded-lg px-4 mb-6 bg-white"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {loggingIn ? (
        <View className="h-12 mb-4 justify-center items-center">
          <ActivityIndicator color="#4B3122" />
        </View>
      ) : (
        <TouchableOpacity
          className="w-full h-12 bg-primary rounded-lg justify-center items-center mb-4"
          onPress={handleSignup}
          disabled={loggingIn}
        >
          <Text className="text-white font-semibold text-h5">Sign Up</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-2 mt-6">
        <Text className="text-p text-primary-dark">
          Already have an account?{" "}
        </Text>
        <Link replace href="/auth/login" asChild>
          <Pressable>
            <Text className="text-secondary-dark font-semibold">Log In</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Signup;
