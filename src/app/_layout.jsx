import "../styles/global.css";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router/stack";
import { View } from "react-native";
import { AuthProvider } from "../hooks/firebase/auth/AuthProvider";

export default function Layout() {
  return (
    <AuthProvider>
      <View className="flex-1">
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen
            name="camera" // This is the route name for your camera screen
            options={{
              headerShown: false, // This hides the top header for the camera screen
            }}
          />
        </Stack>
      </View>
    </AuthProvider>
  );
}
