import axios from "axios";

const openFoodFactsClient = axios.create({
  baseURL: "https://world.openfoodfacts.org/api/v2",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "avo_ai/1.0 (team.avoai@gmail.com)", // Customize with your app details
    "api-token": process.env.OPEN_FOOD_FACTS_API_TOKEN, // Replace with the actual token
  },
});

export default openFoodFactsClient;
