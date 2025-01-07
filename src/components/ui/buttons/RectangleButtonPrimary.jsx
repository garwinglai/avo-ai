import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

const RectangleButtonPrimary = ({ children, onPress, disabled }) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
    }, 100);
    onPress();
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      className={`  flex-1 items-center ${
        disabled ? ` bg-gray-300` : `bg-primary-dark shadow`
      } ${pressed ? `bg-primary-dark` : `bg-primary`}  rounded-lg p-4`}
    >
      <Text className="text-center text-p font-medium text-white">
        {children}
      </Text>
    </Pressable>
  );
};

export default RectangleButtonPrimary;
