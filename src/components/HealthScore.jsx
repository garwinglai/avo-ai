import { View, Text } from "react-native";
import React from "react";

const HealthScore = ({ healthScore, healthLabel, healthColor }) => {
  return (
    <View className="flex-1 flex-row items-center">
      <View
        style={{
          width: 10, // Equivalent to w-4 in Tailwind
          height: 10, // Equivalent to h-4 in Tailwind
          borderRadius: 50, // Equivalent to rounded-full in Tailwind
          backgroundColor: healthColor, // Apply the hex color dynamically
        }}
      ></View>
      <Text className="ml-2">
        {healthScore} {healthLabel}
      </Text>
    </View>
  );
};

export default HealthScore;
