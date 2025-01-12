import spoonacularClient from "./apiClient";

export const generateMealPlan = async (
  timeFrame = "day",
  targetCalories = 2000,
  diet = "",
  exclude = ""
) => {
  try {
    const response = await spoonacularClient.get("/mealplanner/generate", {
      params: {
        timeFrame,
        targetCalories,
        diet,
        exclude,
      },
    });

    return response;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan from Spoonacular");
  }
};
``