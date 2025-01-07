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

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [cameraType, setCameraType] = useState(null); //camera || barcode
  const [scanned, setScanned] = useState(false);

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
      console.log("photo", photo);
      console.log("photo", photo.uri);
      setPhoto(photo.uri);
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
