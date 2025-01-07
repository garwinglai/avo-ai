import { View, Text } from "react-native";
import React from "react";

const MacroNutrientSimple = ({ type, amount }) => {
  const amountInt = Math.round(amount);
  return (
    <View className="items-center justify-center flex-1">
      <Text className="text-xl">{amountInt}</Text>
      <Text className="text-gray-500">{type}</Text>
    </View>
  );
};

export default MacroNutrientSimple;
