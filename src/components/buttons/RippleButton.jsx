import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";

const RippleButton = ({ onPress, pressStyle, icon, title }) => {
  return (
    <Pressable
      onPress={onPress}
      className={pressStyle}
      android_ripple={{ color: "" }}
    >
      <Text className="text-h5">{title}</Text>
      {icon}
    </Pressable>
  );
};

export default RippleButton;
