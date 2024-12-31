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
