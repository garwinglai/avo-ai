import { View, Text } from "react-native";
import React from "react";
import InputField from "../InputField";
import Dropdown from "../../ui/Dropdown";

const Page1 = ({ data, handleDataChange }) => {
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <View>
      <InputField
        placeholder="e.g., John"
        value={data["fName"]}
        label="First Name"
        onChangeText={(text) => handleDataChange("fName", text)}
      />
      <InputField
        placeholder="e.g., Doe"
        value={data["lName"]}
        label="Last Name"
        onChangeText={(text) => handleDataChange("lName", text)}
      />

      <Dropdown
        label="Gender"
        value={data["gender"]}
        onChange={(value) => handleDataChange("gender", value)}
        options={genderOptions}
      />
    </View>
  );
};

export default Page1;
