import "../styles/global.css";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router/stack";
import { View } from "react-native";
import { AuthProvider } from "../hooks/firebase/auth/AuthProvider";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <AuthProvider>
      <View className="flex-1">
        <StatusBar style="auto" />
        <Stack initialRouteName="(tabs)">
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              animation: "none",
              headerShown: false, // Hide the header
            }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="auth/onboarding/[step]"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="camera"
            options={{ headerShown: false, animation: "none" }}
          />
        </Stack>
      </View>
      <Toast />
    </AuthProvider>
  );
}
