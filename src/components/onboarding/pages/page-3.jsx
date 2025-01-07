import { View, Text } from "react-native";
import React from "react";
import InputField from "../InputField";
import Dropdown from "../../ui/Dropdown";

const Page3 = ({ data, handleDataChange }) => {
  const dietOptions = [
    { label: "Standard", value: "standard" }, // Alternative to "Normal"
    { label: "Gluten Free", value: "gluten free" },
    { label: "Ketogenic", value: "ketogenic" },
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Lacto-Vegetarian", value: "lacto vegetarian" },
    { label: "Ovo-Vegetarian", value: "ovo vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Pescetarian", value: "pescetarian" },
    { label: "Paleo", value: "paleo" },
    { label: "Primal", value: "primal" },
    { label: "Low FODMAP", value: "low fodmap" },
    { label: "Whole30", value: "whole30" },
  ];

  return (
    <View>
      <Dropdown
        label="Diet"
        value={data["preference"]}
        onChange={(value) => handleDataChange("preference", value)}
        options={dietOptions}
      />
      <InputField
        placeholder="e.g., peanuts, shellfish "
        value={data["allergens"]}
        label="Allergens (separate with commas)"
        numberOfLines={4}
        onChangeText={(text) => handleDataChange("allergens", text)}
      />
      <InputField
        placeholder="e.g., onions, olives, chives"
        value={data["exludeFoods"]}
        label="Exclude foods (separate with commas)"
        onChangeText={(text) => handleDataChange("exludeFoods", text)}
      />
    </View>
  );
};

export default Page3;
