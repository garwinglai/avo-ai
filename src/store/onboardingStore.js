import { create } from "zustand";

const accountInformation = {
  email: "glai@gmail.com",
  password: "SUPERmonkey1!",
};

// Initial Data
const personaInfo = {
  fName: "garwing",
  lName: "lai",
  age: null,
  birthday: "",
  birthdayMonth: "1",
  birthdayDay: "28",
  birthdayYear: "1993",
  gender: "male",
  heightFt: "6",
  heightIn: "3",
  height: "",
};

const dietInfo = {
  allergens: [],
  excludeFoods: [],
  preference: "standard", // vegetarian, vegan
  priorities: [],
};

const weightGoals = {
  current: "193",
  goal: "200",
  // goalDescription: "maintain",
  // exercisePerWeek: "4",
};

const fitnessGoals = {
  goal: "maintain",
  exercisePerWeek: "4",
};

//create for account info
export const useAccountInfoStore = create((set) => ({
  accountInfo: accountInformation,
  updateAccountInfo: (value) =>
    set((state) => ({
      accountInfo: value,
    })),
  clearAccountInfo: () =>
    set(() => ({
      accountInfo: { email: "", password: "" },
    })),
}));

// Step Store
export const userOnboardingSteps = create((set) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  previousStep: () => set((state) => ({ step: state.step - 1 })),
}));

// User Data Store
export const useOnboardingUserStore = create((set) => ({
  userData: personaInfo,
  updateUserData: (key, value) =>
    set((state) => ({
      userData: { ...state.userData, [key]: value },
    })),
}));

// User Fitness Store
export const useOnboardingFitnessStore = create((set) => ({
  userFitness: fitnessGoals,
  updateUserFitenssData: (key, value) =>
    set((state) => ({
      userFitness: { ...state.userFitness, [key]: value },
    })),
}));

export const useOnboardingDietStore = create((set) => ({
  userDiet: dietInfo,
  updateUserDiet: (key, value) =>
    set((state) => ({
      userDiet: { ...state.userDiet, [key]: value },
    })),

  // Method to update priority (for multi-selection)
  updatePriority: (selection) =>
    set((state) => ({
      userDiet: { ...state.userDiet, priorities: selection },
    })),
  addAllergen: (allergen) =>
    set((state) => ({
      userDiet: {
        ...state.userDiet,
        allergens: state.userDiet.allergens.includes(allergen)
          ? state.userDiet.allergens
          : [...state.userDiet.allergens, allergen],
      },
    })),
  removeAllergen: (allergen) =>
    set((state) => ({
      userDiet: {
        ...state.userDiet,
        allergens: state.userDiet.allergens.filter((a) => a !== allergen),
      },
    })),
  addExcludeFood: (food) =>
    set((state) => ({
      userDiet: {
        ...state.userDiet,
        excludeFoods: state.userDiet.excludeFoods.includes(food)
          ? state.userDiet.excludeFoods
          : [...state.userDiet.excludeFoods, food],
      },
    })),

  removeExcludeFood: (food) =>
    set((state) => ({
      userDiet: {
        ...state.userDiet,
        excludeFoods: state.userDiet.excludeFoods.filter((a) => a !== food),
      },
    })),
}));

// Weight Goals Store
export const useOnboardingWeightStore = create((set) => ({
  userWeight: weightGoals,
  updateUserWeight: (key, value) =>
    set((state) => ({
      userWeight: { ...state.userWeight, [key]: value },
    })),
}));
