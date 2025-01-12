import { convertToFixedUnits } from "./conversions";
import { expectedUnits } from "./constants/data";

const validateUnitsCamera = (meals) => {
  console.log("validating units...", meals);

  // Define the expected units for different nutrients

  // Iterate through each meal and validate the units
  for (let i = 0; i < meals.length; i++) {
    const currMeal = meals[i];

    // Validate and convert sugar, cholesterol, fiber, and salt
    if (currMeal.nutrition.sugar.unit !== expectedUnits.sugar) {
      currMeal.nutrition.sugar.amount = convertToFixedUnits(
        "sugar",
        currMeal.nutrition.sugar.amount,
        currMeal.nutrition.sugar.unit,
        expectedUnits.sugar
      );
      currMeal.nutrition.sugar.unit = expectedUnits.sugar;
    }

    if (currMeal.nutrition.cholesterol.unit !== expectedUnits.cholesterol) {
      currMeal.nutrition.cholesterol.amount = convertToFixedUnits(
        "cholesterol",
        currMeal.nutrition.cholesterol.amount,
        currMeal.nutrition.cholesterol.unit,
        expectedUnits.cholesterol
      );
      currMeal.nutrition.cholesterol.unit = expectedUnits.cholesterol;
    }

    if (currMeal.nutrition.fiber.unit !== expectedUnits.fiber) {
      currMeal.nutrition.fiber.amount = convertToFixedUnits(
        "fiber",
        currMeal.nutrition.fiber.amount,
        currMeal.nutrition.fiber.unit,
        expectedUnits.fiber
      );
      currMeal.nutrition.fiber.unit = expectedUnits.fiber;
    }

    if (currMeal.nutrition.salt.unit !== expectedUnits.salt) {
      currMeal.nutrition.salt.amount = convertToFixedUnits(
        "salt",
        currMeal.nutrition.salt.amount,
        currMeal.nutrition.salt.unit,
        expectedUnits.salt
      );
      currMeal.nutrition.salt.unit = expectedUnits.salt;
    }

    // Validate and convert macros
    const macros = currMeal.nutrition.macros;
    if (macros.protein.unit !== expectedUnits.macros.protein) {
      macros.protein.amount = convertToFixedUnits(
        "protein",
        macros.protein.amount,
        macros.protein.unit,
        expectedUnits.macros.protein
      );
      macros.protein.unit = expectedUnits.macros.protein;
    }

    if (macros.carbs.unit !== expectedUnits.macros.carbs) {
      macros.carbs.amount = convertToFixedUnits(
        "carbs",
        macros.carbs.amount,
        macros.carbs.unit,
        expectedUnits.macros.carbs
      );
      macros.carbs.unit = expectedUnits.macros.carbs;
    }

    if (macros.calories.unit !== expectedUnits.macros.calories) {
      macros.calories.amount = convertToFixedUnits(
        "calories",
        macros.calories.amount,
        macros.calories.unit,
        expectedUnits.macros.calories
      );
      macros.calories.unit = expectedUnits.macros.calories;
    }

    if (macros.fats.total.unit !== expectedUnits.macros.fats.total) {
      macros.fats.total.amount = convertToFixedUnits(
        "total",
        macros.fats.total.amount,
        macros.fats.total.unit,
        expectedUnits.macros.fats.total
      );
      macros.fats.total.unit = expectedUnits.macros.fats.total;
    }

    if (
      macros.fats.unsaturated.unit !== expectedUnits.macros.fats.unsaturated
    ) {
      macros.fats.unsaturated.amount = convertToFixedUnits(
        "unsaturated",
        macros.fats.unsaturated.amount,
        macros.fats.unsaturated.unit,
        expectedUnits.macros.fats.unsaturated
      );
      macros.fats.unsaturated.unit = expectedUnits.macros.fats.unsaturated;
    }

    if (macros.fats.saturated.unit !== expectedUnits.macros.fats.saturated) {
      macros.fats.saturated.amount = convertToFixedUnits(
        "saturated",
        macros.fats.saturated.amount,
        macros.fats.saturated.unit,
        expectedUnits.macros.fats.saturated
      );
      macros.fats.saturated.unit = expectedUnits.macros.fats.saturated;
    }

    // Validate and convert micro units for vitamins and minerals
    const vitamins = currMeal.nutrition.micros.vitamins;
    for (const vitamin in vitamins) {
      if (vitamins[vitamin].unit !== expectedUnits.micros.vitamins[vitamin]) {
        vitamins[vitamin].amount = convertToFixedUnits(
          [vitamin],
          vitamins[vitamin].amount,
          vitamins[vitamin].unit,
          expectedUnits.micros.vitamins[vitamin]
        );
        vitamins[vitamin].unit = expectedUnits.micros.vitamins[vitamin];
      }
    }

    const minerals = currMeal.nutrition.micros.minerals;
    for (const mineral in minerals) {
      if (minerals[mineral].unit !== expectedUnits.micros.minerals[mineral]) {
        minerals[mineral].amount = convertToFixedUnits(
          [mineral],
          minerals[mineral].amount,
          minerals[mineral].unit,
          expectedUnits.micros.minerals[mineral]
        );
        minerals[mineral].unit = expectedUnits.micros.minerals[mineral];
      }
    }

    // Validate and convert additives, if present
    // if (currMeal.nutrition.additives) {
    //   currMeal.nutrition.additives.forEach((additive, index) => {
    //     // Assuming additives don't have specific units, just validate the presence of values
    //     if (!additive.name || !additive.values) {
    //       console.error(
    //         `Invalid additive structure in meal ${i}, additive ${index}. Missing name or values.`
    //       );
    //     }
    //   });
    // }
  }

  // Return updated meals after all conversions
  return meals;
};

