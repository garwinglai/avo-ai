import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";

const HomeTab = () => {
  // console.log("user", user);
  const router = useRouter();

  const handleClick = async () => {
    console.log("clicked");
    router.push("/auth/login");

    // try {
    //   const docRef = await addDoc(collection(db, "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815,
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      Alert.alert("Error logging out", error.message);
    }
  };

  return (
    <View>
      <Text className=" text-2xl text-red-400">HomeTab</Text>
      <EvilIcons name="camera" size={24} color="green" />
      <Pressable onPress={handleClick}>
        <Text>Login</Text>
      </Pressable>
      <Pressable className="mt-6" onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default HomeTab;
