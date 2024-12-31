import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const PhotoPreview = ({ photo, handleRetakePhoto, handleUsePhoto }) => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center">
        <Image
          source={{ uri: photo }}
          className="w-full h-screen object-contain"
        />
      </View>

      <View className="absolute bottom-10 left-0 right-0 flex-row justify-center gap-4 px-5">
        <Pressable
          className="flex-1 border border-white bg-black/50 py-3 rounded-lg justify-center items-center"
          onPress={handleRetakePhoto}
        >
          <Text className="text-white font-bold text-lg">Retake</Text>
        </Pressable>
        <Pressable
          className="flex-1 border border-white bg-black/50 py-3 rounded-lg justify-center items-center"
          onPress={handleUsePhoto}
        >
          <Text className="text-white font-bold text-lg">Use Photo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PhotoPreview;
