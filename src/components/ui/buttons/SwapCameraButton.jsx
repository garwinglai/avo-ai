import { Pressable, Platform } from "react-native";
import React from "react";

const SwapCameraButton = ({ children, onPress, cameraType }) => {
  return (
    <Pressable
      className="w-32 h-20 border border-white bg-black/10 rounded-lg justify-center items-center"
      onPress={() => onPress(cameraType)}
      style={{
        paddingBottom: Platform.OS === "android" ? 5 : 0,
      }}
    >
      {children}
    </Pressable>
  );
};

export default SwapCameraButton;
