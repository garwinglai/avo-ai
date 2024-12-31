import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { auth } from "../../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

const MealPlannerTab = () => {
  const router = useRouter();

  const handleLogout = async () => {
    console.log("clicked");
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      Alert.alert("Error logging out", error.message);
    }
  };

  return (
    <View>
      <Text>MealPlanTab</Text>
      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default MealPlannerTab;
