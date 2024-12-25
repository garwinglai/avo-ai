import { View, Text } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";

const HomeTab = () => {
  return (
    <View>
      <Text className=" text-2xl text-red-400">HomeTab</Text>
      <EvilIcons name="camera" size={24} color="green" />
    </View>
  );
};

export default HomeTab;
