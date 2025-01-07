import { View, Text } from "react-native";
import React from "react";
import InputField from "../InputField";

const Page2 = ({ data, handleDataChange }) => {
  return (
    <View>
      <View className="flex-row gap-4 w-full">
        <InputField
          placeholder="e.g., 12"
          value={data["birthdayDay"]}
          label="Day"
          keyboardType="numeric"
          className="min-w-[20%]"
          onChangeText={(text) => handleDataChange("birthdayDay", text)}
        />
        <InputField
          placeholder="e.g., 09"
          value={data["birthdayMonth"]}
          label="Month"
          keyboardType="numeric"
          className="min-w-[20%]"
          onChangeText={(text) => handleDataChange("birthdayMonth", text)}
        />
        <InputField
          placeholder="e.g., 1994"
          value={data["birthdayYear"]}
          label="Year"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("birthdayYear", text)}
        />
      </View>
      <View className="flex-row gap-4 w-full">
        <InputField
          placeholder="e.g., 5"
          value={data["heightFt"]}
          label="Height (ft)"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("heightFt", text)}
        />
        <InputField
          placeholder="e.g., 11"
          value={data["heightIn"]}
          label="Height (in)"
          keyboardType="numeric"
          className="flex-grow"
          onChangeText={(text) => handleDataChange("heightIn", text)}
        />
      </View>
    </View>
  );
};

export default Page2;
