import { vitamins, minerals, macros } from "../nutrientUtils";

export const parseProduct = (openFoodFactProduct) => {
  const { product, status_verbose } = openFoodFactProduct ?? {};
  const {
    _id,
    allergens_tags,
    brands,
    categories,
    image_thumb_url,
    nutrient_levels,
    nutriments,
    additives_n,
    additives_original_tags,
    product_name,
    serving_quantity,
    serving_quantity_unit,
    serving_size,
    vitamins_tags,
    minerals_tags,
    nutriscore_data, // might be undefined
    nutriscore_score,
    nutriscore_grade,
    nutrition_score_beverage,
    nova_group, //1 - 4 processed
    nova_groups_markers,
    nova_groups_tags,
  } = product ?? {};

  // Use optional chaining to safely access `nutriscore_data` and its components
  const { negative = {}, positive = {} } = nutriscore_data?.components || {};

  const flattenedNovaGroupsMarkers = flattenNovaGroupsMarkers(
    nova_groups_markers ?? {}
  );

  const cleanedAllergensTags = cleanTags(allergens_tags ?? []);
  const cleanedAdditiveTags = cleanTags(additives_original_tags ?? []);
  const cleanedCategories = cleanCategories(categories ?? "");
  const { healthScore, healthColor, healthLabel } = calculateHealthScore(
    nutriscore_score ?? null
  );
  const novaGroupDescription = getNovaGroupDescription(nova_group ?? 0);
  // Example usage for updating macros, vitamins, and minerals

  const { updatedCategory: updatedMacros, nutritionArray: macrosArray } =
    updateNutrientCategory(macros, nutriments);
  const { updatedCategory: updatedVitamins, nutritionArray: mineralsArray } =
    updateNutrientCategory(minerals, nutriments);
  const { updatedCategory: updatedMinerals, nutritionArray: vitaminsArray } =
    updateNutrientCategory(vitamins, nutriments);

  const parsedProduct = {
    id: _id ?? null,
    name: product_name ?? "Unknown Product",
    servingSize: serving_size ?? "N/A",
    servingQuantity: serving_quantity ?? 0,
    servingQuantityUnit: serving_quantity_unit ?? "N/A",
    brand: brands ?? "Unknown Brand",
    thumbnail: image_thumb_url ?? "",
    productFound: status_verbose ?? "Not Found",
    allergens: cleanedAllergensTags,
    additives: cleanedAdditiveTags,
    categories: cleanedCategories,
    allNutrients: nutriments ?? {},
    nutrientLevels: nutrient_levels ?? {},
    additivesCount: additives_n ?? 0,
    macros: updatedMacros,
    vitamins: updatedVitamins,
    minerals: updatedMinerals,
    macrosArray,
    mineralsArray,
    vitaminsArray,
    nutriScore: nutriscore_score ?? 0,
    nutriScoreGrade: nutriscore_grade ?? "Unknown",
    nutritionScoreBeverage: nutrition_score_beverage ?? 0,
    novaGroup: nova_group ?? 0,
    novaGroupDescription,
    novaGroupMarkers: flattenedNovaGroupsMarkers,
    positiveComponents: positive ?? {},
    negativeComponents: negative ?? {},
    healthScore,
    healthColor,
    healthLabel,
  };

  return parsedProduct;
};

const flattenNovaGroupsMarkers = (data) => {
  const flattened = [];

  for (const group in data) {
    if (data.hasOwnProperty(group)) {
      const entries = data[group];
      entries.forEach(([type, value]) => {
        flattened.push({
          group: parseInt(group, 10),
          type: type,
          value: value.includes(":") ? value.split(":")[1] : value, // Remove everything before and including the colon
        });
      });
    }
  }

  return flattened;
};

const cleanTags = (tags) => {
  return tags.map(
    (tag) =>
      tag.includes(":")
        ? tag.split(":")[1].replace(/-/g, " ") // Remove colon and replace hyphens with spaces
        : tag.replace(/-/g, " ") // Replace hyphens for tags without colon
  );
};

const cleanCategories = (category) => {
  return category.split(",");
};

const calculateHealthScore = (nutriscore) => {
  // If the nutriscore is not available (null or undefined), return default values
  if (nutriscore == null) {
    return {
      healthScore: 0,
      healthLabel: "Unknown",
      healthColor: "#9E9E9E", // Gray color for unknown
    };
  }

  // Define the NutriScore grade ranges
  const gradeRanges = {
    A: { min: -15, max: -1 },
    B: { min: 0, max: 10 },
    C: { min: 11, max: 18 },
    D: { min: 19, max: 30 },
    E: { min: 31, max: 40 },
  };

  let healthScore = 0;
  let healthLabel = "";
  let healthColor = "";

  // Determine the grade and calculate the health score
  if (nutriscore >= gradeRanges.A.min && nutriscore <= gradeRanges.A.max) {
    healthScore = 100; // Best score (A grade)
    healthLabel = "Excellent";
    healthColor = "#4CAF50"; // Green for excellent
  } else if (
    nutriscore >= gradeRanges.B.min &&
    nutriscore <= gradeRanges.B.max
  ) {
    healthScore =
      90 -
      ((nutriscore - gradeRanges.B.min) /
        (gradeRanges.B.max - gradeRanges.B.min)) *
        30;
    healthLabel = "Good";
    healthColor = "#8BC34A"; // Light Green for good
  } else if (
    nutriscore >= gradeRanges.C.min &&
    nutriscore <= gradeRanges.C.max
  ) {
    healthScore =
      60 -
      ((nutriscore - gradeRanges.C.min) /
        (gradeRanges.C.max - gradeRanges.C.min)) *
        30;
    healthLabel = "Average";
    healthColor = "#FFEB3B"; // Yellow for average
  } else if (
    nutriscore >= gradeRanges.D.min &&
    nutriscore <= gradeRanges.D.max
  ) {
    healthScore =
      30 -
      ((nutriscore - gradeRanges.D.min) /
        (gradeRanges.D.max - gradeRanges.D.min)) *
        30;
    healthLabel = "Poor";
    healthColor = "#FF9800"; // Orange for poor
  } else if (
    nutriscore >= gradeRanges.E.min &&
    nutriscore <= gradeRanges.E.max
  ) {
    healthScore = 0; // Worst score (E grade)
    healthLabel = "Very Poor";
    healthColor = "#F44336"; // Dark Red for very poor
  }

  // Clamp the score between 0 and 100 to ensure it is within bounds
  healthScore = Math.max(0, Math.min(100, healthScore));

  return {
    healthScore: Math.round(healthScore),
    healthLabel: healthLabel,
    healthColor: healthColor,
  };
};

const getNovaGroupDescription = (novaGroup) => {
  const novaGroupDescriptions = {
    1: "Unprocessed or minimally processed foods",
    2: "Processed culinary ingredients",
    3: "Processed foods",
    4: "Ultra-processed food",
  };

  return novaGroupDescriptions[novaGroup] || "Unknown group"; // Default if no match
};

const updateNutrientCategory = (category, nutrition) => {
  const nutritionArray = []; // Array to store abbreviations with amount

  for (const key in category) {
    const nutrientKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    if (nutrition[nutrientKey] !== undefined) {
      const nutritionAmount = nutrition[nutrientKey];

      // Update and round the value
      category[key].amount_per_serving = nutritionAmount;

      // Push the abbreviation and amount to the array
      nutritionArray.push({
        name: category[key].abbreviation,
        amount: nutritionAmount,
      });
    }
  }

  return { updatedCategory: category, nutritionArray }; // Return updated category and array of {name, amount}
};
