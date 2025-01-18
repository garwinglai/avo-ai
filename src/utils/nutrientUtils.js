export const macros = {
  energy: {
    name: "Energy",
    abbreviation: "Cal",
    amount_per_serving: "-",
  },
  proteins: {
    name: "Proteins",
    abbreviation: "Protein",
    amount_per_serving: "-",
  },
  carbohydrates: {
    name: "Carbohydrates",
    abbreviation: "Carbs",
    amount_per_serving: "-",
  },
  fat: {
    name: "Fat",
    abbreviation: "Fat",
    amount_per_serving: "-",
  },

  cholesterol: {
    name: "Cholesterol",
    abbreviation: "Chol",
    amount_per_serving: "-",
  },
};

export const vitamins = {
  vitaminA: {
    name: "Vitamin A",
    abbreviation: "Vit A",
    amount_per_serving: null,
  },
  vitaminB1: {
    name: "Vitamin B1",
    abbreviation: "Vit B1",
    amount_per_serving: null,
  },
  vitaminB2: {
    name: "Vitamin B2",
    abbreviation: "Vit B2",
    amount_per_serving: null,
  },
  vitaminB6: {
    name: "Vitamin B6",
    abbreviation: "Vit B6",
    amount_per_serving: null,
  },
  vitaminB12: {
    name: "Vitamin B12",
    abbreviation: "Vit B12",
    amount_per_serving: null,
  },
  vitaminC: {
    name: "Vitamin C",
    abbreviation: "Vit C",
    amount_per_serving: null,
  },
  vitaminD: {
    name: "Vitamin D",
    abbreviation: "Vit D",
    amount_per_serving: null,
  },
  vitaminE: {
    name: "Vitamin E",
    abbreviation: "Vit E",
    amount_per_serving: null,
  },
  vitaminK: {
    name: "Vitamin K",
    abbreviation: "Vit K",
    amount_per_serving: null,
  },
};

export const minerals = {
  calcium: {
    name: "Calcium",
    abbreviation: "Ca",
    amount_per_serving: null,
  },
  magnesium: {
    name: "Magnesium",
    abbreviation: "Mg",
    amount_per_serving: null,
  },
  potassium: {
    name: "Potassium",
    abbreviation: "K",
    amount_per_serving: null,
  },
  sodium: {
    name: "Sodium",
    abbreviation: "Na",
    amount_per_serving: null,
  },
  salt: {
    name: "Salt",
    abbreviation: "Salt",
    amount_per_serving: null,
  },
  copper: {
    name: "Copper",
    abbreviation: "Cu",
    amount_per_serving: null,
  },
  manganese: {
    name: "Manganese",
    abbreviation: "Mn",
    amount_per_serving: null,
  },
  zinc: {
    name: "Zinc",
    abbreviation: "Zn",
    amount_per_serving: null,
  },
  selenium: {
    name: "Selenium",
    abbreviation: "Se",
    amount_per_serving: null,
  },
};

export const nutritionRDI = {
  "Vit A": { amount: 0.0003689 * 1000, RDI: 0.8 }, // mcg to mg
  "Vit B1": { amount: 0.000381, RDI: 1150 }, // already in mg
  "Vit B2": { amount: 0.000431, RDI: 1200 }, // already in mg
  "Vit B6": { amount: 0.000499, RDI: 1600 }, // already in mg
  "Vit B12": { amount: 0.00000243 * 1000, RDI: 0.0024 }, // mcg to mg
  "Vit C": { amount: 0.015004, RDI: 80 }, // already in mg
  "Vit E": { amount: 0.004991, RDI: 15 }, // already in mg
  "Vit K": { amount: 0.000019995 * 1000, RDI: 0.105 }, // mcg to mg
  Ca: { amount: 0.3689, RDI: 1000 }, // already in mg
  Mg: { amount: 0.10509, RDI: 355 }, // already in mg
  K: { amount: 0.4309, RDI: 3000 }, // already in mg
  Na: { amount: 0.23994, RDI: 2300 }, // already in mg
  Salt: { amount: 0.59985, RDI: 2300 }, // already in mg
  Cu: { amount: 0.000539 * 1000, RDI: 0.9 }, // mcg to mg
  Mn: { amount: 0.000499, RDI: 2050 }, // already in mg
  Zn: { amount: 0.003999, RDI: 9500 }, // already in mg
  Se: { amount: 0.000016988 * 1000, RDI: 0.055 }, // mcg to mg
};

