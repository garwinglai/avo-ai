import openFoodFactsClient from "./apiClient";

export const fetchProductDetails = async (upc, fields) => {
  try {
    const response = await openFoodFactsClient.get(`/product/${upc}`);

    return response.data;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error fetching Open Food Facts data");
  }
};
