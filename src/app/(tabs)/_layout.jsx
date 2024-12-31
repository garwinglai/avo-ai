import { Tabs } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import { View, Pressable, Platform } from "react-native";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/firebase/auth/AuthProvider";
import { useEffect } from "react";

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isCameraScreen = usePathname();

  const handleStartCamera = async () => {
    console.log("pressed");

    // Check request camera permissions every time the button is pressed
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status === "granted") {
      console.log("permission granted");
      // Navigate to the camera screen
      router.push("/camera");
    } else if (status === "denied") {
      Alert.alert(
        "Camera permission denied",
        "Please enable camera permissions in settings.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(), // Open settings on both Android and iOS
          },
          { text: "Cancel" },
        ]
      );
    } else {
      Alert.alert(
        "Camera permission not granted",
        "Please grant permission to use the camera.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(), // Open settings on both Android and iOS
          },
          { text: "Cancel" },
        ]
      );
    }
  };

  return (
    <View className="flex-1">
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="meal-planner"
          options={{
            title: "Meal Plan",
          }}
        />
        <Tabs.Screen
          name="shopping-list"
          options={{
            title: "Shop List",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
      {/* Conditionally render the camera button */}
      {isCameraScreen !== "/camera" && (
        <Pressable
          className="absolute right-5 w-16 h-16 border-2 border-white bg-primary-dark items-center justify-center rounded-full"
          style={{
            bottom: insets.bottom + 70,
            paddingBottom: Platform.OS === "android" ? 5 : 0,
          }}
          onPress={handleStartCamera}
        >
          <EvilIcons name="camera" size={30} color="white" />
        </Pressable>
      )}
    </View>
  );
}
