import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { auth } from "../../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { generateMealPlan } from "../../api/spoonacular/food";

const MealPlannerTab = () => {
  const [mealPlan, setMealPlan] = useState(null);

  const handleGenerateMealPlan = async () => {
    try {
      const mealPlan = await generateMealPlan("week", 1500, "vegan", "nuts");
      console.log("Generated Meal Plan:", mealPlan.data);
      setMealPlan(mealPlan.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <View>
      <Text>MealPlanTab</Text>
      <Pressable onPress={handleGenerateMealPlan}>
        <Text>Generate Meal Plan</Text>
      </Pressable>
      {mealPlan && <Text>{JSON.stringify(mealPlan)}</Text>}
    </View>
  );
};

export default MealPlannerTab;
