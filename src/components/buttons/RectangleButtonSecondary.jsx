import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";

const RectangleButtonSecondary = ({ children, onPress }) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
    }, 100);
    // onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`shadow  flex-1 items-center ${
        pressed ? ` bg-secondary-dark` : `bg-secondary`
      }  rounded-lg p-4`}
    >
      <Text className="text-center text-p font-medium text-white">
        {children}
      </Text>
    </Pressable>
  );
};

export default RectangleButtonSecondary;
