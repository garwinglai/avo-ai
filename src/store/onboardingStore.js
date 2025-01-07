import { create } from "zustand";

const accountInformation = {
  email: "",
  password: "",
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
  allergensArr: [],
  allergens: "peanuts",
  excludeFoodsArr: [],
  exludeFoods: "",
  preference: "standard", // vegetarian, vegan
};

const weightGoals = {
  current: "193",
  goal: "200",
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

// Diet Store
export const useOnboardingDietStore = create((set) => ({
  userDiet: dietInfo,
  updateUserDiet: (key, value) =>
    set((state) => ({
      userDiet: { ...state.userDiet, [key]: value },
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
