const { z } = require("zod");

// Ingredient schema
const ingredientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
});

// Macros schema
const macrosSchema = z.object({
  protein: z.number(), // grams of protein
  carbs: z.number(), // grams of carbohydrates (total, including fiber and sugar)
  fats: z.object({
    total: z.number(), // total grams of fats
    unsaturated: z.number(), // grams of unsaturated fats
    saturated: z.number(), // grams of saturated fats
    trans: z.number(), // grams of trans fats
  }),
  calories: z.number(), // total calories
});

const vitaminSchema = z.object({
  vitaminA: z.number().optional(), // Vitamin A
  vitaminC: z.number().optional(), // Vitamin C
  vitaminD: z.number().optional(), // Vitamin D
  vitaminE: z.number().optional(), // Vitamin E
  vitaminK: z.number().optional(), // Vitamin K
  vitaminB1: z.number().optional(), // Thiamin (Vitamin B1)
  vitaminB2: z.number().optional(), // Riboflavin (Vitamin B2)
  vitaminB3: z.number().optional(), // Niacin (Vitamin B3)
  vitaminB5: z.number().optional(), // Pantothenic Acid (Vitamin B5)
  vitaminB6: z.number().optional(), // Vitamin B6
  folicAcid: z.number().optional(), // Folate (Vitamin B9)
  vitaminB12: z.number().optional(), // Vitamin B12
  choline: z.number().optional(), // Choline
  biotin: z.number().optional(), // Biotin (Vitamin B7)
});

const mineralSchema = z.object({
  calcium: z.number().optional(), // Calcium
  chloride: z.number().optional(), // Chloride
  chromium: z.number().optional(), // Chromium
  copper: z.number().optional(), // Copper
  fluoride: z.number().optional(), // Fluoride
  iodine: z.number().optional(), // Iodine
  iron: z.number().optional(), // Iron
  magnesium: z.number().optional(), // Magnesium
  manganese: z.number().optional(), // Manganese
  molybdenum: z.number().optional(), // Molybdenum
  phosphorus: z.number().optional(), // Phosphorus
  potassium: z.number().optional(), // Potassium
  selenium: z.number().optional(), // Selenium
  sodium: z.number().optional(), // Sodium
  zinc: z.number().optional(), // Zinc
});

// Nutrients schema (includes vitamins and minerals)
const nutrientsSchema = z.object({
  fiber: z.number().optional(), // grams of fiber
  sugar: z.number().optional(), // grams of sugar
  sodium: z.number().optional(), // milligrams of sodium
  cholesterol: z.number().optional(), // milligrams of cholesterol
  vitamins: vitaminSchema.optional(), // All vitamins
  minerals: mineralSchema.optional(), // All minerals
});

// Meal schema
const mealSchema = z.object({
  name: z.string(),
  ingredients: z.array(ingredientSchema),
  prepTime: z.number(), // Preparation time in minutes
  instructions: z.array(z.string()), // Step-by-step instructions
  macros: macrosSchema, // Macros for the meal
  nutrients: nutrientsSchema.optional(), // Detailed nutrients
});

// Meal plan schema
const mealPlanSchema = z.object({
  duration: z.number(), // Duration in days
  dailyCalories: z.number(), // Total daily calorie target
  meals: z.array(
    z.object({
      type: z.enum(["breakfast", "lunch", "dinner", "snack"]), // Meal type
      details: mealSchema, // Details of the meal
    })
  ),
});

module.exports = { mealPlanSchema };
