import AntDesign from "@expo/vector-icons/AntDesign";
import { EvilIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Camera, CameraView } from "expo-camera"; // Import the Camera component from expo-camera
import { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhotoPreview from "../components/camera/PhotoPreview";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ScannerAnimation from "../components/ui/animations/ScannerAnimation";
import useScanFoodProduct from "../hooks/openFoodFacts/useScanFoodProduct";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwapCameraButton from "../components/ui/buttons/SwapCameraButton";
import BottomSheetComponent from "../components/sheets/BottomSheetComponent";
import useSaveToFirestore from "../hooks/firebase/firestore/useSaveToFirestore";
import RectangleButtonPrimary from "../components/ui/buttons/RectangleButtonPrimary";
import RectangleButtonSecondary from "../components/ui/buttons/RectangleButtonSecondary";
import ScannedSheetDetail from "../components/sheets/ScannedSheetDetail";
import { useAuth } from "../hooks/firebase/auth/AuthProvider";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import axios from "axios";
import { validateUnitsCamera } from "../utils/unitValidations";

const openAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAIKey,
});

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [cameraType, setCameraType] = useState(null); //camera || barcode
  const [scanned, setScanned] = useState(false);
  const { uid } = useAuth();

  const {
    scannedProduct,
    loadingScannedProduct,
    errorScanningProduct,
    getScannedProduct,
  } = useScanFoodProduct();
  const { saveToFirestore, isSavingToFirestore, errorSavingToFirestore } =
    useSaveToFirestore();

  const bottomSheetRef = useRef(null);
  const router = useRouter();
  const cameraRef = useRef(null); // Create a ref for the Camera component
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setCameraType("camera");
  }, []);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleExitCamera = () => {
    router.push("/");
  };

  const handleToggleCameraType = (cameraType) => {
    setCameraType(cameraType);
    setScanned(false);
  };

  const handleSavetoFirestore = async () => {
    const uid = "m2YIToBsgL9QawaAUNEH";
    const productId = await saveToFirestore(
      `users/${uid}/groceryList`,
      scannedProduct
    );
    console.log("pid", productId);
  };

  // Barcode Sanner
  const handleBarCodeScanned = async ({ type, data, bounds }) => {
    console.log("scanned");
    setScanned(true);
    await getScannedProduct(data);
  };

  const handleOnBottomSheetClose = () => {
    console.log("bottom sheet closed");
    setScanned(false);
    getScannedProduct(null);
  };

  // Camera
  const handleCapturePhoto = async () => {
    console.log("pressed");

    if (cameraRef.current) {
      setIsLoading(true); // Set loading state to true
      const options = {
        quality: 0.5,
        base64: true,
        exif: false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);

      setPhoto(photo.uri);
      uploadImageToFirebase(photo.uri);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null); // Reset the photo state to null
    setIsLoading(false);
  };

  const handleUsePhoto = () => {
    console.log("use photo pressed");

    // Send Image to gpt to analyze
    // FatSescret API
    // Save information in DB
    // Display stats in home page
  };

  const uploadImageToFirebase = async (uri) => {
    console.log("uploading image to firebase");
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("blob", blob);

      const filename = uri.split("/").pop();
      console.log("filename", filename);

      const storageRef = ref(storage, `users/${uid}/mealImages/${filename}`);
      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          console.log("uploaded image to storage.");
          getDownloadURL(
            ref(storage, `users/${uid}/mealImages/${filename}`)
          ).then(async (url) => {
            console.log("firebase url", url);
            analyzeImageWithOpenAI(url);
          });
        })
        .catch((error) => console.log("storage error", error));
      // TODO: Save filename to docs - so we can delete daily
      // console.log("downloadURL", downloadURL);
      // return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const analyzeImageWithOpenAI = async (imageUrl) => {
    console.log("analyzing...", imageUrl);

    // Helper schema for nutrients
    const value = z.object({
      amount: z.number(),
      unit: z.string(),
      dailyPercentage: z.number(),
    });

    // Macro schema
    const macroSchema = z.object({
      protein: value,
      fats: z.object({
        total: value,
        unsaturated: value,
        saturated: value,
      }),
      carbs: value,
      calories: value,
    });

    // Vitamin schema
    const vitaminSchema = z.object({
      vitaminA: value,
      vitaminC: value,
      vitaminD: value,
      vitaminE: value,
      vitaminK: value,
      vitaminB1: value,
      vitaminB2: value,
      vitaminB3: value,
      vitaminB5: value,
      vitaminB6: value,
      folicAcid: value,
      vitaminB12: value,
      choline: value,
      biotin: value,
    });

    // Mineral schema
    const mineralSchema = z.object({
      calcium: value,
      chloride: value,
      chromium: value,
      copper: value,
      fluoride: value,
      iodine: value,
      iron: value,
      magnesium: value,
      manganese: value,
      molybdenum: value,
      phosphorus: value,
      potassium: value,
      selenium: value,
      sodium: value,
      zinc: value,
    });

    // Meal schema
    const meal = z.object({
      foodItem: z.string(),
      brand: z.string().optional(),
      ingredients: z.array(z.string()).optional(),
      servingSize: z.number(),
      servingSizeDescription: z.string(), // New key for serving size description
      nutrition: z.object({
        sugar: value,
        cholesterol: value,
        fiber: value,
        salt: value,
        macros: macroSchema,
        micros: z.object({
          vitamins: vitaminSchema,
          minerals: mineralSchema,
        }),
        additives: z
          .array(z.object({ name: z.string(), values: value }))
          .optional(),
      }),
    });

    const mealOutput = z.object({
      meals: z.array(meal),
    });

    let eatenMeals;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: zodResponseFormat(mealOutput, "meal_consumed"),
        messages: [
          {
            role: "system",
            content:
              "You are an expert dietitian and nutritionist. Your task is to analyze images of meals, identifying all visible food items, and return detailed nutritional information for each food item based on a standard serving size.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze the image of a customer's meal and return detailed nutritional information for all visible food items based on standard serving sizes. 

                Please make sure all numeric values are rounded to two decimal places and formatted according to the standard measurement units for each nutrient. Units should only be in g, mg, or mcg.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

      const { meals } = JSON.parse(response.choices[0].message.content);
      eatenMeals = meals;

      // return openAIResponse;
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
    const validatedMeals = validateUnitsCamera(eatenMeals);
    try {
      const dailyIntakeSum = sumNutritionData(validatedMeals);
      console.log("daily", dailyIntakeSum);
    } catch (error) {
      console.log("summing intake error", error);
    }
  };

  // JSX Views
  const cameraLoading = (
    <View className="absolute inset-0 justify-center items-center bg-black opacity-50">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white">Processing...</Text>
    </View>
  );

  const toggleCameraButtons = (
    <View className="absolute bottom-60 left-0 right-0 flex-row justify-center gap-8 px-5">
      {/* Camera Toggle Button */}
      <SwapCameraButton onPress={handleToggleCameraType} cameraType={"camera"}>
        <EvilIcons name="camera" size={40} color="white" />
      </SwapCameraButton>

      {/* Barcode Scanner Toggle Button */}
      <SwapCameraButton onPress={handleBarCodeScanned} cameraType={"barcode"}>
        <FontAwesome6 name="barcode" size={40} color="white" />
      </SwapCameraButton>
    </View>
  );

  const capturePhotoButton = (
    <View className="justify-end flex-1 items-center">
      <View
        className="absolute justify-center items-center"
        style={{
          bottom: insets.bottom + 80, // Adjust the position relative to safe area insets
        }}
      >
        {/* Outer Ring */}
        <View className="w-24 h-24 border-4 border-gray-300 rounded-full justify-center items-center">
          <Pressable
            className={`w-20 h-20 bg-gray-50 justify-center items-center rounded-full`}
            style={{
              paddingBottom: Platform.OS === "android" ? 5 : 0,
            }}
            onPress={handleCapturePhoto}
          >
            <EvilIcons name="camera" size={38} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (photo)
    return (
      <PhotoPreview
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleUsePhoto={handleUsePhoto}
      />
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <CameraView
          style={styles.camera}
          onMountError={(e) => console.log("camera mount error:", e)}
          onBarcodeScanned={
            scanned || cameraType === "camera"
              ? undefined
              : handleBarCodeScanned
          }
          facing={"back"}
          ref={cameraRef}
          ratio="16:9"
          animateShutter={false}
          shutterSound={false}
          barcodeScannerSettings={{
            barcodeTypes: cameraType === "barcode" ? ["upc_a", "upc_e"] : [],
          }}
        >
          <Pressable
            onPress={handleExitCamera}
            className="flex-row items-center gap-2 absolute top-28 left-8 bg-black/30 p-4 rounded-lg z-10"
          >
            <AntDesign name="back" size={18} color="white" />
            <Text className="text-white text-p">Back</Text>
          </Pressable>

          {/* Loading Screen */}
          {isLoading || (loadingScannedProduct && cameraLoading)}

          {/* Scanner UI */}
          {cameraType === "barcode" && <ScannerAnimation />}

          {/* Toggle buttons between camera/barcode scanner */}
          {!scannedProduct && toggleCameraButtons}

          {/* Capture camera button on camera screen */}
          {cameraType === "camera" && !scannedProduct && capturePhotoButton}

          {/* Bottom sheet with scanned product details */}
          {scannedProduct && !loadingScannedProduct && (
            <View className="flex-1 z-0">
              <BottomSheetComponent
                snapPoints={[700]}
                handleOnBottomSheetClose={handleOnBottomSheetClose}
                bottomSheetRef={bottomSheetRef}
              >
                <ScannedSheetDetail scannedProduct={scannedProduct} />
              </BottomSheetComponent>
              <View className=" flex-row gap-4 justify-center absolute bottom-0 border-t border-black/10 bg-white pt-4 pb-8 px-8">
                <RectangleButtonPrimary>I&apos;ve eaten</RectangleButtonPrimary>
                <RectangleButtonSecondary>
                  Shopping List
                </RectangleButtonSecondary>
              </View>
            </View>
          )}
        </CameraView>
      </View>
    </GestureHandlerRootView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    backgroundColor: "gray",
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "50%",
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerContent: {
    marginTop: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productInfo: {
    fontSize: 16,
    marginTop: 10,
  },
});

const sumNutritionData = (meals) => {
  console.log("Summing intake...", meals);

  const result = {
    meal: "",
    nutrition: {
      sugar: { amount: 0, unit: "g" },
      fiber: { amount: 0, unit: "g" },
      cholesterol: { amount: 0, unit: "mg" },
      salt: { amount: 0, unit: "g" },
      macros: {
        calories: { amount: 0, unit: "kcal" },
        protein: { amount: 0, unit: "g" },
        carbs: { amount: 0, unit: "g" },
        fats: {
          total: { amount: 0, unit: "g" },
          unsaturated: { amount: 0, unit: "g" },
          saturated: { amount: 0, unit: "g" },
        },
      },
      micros: {
        vitamins: {
          vitaminA: { amount: 0, unit: "mcg" },
          vitaminC: { amount: 0, unit: "mg" },
          vitaminD: { amount: 0, unit: "mcg" },
          vitaminE: { amount: 0, unit: "mg" },
          vitaminK: { amount: 0, unit: "mcg" },
          vitaminB1: { amount: 0, unit: "mg" },
          vitaminB2: { amount: 0, unit: "mg" },
          vitaminB3: { amount: 0, unit: "mg" },
          vitaminB5: { amount: 0, unit: "mg" },
          vitaminB6: { amount: 0, unit: "mg" },
          folicAcid: { amount: 0, unit: "mcg" },
          vitaminB12: { amount: 0, unit: "mcg" },
          choline: { amount: 0, unit: "mg" },
          biotin: { amount: 0, unit: "mcg" },
        },
        minerals: {
          calcium: { amount: 0, unit: "mg" },
          chloride: { amount: 0, unit: "mg" },
          chromium: { amount: 0, unit: "mcg" },
          copper: { amount: 0, unit: "mg" },
          fluoride: { amount: 0, unit: "mcg" },
          iodine: { amount: 0, unit: "mcg" },
          iron: { amount: 0, unit: "mg" },
          magnesium: { amount: 0, unit: "mg" },
          manganese: { amount: 0, unit: "mg" },
          molybdenum: { amount: 0, unit: "mcg" },
          phosphorus: { amount: 0, unit: "mg" },
          potassium: { amount: 0, unit: "mg" },
          selenium: { amount: 0, unit: "mcg" },
          sodium: { amount: 0, unit: "mg" },
          zinc: { amount: 0, unit: "mg" },
        },
      },
    },
  };

  for (let i = 0; i < meals.length; i++) {
    const meal = meals[i];
    // Add meal food items
    result.meal += meal.foodItem + (i < meals.length - 1 ? ", " : "");

    // Add other values (fiber, sugar, cholesterol)
    result.nutrition.fiber.amount += meal.nutrition.fiber?.amount || 0;
    result.nutrition.sugar.amount += meal.nutrition.sugar?.amount || 0;
    result.nutrition.cholesterol.amount +=
      meal.nutrition.cholesterol?.amount || 0;
    result.nutrition.salt.amount += meal.nutrition.salt?.amount || 0;

    // Add macros values
    result.nutrition.macros.protein.amount +=
      meal.nutrition.macros.protein?.amount || 0;
    result.nutrition.macros.fats.total.amount +=
      meal.nutrition.macros.fats?.total?.amount || 0;
    result.nutrition.macros.fats.unsaturated.amount +=
      meal.nutrition.macros.fats?.unsaturated?.amount || 0;
    result.nutrition.macros.fats.saturated.amount +=
      meal.nutrition.macros.fats?.saturated?.amount || 0;
    result.nutrition.macros.carbs.amount +=
      meal.nutrition.macros.carbs?.amount || 0;
    result.nutrition.macros.calories.amount +=
      meal.nutrition.macros.calories?.amount || 0;

    // Add vitamins values (convert mg to mcg where necessary)
    result.nutrition.micros.vitamins.vitaminA.amount +=
      meal.nutrition.micros.vitamins.vitaminA?.amount || 0;
    result.nutrition.micros.vitamins.vitaminC.amount +=
      meal.nutrition.micros.vitamins.vitaminC?.amount || 0;
    result.nutrition.micros.vitamins.vitaminD.amount +=
      meal.nutrition.micros.vitamins.vitaminD?.amount || 0;
    result.nutrition.micros.vitamins.vitaminE.amount +=
      meal.nutrition.micros.vitamins.vitaminE?.amount || 0;
    result.nutrition.micros.vitamins.vitaminK.amount +=
      meal.nutrition.micros.vitamins.vitaminK?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB1.amount +=
      meal.nutrition.micros.vitamins.vitaminB1?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB2.amount +=
      meal.nutrition.micros.vitamins.vitaminB2?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB3.amount +=
      meal.nutrition.micros.vitamins.vitaminB3?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB5.amount +=
      meal.nutrition.micros.vitamins.vitaminB5?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB6.amount +=
      meal.nutrition.micros.vitamins.vitaminB6?.amount || 0;
    result.nutrition.micros.vitamins.folicAcid.amount +=
      meal.nutrition.micros.vitamins.folicAcid?.amount || 0;
    result.nutrition.micros.vitamins.vitaminB12.amount +=
      meal.nutrition.micros.vitamins.vitaminB12?.amount || 0;
    result.nutrition.micros.vitamins.choline.amount +=
      meal.nutrition.micros.vitamins.choline?.amount || 0;
    result.nutrition.micros.vitamins.biotin.amount +=
      meal.nutrition.micros.vitamins.biotin?.amount || 0;

    // Add minerals values
    result.nutrition.micros.minerals.calcium.amount +=
      meal.nutrition.micros.minerals.calcium?.amount || 0;
    result.nutrition.micros.minerals.chloride.amount +=
      meal.nutrition.micros.minerals.chloride?.amount || 0;
    result.nutrition.micros.minerals.chromium.amount +=
      meal.nutrition.micros.minerals.chromium?.amount || 0;
    result.nutrition.micros.minerals.copper.amount +=
      meal.nutrition.micros.minerals.copper?.amount || 0;
    result.nutrition.micros.minerals.fluoride.amount +=
      meal.nutrition.micros.minerals.fluoride?.amount || 0;
    result.nutrition.micros.minerals.iodine.amount +=
      meal.nutrition.micros.minerals.iodine?.amount || 0;
    result.nutrition.micros.minerals.iron.amount +=
      meal.nutrition.micros.minerals.iron?.amount || 0;
    result.nutrition.micros.minerals.magnesium.amount +=
      meal.nutrition.micros.minerals.magnesium?.amount || 0;
    result.nutrition.micros.minerals.manganese.amount +=
      meal.nutrition.micros.minerals.manganese?.amount || 0;
    result.nutrition.micros.minerals.molybdenum.amount +=
      meal.nutrition.micros.minerals.molybdenum?.amount || 0;
    result.nutrition.micros.minerals.phosphorus.amount +=
      meal.nutrition.micros.minerals.phosphorus?.amount || 0;
    result.nutrition.micros.minerals.potassium.amount +=
      meal.nutrition.micros.minerals.potassium?.amount || 0;
    result.nutrition.micros.minerals.selenium.amount +=
      meal.nutrition.micros.minerals.selenium?.amount || 0;
    result.nutrition.micros.minerals.sodium.amount +=
      meal.nutrition.micros.minerals.sodium?.amount || 0;
    result.nutrition.micros.minerals.zinc.amount +=
      meal.nutrition.micros.minerals.zinc?.amount || 0;
  }

  return result;
};
