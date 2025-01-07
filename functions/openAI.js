const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
require("dotenv").config();
const OpenAI = require("openai");
const { z } = require("zod");

async function loadZodResponseFormat() {
  // Dynamically import the ESM module
  const { zodResponseFormat } = await import("openai/helpers/zod.mjs");
  return zodResponseFormat;
}

exports.openAIMacros = onRequest(async (req, res) => {
  logger.log("Request received:", req.body);
  const openAIKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: openAIKey,
  });

  // // Extract the prompt and user data from the request body
  const { prompt, userData, dietInfo, weightData } = req.body;

  const userInfoMessage = `
      The user's details are as follows:
      - Weight: ${weightData.current} kg
      - Height: ${userData.height}
      - Target Weight: ${weightData.goal} kg
      - Age: ${userData.age} years

      The user's goal is to receive a tailored macro recommendation based on their data.`;

  const fatSchema = z.object({
    unsaturatedFats: z.number(),
    saturatedFat: z.number(),
    transFat: z.number(),
    total: z.number(),
  });

  const macroSchema = z.object({
    protein: z.number(),
    fat: fatSchema,
    carbs: z.number(),
    calories: z.number(),
    cholesterol: z.number(),
    fiber: z.number(),
  });

  const vitaminSchema = z.object({
    vitaminA: z.number(), // Vitamin A
    vitaminC: z.number(), // Vitamin C
    vitaminD: z.number(), // Vitamin D
    vitaminE: z.number(), // Vitamin E
    vitaminK: z.number(), // Vitamin K
    vitaminB1: z.number(), // Thiamin (Vitamin B1)
    vitaminB2: z.number(), // Riboflavin (Vitamin B2)
    vitaminB3: z.number(), // Niacin (Vitamin B3)
    vitaminB5: z.number(), // Pantothenic Acid (Vitamin B5)
    vitaminB6: z.number(), // Vitamin B6
    folicAcid: z.number(), // Folate (Vitamin B9)
    vitaminB12: z.number(), // Vitamin B12
    choline: z.number(), // Choline
    biotin: z.number(), // Biotin (Vitamin B7)
  });

  const mineralSchema = z.object({
    calcium: z.number(), // Calcium
    chloride: z.number(), // Chloride
    chromium: z.number(), // Chromium
    copper: z.number(), // Copper
    fluoride: z.number(), // Fluoride
    iodine: z.number(), // Iodine
    iron: z.number(), // Iron
    magnesium: z.number(), // Magnesium
    manganese: z.number(), // Manganese
    molybdenum: z.number(), // Molybdenum
    phosphorus: z.number(), // Phosphorus
    potassium: z.number(), // Potassium
    selenium: z.number(), // Selenium
    sodium: z.number(), // Sodium
    zinc: z.number(), // Zinc
  });

  const nutritionSchema = z.object({
    macros: macroSchema,
    vitamins: vitaminSchema,
    minerals: mineralSchema,
  });

  const conversation = [
    {
      role: "system",
      content: `You are a nutritionist. Generate precise nutritional recommendations based on the user's weight, goals, age, and diet preferences. Return a **JSON object** with:

**Macros (grams)**:  
- calories, protein, fat, carbs, fiber, cholesterol  

**Vitamins (mg)**:  
- A, C, D, E, K, B1, B2, B3, B5, B6, folicAcid, B12, choline, biotin  

**Minerals (mg)**:  
- calcium, chloride, chromium, copper, fluoride, iodine, iron, magnesium, manganese, molybdenum, phosphorus, potassium, selenium, sodium, zinc  

**Schema**:  
json
{
  "macros": { "calories": <value>, "protein": <value>, "fat": <value>, "carbs": <value>, "fiber": <value>, "cholesterol": <value> },
  "vitamins": { "vitaminA": <value>, "vitaminC": <value>, "vitaminD": <value>, "vitaminE": <value>, "vitaminK": <value>, "vitaminB1": <value>, "vitaminB2": <value>, "vitaminB3": <value>, "vitaminB5": <value>, "vitaminB6": <value>, "folicAcid": <value>, "vitaminB12": <value>, "choline": <value>, "biotin": <value> },
  "minerals": { "calcium": <value>, "chloride": <value>, "chromium": <value>, "copper": <value>, "fluoride": <value>, "iodine": <value>, "iron": <value>, "magnesium": <value>, "manganese": <value>, "molybdenum": <value>, "phosphorus": <value>, "potassium": <value>, "selenium": <value>, "sodium": <value>, "zinc": <value> }
}
`,
    },
    {
      role: "user",
      content: `${prompt} My data: ${userInfoMessage}`,
    },
  ];

  let zodResponseFormat;

  try {
    zodResponseFormat = await loadZodResponseFormat();
  } catch (error) {
    console.error("Error loading zodResponseFormat:", error);
    res.status(500).send("Error loading zodResponseFormat");
    return;
  }

  try {
    // Dynamically load the zodResponseFormat

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      response_format: zodResponseFormat(nutritionSchema, "nutrition"),
    });

    const response = completion.choices[0].message;
    logger.log("response", response);

    res.status(200).send(response);
  } catch (error) {
    logger.error("Error fetching openAI Response:", error);
    console.error("Error fetching OpenAI response:", error);
    res.status(500).send("Error fetching OpenAI response");
  }
});