const validateUnitsRDA = (nutrition) => {
  console.log("validating units...");
  const validatedNutrition = { ...nutrition };

  // Validate fiber, sugar, salt, cholesterol first
  for (let nutrient of ["fiber", "sugar", "salt", "cholesterol"]) {
    const expectedUnit = expectedUnits[nutrient];
    const { amount, unit } = validatedNutrition[nutrient];

    // Only convert if the unit is incorrect
    if (unit !== expectedUnit) {
      validatedNutrition[nutrient].amount = convertToFixedUnits(
        nutrient,
        amount,
        unit,
        expectedUnit
      );
      validatedNutrition[nutrient].unit = expectedUnit;
    }
  }

  // Validate macros (protein, fats, carbs, and calories)
  const macros = validatedNutrition.macros;
  for (let macro of ["protein", "fats", "carbs", "calories"]) {
    const { amount, unit } = macros[macro];
    const expectedUnit = expectedUnits.macros[macro];

    // If the macro is fats, we also need to handle the subcategories: total, unsaturated, and saturated
    if (macro === "fats") {
      for (let subMacro of ["total", "unsaturated", "saturated"]) {
        const { amount, unit } = macros.fats[subMacro];
        const expectedUnit = expectedUnits.macros.fats[subMacro];

        // Only convert if the unit is incorrect
        if (unit !== expectedUnit) {
          macros.fats[subMacro].amount = convertToFixedUnits(
            `fats.${subMacro}`,
            amount,
            unit,
            expectedUnit
          );
          macros.fats[subMacro].unit = expectedUnit;
        }
      }
    } else {
      // Only convert if the unit is incorrect for other macros
      if (unit !== expectedUnit) {
        macros[macro].amount = convertToFixedUnits(
          macro,
          amount,
          unit,
          expectedUnit
        );
        macros[macro].unit = expectedUnit;
      }
    }
  }

  // Validate micros (vitamins and minerals)
  const micros = validatedNutrition.micros;

  // Validate vitamins
  for (let vitamin in micros.vitamins) {
    const { amount, unit } = micros.vitamins[vitamin];
    const expectedUnit = expectedUnits.micros.vitamins[vitamin];

    // Only convert if the unit is incorrect
    if (unit !== expectedUnit) {
      micros.vitamins[vitamin].amount = convertToFixedUnits(
        `vitamins.${vitamin}`,
        amount,
        unit,
        expectedUnit
      );
      micros.vitamins[vitamin].unit = expectedUnit;
    }
  }

  // Validate minerals
  for (let mineral in micros.minerals) {
    const { amount, unit } = micros.minerals[mineral];
    const expectedUnit = expectedUnits.micros.minerals[mineral];

    // Only convert if the unit is incorrect
    if (unit !== expectedUnit) {
      micros.minerals[mineral].amount = convertToFixedUnits(
        `minerals.${mineral}`,
        amount,
        unit,
        expectedUnit
      );
      micros.minerals[mineral].unit = expectedUnit;
    }
  }

  return validatedNutrition;
};

export { validateUnitsCamera, validateUnitsRDA };
