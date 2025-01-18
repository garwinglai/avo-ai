const { z } = require("zod");

const value = z.object({
  amount: z.number(),
  unit: z.string(),
  dailyPercent: z.number(),
});

const macroSchema = z.object({
  protein: value,
  fats: z.object({
    total: value, // total grams of fats
    unsaturated: value, // grams of unsaturated fats
    saturated: value, // grams of saturated fats
  }),
  carbs: value,
  calories: value,
});

// Vitamin schema with the value schema for each vitamin
const vitaminSchema = z.object({
  vitaminA: value, // Vitamin A
  vitaminC: value, // Vitamin C
  vitaminD: value, // Vitamin D
  vitaminE: value, // Vitamin E
  vitaminK: value, // Vitamin K
  vitaminB1: value, // Thiamin (Vitamin B1)
  vitaminB2: value, // Riboflavin (Vitamin B2)
  vitaminB3: value, // Niacin (Vitamin B3)
  vitaminB5: value, // Pantothenic Acid (Vitamin B5)
  vitaminB6: value, // Vitamin B6
  folicAcid: value, // Folate (Vitamin B9)
  vitaminB12: value, // Vitamin B12
  choline: value, // Choline
  biotin: value, // Biotin (Vitamin B7)
});

// Mineral schema with the value schema for each mineral
const mineralSchema = z.object({
  calcium: value, // Calcium
  chloride: value, // Chloride
  chromium: value, // Chromium
  copper: value, // Copper
  fluoride: value, // Fluoride
  iodine: value, // Iodine
  iron: value, // Iron
  magnesium: value, // Magnesium
  manganese: value, // Manganese
  molybdenum: value, // Molybdenum
  phosphorus: value, // Phosphorus
  potassium: value, // Potassium
  selenium: value, // Selenium
  sodium: value, // Sodium
  zinc: value, // Zinc
});

const nutritionSchema = z.object({
  fiber: value,
  sugar: value,
  salt: value,
  cholesterol: value,
  macros: macroSchema,
  micros: z.object({ vitamins: vitaminSchema, minerals: mineralSchema }),
});

// Meal schema
const meal = z.object({
  foodItem: z.string(),
  brand: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  servingSizeAmount: z.number(),
  servcingSizeUnit: z.string(),
  // servingSizeDescription: z.string(), // New key for serving size description
  nutrition: z.object({
    sugar: value,
    cholesterol: value,
    fiber: value,
    salt: value,
    macros: macroSchema,
    micros: z.object({
      vitamins: vitaminSchema,
      minerals: mineralSchema,
    }),
    additives: z
      .array(z.object({ name: z.string(), values: value }))
      .optional(),
  }),
});

const mealOutputSchema = z.object({
  foodDetected: z.boolean(),
  meals: z.array(meal),
});

export { nutritionSchema, mealOutputSchema };
