import React from "react";
import { View, Text } from "react-native";

export default function StepHeader({ step, steps }) {
  return (
    <View className="flex-row justify-between mt-4">
      <Text className="text-h5 text-primary-dark font-bold ">{`${step}/${steps}`}</Text>
    </View>
  );
}
