import { useState } from "react";
import { fetchProductDetails } from "../../api/openFoodFacts/food";
import { parseProduct } from "../../utils/openFoodFacts/productUtils";

const useScanFoodProduct = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [loadingScannedProduct, setLoadingScannedProduct] = useState(false);
  const [errorScanningProduct, setErrorScanningProduct] = useState(null);

  const getScannedProduct = async (upc) => {
    // if (!upc) return setScannedProduct(null);

    const temp = "089094025694"; // protein powder
    // const temp = "011152814407"; //siracha
    console.log("upc", temp);

    setLoadingScannedProduct(true);
    setErrorScanningProduct(null);
    try {
      const data = await fetchProductDetails(temp);

      const parsed = parseProduct(data);

      setScannedProduct(parsed);
    } catch (err) {
      console.log("error", err);
      setErrorScanningProduct(err.message);
    } finally {
      setLoadingScannedProduct(false);
    }
  };

  return {
    scannedProduct,
    loadingScannedProduct,
    errorScanningProduct,
    getScannedProduct,
  };
};

export default useScanFoodProduct;
