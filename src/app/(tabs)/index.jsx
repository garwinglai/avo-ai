import { View, Text, Pressable } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const HomeTab = () => {
  const handleClick = async () => {
    console.log("clicked");

    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <View>
      <Text className=" text-2xl text-red-400">HomeTab</Text>
      <EvilIcons name="camera" size={24} color="green" />
      <Pressable onPress={handleClick}>
        <Text>Press</Text>
      </Pressable>
    </View>
  );
};

export default HomeTab;
