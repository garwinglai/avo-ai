import { showToast } from "../toast";

export const validatePages = (step, userData, userDiet, userWeight) => {
  const toastMessage = {
    type: "error",
    // body: "Please fill in all required fields.",
    topOffset: 80,
  };
  switch (parseInt(step)) {
    case 1:
      const page1Validation = validatePage1(userData);
      toastMessage.header = page1Validation.message;
      if (!page1Validation.isValid) {
        showToast(toastMessage);
        return false;
      }
      break;
    case 2:
      const page2Validation = validatePage2(userData);
      toastMessage.header = page2Validation.message;
      if (!page2Validation.isValid) {
        showToast(toastMessage); // Display specific error message
        return false;
      }
      break;
    case 3:
      // if (!validatePage2()) {
      //   showToast(toastMessage);
      //   return false;
      // }
      break;
    case 4:
      const page4Validation = validatePage4(userWeight);
      toastMessage.header = page4Validation.message;
      if (!page4Validation.isValid) {
        showToast(toastMessage); // Display specific error message
        return false;
      }
      break;
    default:
      break;
  }
  return true;
};

export const validatePage1 = (userData) => {
  // Check if required fields are filled
  const requiredFields = ["fName", "lName", "gender"]; // Replace with your actual required keys

  for (const field of requiredFields) {
    const value = userData[field];

    if (!value || value.toString().trim() === "") {
      return { isValid: false, message: `Missing field(s).` };
    }
  }

  return { isValid: true, message: "" }; // No errors
};

export const validatePage2 = (userData) => {
  // Helper functions for individual validation
  const isValidDay = (day) => day > 0 && day <= 31;
  const isValidMonth = (month) => month > 0 && month <= 12;
  const isValidYear = (year) =>
    year >= 1900 && year <= new Date().getFullYear();
  const isValidHeightIn = (inches) => inches >= 0 && inches < 12; // Inches should be between 0 and 11

  const requiredFields = [
    "birthdayDay",
    "birthdayMonth",
    "birthdayYear",
    "heightFt",
    "heightIn",
  ];

  for (const field of requiredFields) {
    const value = userData[field];
    if (!value || value.toString().trim() === "") {
      return {
        isValid: false,
        message: `Missing field(s).`,
      };
    }

    // Validate each field
    switch (field) {
      case "birthdayDay":
        if (!isValidDay(Number(value))) {
          return {
            isValid: false,
            message: "Invalid day entry (1-31).",
          };
        }
        break;
      case "birthdayMonth":
        if (!isValidMonth(Number(value))) {
          return {
            isValid: false,
            message: "Invalid month entry (1-12).",
          };
        }
        break;
      case "birthdayYear":
        if (!isValidYear(Number(value))) {
          return {
            isValid: false,
            message: `Invalid year entry (1900-${new Date().getFullYear()}).`,
          };
        }
        break;

      case "heightIn":
        if (!isValidHeightIn(Number(value))) {
          return {
            isValid: false,
            message: "Invalid height in inches (0-11).",
          };
        }
        break;
      default:
        break;
    }
  }

  return { isValid: true, message: "" }; // No errors
};

export const validatePage4 = (userWeight) => {
  // Helper functions for individual validation
  const isValidWeight = (weight) => weight > 0 && weight <= 1000; // Example range for weight in pounds
  const isValidGoalWeight = (current, goal) =>
    goal > 0 && goal <= 1000 && goal !== current;
  const isValidExercisePerWeek = (count) => count >= 0 && count <= 7; // Valid range for days of exercise per week

  const requiredFields = ["current", "goal", "exercisePerWeek"];

  for (const field of requiredFields) {
    const value = userWeight[field];
    if (!value || value.toString().trim() === "") {
      return { isValid: false, message: `Missing field(s).` };
    }

    // Validate each field
    switch (field) {
      case "current":
        if (!isValidWeight(Number(value))) {
          return {
            isValid: false,
            message: "Invalid current weight (1-1000 lbs).",
          };
        }
        break;
      case "goal":
        if (!isValidGoalWeight(Number(userWeight["current"]), Number(value))) {
          return {
            isValid: false,
            message: "Invalid weight goal (1-1000 lbs).",
          };
        }
        break;
      case "exercisePerWeek":
        if (!isValidExercisePerWeek(Number(value))) {
          return {
            isValid: false,
            message: "Invalid day entry (0-7).",
          };
        }
        break;
      default:
        break;
    }
  }

  return { isValid: true, message: "" }; // No errors
};
