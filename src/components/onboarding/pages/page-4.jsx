import { View, Text } from "react-native";
import React from "react";
import InputField from "../InputField";
import Dropdown from "../../ui/Dropdown";

const Page4 = ({ weightData, fitnessData, handleDataChange }) => {
  return (
    <View>
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 70 lbs"
          value={weightData["current"]}
          label="Current Weight"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("current", text, "weight")}
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          lbs
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 65 lbs"
          value={weightData["goal"]}
          label="Weight Goal"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("goal", text, "weight")}
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          lbs
        </Text>
      </View>
      <Dropdown
        label="Fitness goal"
        value={fitnessData["goal"]}
        onChange={(value) => handleDataChange("goal", value, "fitness")}
        options={weightGoalOptions}
      />
      <View className="flex-row items-center gap-2">
        <InputField
          placeholder="e.g., 4"
          value={fitnessData["exercisePerWeek"]}
          label="Exercise"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) =>
            handleDataChange("exercisePerWeek", text, "fitness")
          }
        />
        <Text className="text-lg text-secondary-dark font-medium mt-2">
          per week
        </Text>
      </View>
    </View>
  );
};

export default Page4;

const weightGoalOptions = [
  { label: "Maintain", value: "maintain" },
  { label: "Bulk", value: "bulk" },
  { label: "Tone", value: "tone" },
  { label: "Strength", value: "strength" },
  { label: "Endurance", value: "endurance" },
];
