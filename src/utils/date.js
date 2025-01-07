// Helper function to format the date as MM/DD/YYYY
export const getCurrentDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so add 1)
  const day = String(today.getDate()).padStart(2, "0"); // Get day
  const year = today.getFullYear(); // Get full year
  return `${month}/${day}/${year}`; // Return in MM/DD/YYYY format
};

export const calculateAge = (birthMonth, birthDay, birthYear) => {
  const today = new Date();
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay); // Month is zero-based
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if the birthday has occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--; // If birthday hasn't occurred yet, subtract one from age
  }

  return age;
};
