import axios from "axios";

const API_KEY = process.env.SPOONACULAR_API_KEY; // Ensure this environment variable is set

const spoonacularClient = axios.create({
  baseURL: "https://api.spoonacular.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the API key as a query parameter
spoonacularClient.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.apiKey = API_KEY; // Append the API key to the query parameters
  return config;
});

export default spoonacularClient;
