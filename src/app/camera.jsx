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
import {
  uploadBytes,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import axios from "axios";
import { validateUnitsCamera } from "../utils/unitValidations";
import { handleErrors } from "../utils/toast";
import { mealOutputSchema } from "../utils/schema/nutritionSchema";
import { sumNutritionData } from "../utils/nutrientUtils";

const openAIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAIKey,
});

const CameraScreen = ({ navigation }) => {
  // * State
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [cameraType, setCameraType] = useState(null); //camera || barcode
  const [scanned, setScanned] = useState(false);
  const [intake, setIntake] = useState(null);
  const [intakeMeals, setIntakeMeals] = useState([]);
  const [signupProgress, setSignupProgress] = useState(0);
  const [signupLoadingText, setSignupLoadingText] =
    useState("Uploading image...");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // * Custom Hooks

  const { uid } = useAuth();
  const {
    scannedProduct,
    loadingScannedProduct,
    errorScanningProduct,
    getScannedProduct,
  } = useScanFoodProduct();
  const {
    saveToFirestore,
    isSavingToFirestore,
    errorSavingToFirestore,
    saveToFirestoreCollection,
  } = useSaveToFirestore();

  // * Native Hooks
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
      setIsAnalyzingImage(true);
      setIsModalVisible(true);
      setSignupProgress(0.1);
      setSignupLoadingText("Destructuring image...");

      const { url, error: uploadStorageError } = await uploadImageToFirebase(
        photo.uri
      );

      console.log("url", url);

      if (uploadStorageError) {
        handleErrors(uploadStorageError, errorCallback);
        return;
      }

      setSignupProgress(0.35);
      setSignupLoadingText("AI is analyzing image...");
      const {
        intakeAmount,
        validatedMeals,
        error: aiVisionError,
      } = await analyzeImageWithOpenAI(url);

      if (aiVisionError) {
        // TODO: handle error
        return;
      }

      setSignupProgress(1);
      setSignupLoadingText("Complete...");
      setIsModalVisible(false);
      setIntakeMeals(validatedMeals);
      setIntake(intakeAmount);
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

  const errorCallback = () => {
    setPhoto(null);
    setIntake(null);
    setIsLoading(false);
    setIsAnalyzingImage(false);
    setIsModalVisible(false);
    setSignupLoadingText("");
  };

  const uploadImageToFirebase = async (uri) => {
    console.log("uploading image to firebase");

    const fileName = uri.split("/").pop();
    const filePath = `users/${uid}/mealImages/${fileName}`;
    const storageRef = ref(storage, filePath);
    // TODO: Save filename & filepath to docs - so we can delete daily

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      try {
        await uploadBytes(storageRef, blob);
      } catch (error) {
        console.error("Error uploading image:", error);
        return { error: "Image error." };
      }
    } catch (error) {
      console.error("Create image blob error:", error);
      return { error: "Could not use image." };
    }

    try {
      const url = await getDownloadURL(storageRef);
      console.log("download url", url);
      return { url };
    } catch (error) {
      console.log("Error getting download URL:", error);

      // * Delete image if problem getting URL
      try {
        await deleteObject(storageRef);
      } catch (error) {
        const data = {
          message: "Error cleaning up - removing captured image in storage.",
          uid,
          filePath,
          fileName,
        };
        await saveToFirestoreCollection("errors", data);
      }

      return { error: "Could not access image." };
    }
  };

  const createAIContext = (imageUrl) => {
    const openAIURL = "https://openai-chatopenai-i32lfigxrq-uc.a.run.app";
    const systemContent =
      "You are an expert dietitian and nutritionist. Your task is to analyze images of meals, identifying all visible food items, and return detailed nutritional information for each food item based on a standard serving size.";
    const response_format = zodResponseFormat(
      mealOutputSchema,
      "meal_consumed"
    );
    const prompt = [
      {
        type: "text",
        text: `Analyze the image of a customer's meal and return detailed nutritional information for all visible food items based on standard serving sizes (1 serving size). For example, servingSizeAmount: 100, servingSizeUnit g.

        Please make sure all numeric values are rounded to two decimal places and formatted according to the standard measurement units for each nutrient. Units should only be in g, mg, or mcg.`,
      },
      {
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      },
    ];

    const conversation = [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    return { conversation, response_format, openAIURL };
  };

  const analyzeImageWithOpenAI = async (imageUrl) => {
    console.log("analyzing...", imageUrl);

    const { conversation, response_format, openAIURL } =
      createAIContext(imageUrl);

    try {
      const response = await axios.post(openAIURL, {
        message: conversation,
        model: "gpt-4o-mini",
        response_format: response_format,
      });

      console.log("response", response);
      const { meals, foodDetected } = JSON.parse(response.data.content);
      console.log("foodDetected", foodDetected);
      const validatedMeals = validateUnitsCamera(meals);
      const intakeAmount = sumNutritionData(validatedMeals);
      intakeAmount.foodDetected = foodDetected;

      return { intakeAmount, validatedMeals };
    } catch (error) {
      console.error("Error analyzing image:", error);
      return { error: "AI couldn't analyze iamge." };
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
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
        intake={intake}
        intakeMeals={intakeMeals}
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleUsePhoto={handleUsePhoto}
        progress={signupProgress}
        signupLoadingText={signupLoadingText}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
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
