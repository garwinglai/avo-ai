import { Stack } from "expo-router/stack";
import { View } from "react-native";
import "../styles/global.css";

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