export const sumNutritionData = (meals) => {
  const result = {
    meal: "",
    nutrition: {
      sugar: { amount: 0, unit: "g" },
      fiber: { amount: 0, unit: "g" },
      cholesterol: { amount: 0, unit: "mg" },
      salt: { amount: 0, unit: "g" },
      macros: {
        calories: { amount: 0, unit: "kcal" },
        protein: { amount: 0, unit: "g" },
        carbs: { amount: 0, unit: "g" },
        fats: {
          total: { amount: 0, unit: "g" },
          unsaturated: { amount: 0, unit: "g" },
          saturated: { amount: 0, unit: "g" },
        },
      },
      micros: {
        vitamins: {
          vitaminA: { amount: 0, unit: "mcg" },
          vitaminC: { amount: 0, unit: "mg" },
          vitaminD: { amount: 0, unit: "mcg" },
          vitaminE: { amount: 0, unit: "mg" },
          vitaminK: { amount: 0, unit: "mcg" },
          vitaminB1: { amount: 0, unit: "mg" },
          vitaminB2: { amount: 0, unit: "mg" },
          vitaminB3: { amount: 0, unit: "mg" },
          vitaminB5: { amount: 0, unit: "mg" },
          vitaminB6: { amount: 0, unit: "mg" },
          folicAcid: { amount: 0, unit: "mcg" },
          vitaminB12: { amount: 0, unit: "mcg" },
          choline: { amount: 0, unit: "mg" },
          biotin: { amount: 0, unit: "mcg" },
        },
        minerals: {
          calcium: { amount: 0, unit: "mg" },
          chloride: { amount: 0, unit: "mg" },
          chromium: { amount: 0, unit: "mcg" },
          copper: { amount: 0, unit: "mg" },
          fluoride: { amount: 0, unit: "mcg" },
          iodine: { amount: 0, unit: "mcg" },
          iron: { amount: 0, unit: "mg" },
          magnesium: { amount: 0, unit: "mg" },
          manganese: { amount: 0, unit: "mg" },
          molybdenum: { amount: 0, unit: "mcg" },
          phosphorus: { amount: 0, unit: "mg" },
          potassium: { amount: 0, unit: "mg" },
          selenium: { amount: 0, unit: "mcg" },
          sodium: { amount: 0, unit: "mg" },
          zinc: { amount: 0, unit: "mg" },
        },
      },
    },
  };

  for (let i = 0; i < meals.length; i++) {
    const meal = meals[i];
    // Add meal food items
    result.meal += meal.foodItem + (i < meals.length - 1 ? ", " : "");

    // Add other values (fiber, sugar, cholesterol)
    result.nutrition.fiber.amount += meal.nutrition.fiber?.amount || 0;
    result.nutrition.sugar.amount += meal.nutrition.sugar?.amount || 0;
    result.nutrition.cholesterol.amount +=
      meal.nutrition.cholesterol?.amount || 0;
    result.nutrition.salt.amount += meal.nutrition.salt?.amount || 0;

    // Add macros values
    result.nutrition.macros.protein.amount +=
      meal.nutrition.macros.protein?.amount || 0;
    result.nutrition.macros.fats.total.amount +=
      meal.nutrition.macros.fats?.total?.amount || 0;
    result.nutrition.macros.fats.unsaturated.amount +=
      meal.nutrition.macros.fats?.unsaturated?.amount || 0;
    result.nutrition.macros.fats.saturated.amount +=
      meal.nutrition.macros.fats?.saturated?.amount || 0;
    result.nutrition.macros.carbs.amount +=
      meal.nutrition.macros.carbs?.amount || 0;
    result.nutrition.macros.calories.amount +=
      meal.nutrition.macros.calories?.amount || 0;

    // Add vitamins values (convert mg to mcg where necessary)
    result.nutrition.micros.vitamins.vitaminA.amount +=
      meal.nutrition.micros.vitamins.vitaminA?.amount || 0;
    result.nutrition.micros.vitamins.vitaminC.amount +=
      meal.nutrition.micros.vitamins.vitaminC?.amount || 0;
    result.nutrition.micros.vitamins.vitaminD.amount +=
      meal.nutrition.micros.vitamins.vitaminD?.amount || 0;
    result.nutrition.micros.vitamins.vitaminE.amount +=
      meal.nutrition.micros.vitamins.vitaminE?.amount || 0;
    result.nutrition.micros.vitamins.vitaminK.amount +=
      meal.nutrition.micros.vitamins.vitaminK?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB1.amount +=
      meal.nutrition.micros.vitamins.vitaminB1?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB2.amount +=
      meal.nutrition.micros.vitamins.vitaminB2?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB3.amount +=
      meal.nutrition.micros.vitamins.vitaminB3?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB5.amount +=
      meal.nutrition.micros.vitamins.vitaminB5?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB6.amount +=
      meal.nutrition.micros.vitamins.vitaminB6?.amount || 0;
    result.nutrition.micros.vitamins.folicAcid.amount +=
      meal.nutrition.micros.vitamins.folicAcid?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB12.amount +=
      meal.nutrition.micros.vitamins.vitaminB12?.amount || 0;
    result.nutrition.micros.vitamins.choline.amount +=
      meal.nutrition.micros.vitamins.choline?.amount || 0;
    result.nutrition.micros.vitamins.biotin.amount +=
      meal.nutrition.micros.vitamins.biotin?.amount || 0;

    // Add minerals values
    result.nutrition.micros.minerals.calcium.amount +=
      meal.nutrition.micros.minerals.calcium?.amount || 0;
    result.nutrition.micros.minerals.chloride.amount +=
      meal.nutrition.micros.minerals.chloride?.amount || 0;
    result.nutrition.micros.minerals.chromium.amount +=
      meal.nutrition.micros.minerals.chromium?.amount || 0;
    result.nutrition.micros.minerals.copper.amount +=
      meal.nutrition.micros.minerals.copper?.amount || 0;
    result.nutrition.micros.minerals.fluoride.amount +=
      meal.nutrition.micros.minerals.fluoride?.amount || 0;
    result.nutrition.micros.minerals.iodine.amount +=
      meal.nutrition.micros.minerals.iodine?.amount || 0;
    result.nutrition.micros.minerals.iron.amount +=
      meal.nutrition.micros.minerals.iron?.amount || 0;
    result.nutrition.micros.minerals.magnesium.amount +=
      meal.nutrition.micros.minerals.magnesium?.amount || 0;
    result.nutrition.micros.minerals.manganese.amount +=
      meal.nutrition.micros.minerals.manganese?.amount || 0;
    result.nutrition.micros.minerals.molybdenum.amount +=
      meal.nutrition.micros.minerals.molybdenum?.amount || 0;
    result.nutrition.micros.minerals.phosphorus.amount +=
      meal.nutrition.micros.minerals.phosphorus?.amount || 0;
    result.nutrition.micros.minerals.potassium.amount +=
      meal.nutrition.micros.minerals.potassium?.amount || 0;
    result.nutrition.micros.minerals.selenium.amount +=
      meal.nutrition.micros.minerals.selenium?.amount || 0;
    result.nutrition.micros.minerals.sodium.amount +=
      meal.nutrition.micros.minerals.sodium?.amount || 0;
    result.nutrition.micros.minerals.zinc.amount +=
      meal.nutrition.micros.minerals.zinc?.amount || 0;
  }
  console.log("result", result);
  return result;
};
