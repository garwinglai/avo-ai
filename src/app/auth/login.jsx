import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import usePasswordAuth from "../../hooks/firebase/auth/usePasswordAuth";

const Login = () => {
  const [email, setEmail] = useState("laigarwing@gmail.com");
  const [password, setPassword] = useState("supermonkey1");
  const {
    user,
    loggingIn,
    errorLogginIn,
    signInWithPassword,
    createUserWithPassword,
  } = usePasswordAuth();

  const router = useRouter();

  const handleLoginWithPassword = async () => {
    console.log("Login with email and password:", email, password);
    try {
      const { accessToken, uid } = await signInWithPassword(email, password);

      router.push("/(tabs)");
    } catch (error) {
      console.log("error:", error);
      Alert.alert("Login failed", `(${error})`);
    }
  };

  const handleNavigateToSignup = () => {
    router.replace("/auth/signup");
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-bg-light">
      <Text className="text-h1 font-bold text-primary-dark mb-8">
        Login to Avo
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
        className="w-full h-12 border border-secondary rounded-lg px-4 mb-6 bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loggingIn ? (
        <View className="h-12 mb-4 justify-center items-center">
          <ActivityIndicator color="#995F41" />
        </View>
      ) : (
        <TouchableOpacity
          className="w-full h-12 bg-primary rounded-lg justify-center items-center mb-4"
          onPress={handleLoginWithPassword}
          disabled={loggingIn}
        >
          <Text className="text-white font-semibold text-h5">Login</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-2 mt-6">
        <Text className="text-p text-primary-dark">
          Don't have an account?{" "}
        </Text>
        <Pressable onPress={handleNavigateToSignup}>
          <Text className="text-secondary-dark font-semibold">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
