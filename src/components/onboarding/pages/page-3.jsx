import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import InputField from "../InputField";
import Dropdown from "../../ui/Dropdown";
import MultiSelectModal from "../../ui/MultiSelectModal";
import { useOnboardingDietStore } from "../../../store/onboardingStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const Page3 = ({ data, handleDataChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMealPriority, setSelectedMealPriority] = useState(
    data["priority"] || []
  );

  const [allergenInput, setAllergenInput] = useState("");
  const [excludeFoodInput, setExcludeFoodInput] = useState("");
  const {
    userDiet,
    updateUserDiet,
    updatePriority,
    addAllergen,
    removeAllergen,
    addExcludeFood,
    removeExcludeFood,
  } = useOnboardingDietStore();

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleInputChange = (key, value) => {
    if (key == "allergens") {
      setAllergenInput(value);
    } else if (key == "excludeFoods") {
      setExcludeFoodInput(value);
    }
  };

  const handleAddInput = (key) => {
    if (key === "allergen") {
      addAllergen(allergenInput.toLowerCase());
      setAllergenInput("");
    } else if (key === "excludeFood") {
      addExcludeFood(excludeFoodInput.toLowerCase());
      setExcludeFoodInput("");
    }
  };

  const handleRemoveInput = (key, value) => {
    if (key == "allergen") {
      removeAllergen(value);
    } else if (key == "excludeFood") {
      removeExcludeFood(value);
    }
  };

  return (
    <ScrollView>
      <Dropdown
        label="Diet"
        value={data["preference"]}
        onChange={(value) => handleDataChange("preference", value)}
        options={dietOptions}
      />
      <View className="mb-4">
        <Text className="text-h5 text-secondary-dark mb-1">
          Meal priorities
        </Text>

        <Pressable
          onPress={handleModalOpen}
          className="border py-3 rounded-lg border-gray-200 items-center bg-secondary"
        >
          <Text className="text-white text-p">
            {userDiet.priorities.length < 1 ? "Choose" : "Update"}
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-2 mt-2 flex-wrap">
          {userDiet.priorities.map((priority) => (
            <View
              key={priority}
              className="bg-white rounded-full py-1 px-2 border border-secondary-dark"
            >
              <Text className="text-secondary-dark text-xs">{priority}</Text>
            </View>
          ))}
        </View>
      </View>

      <MultiSelectModal
        label="Select Meal Priority"
        subtitle="(Max 3 choices)"
        options={mealPriority}
        value={selectedMealPriority}
        onChange={(value) => handleDataChange("priorities", value)}
        visible={isModalVisible}
        onClose={handleModalClose}
      />
      <View>
        <View className="flex-1">
          <InputField
            placeholder="e.g., peanuts, shellfish "
            value={allergenInput}
            label="Allergens (separate with commas)"
            numberOfLines={4}
            onChangeText={(text) => handleInputChange("allergens", text)}
          />
          {allergenInput && (
            <Pressable
              onPress={() => handleAddInput("allergen")}
              className="absolute right-2 bottom-[20px] rounded-lg bg-primary py-2 px-4"
            >
              <Text className="text-white">Add</Text>
            </Pressable>
          )}
        </View>
        <View className="flex-row items-center gap-2 -mt-2 mb-4 flex-wrap">
          {userDiet.allergens.map((allergen) => (
            <View
              key={allergen}
              className="flex-row items-center gap-1 bg-white rounded-full py-1 px-2 border border-secondary-dark"
            >
              <Pressable
                onPress={() => handleRemoveInput("allergen", allergen)}
              >
                <EvilIcons name="close" size={12} color="black" />
              </Pressable>
              <Text className="text-secondary-dark text-xs">{allergen}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <View className="flex-1">
          <InputField
            placeholder="e.g., onions, olives, chives"
            value={excludeFoodInput}
            label="Exclude foods (separate with commas)"
            onChangeText={(text) => handleInputChange("excludeFoods", text)}
          />
          {excludeFoodInput && (
            <Pressable
              onPress={() => handleAddInput("excludeFood")}
              className="absolute right-2 bottom-[20px] rounded-lg bg-primary py-2 px-4"
            >
              <Text className="text-white">Add</Text>
            </Pressable>
          )}
        </View>
        <View className="flex-row items-center gap-2 -mt-2 mb-4 flex-wrap">
          {userDiet.excludeFoods.map((food) => (
            <View
              key={food}
              className="flex-row items-center gap-1 bg-white rounded-full py-1 px-2 border border-secondary-dark"
            >
              <Pressable onPress={() => handleRemoveInput("excludeFood", food)}>
                <EvilIcons name="close" size={12} color="black" />
              </Pressable>
              <Text className="text-secondary-dark text-xs">{food}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Page3;

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

const mealPriority = [
  { label: "Balanced", value: "balanced" },
  { label: "Weight Loss", value: "weight loss" },
  { label: "Weight Gain", value: "weight gain" },
  { label: "High-Protein", value: "high protein" },
  { label: "Low-Carb", value: "low carb" },
  { label: "Heart-Healthy", value: "heart healthy" },
  { label: "Digestive Health", value: "digestive health" },
  { label: "Anti-Inflammatory", value: "anti inflammatory" },
];
