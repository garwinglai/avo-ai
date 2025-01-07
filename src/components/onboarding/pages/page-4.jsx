import { View, Text } from "react-native";
import React from "react";
import InputField from "../InputField";

const Page4 = ({ data, handleDataChange }) => {
  return (
    <View>
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 70 lbs"
          value={data["current"]}
          label="Current Weight"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("current", text)}
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          lbs
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 65 lbs"
          value={data["goal"]}
          label="Weight Goal"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("goal", text)}
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          lbs
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 4"
          value={data["exercisePerWeek"]}
          label="Exercise"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("exercisePerWeek", text)}
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          per week
        </Text>
      </View>
    </View>
  );
};

export default Page4;
