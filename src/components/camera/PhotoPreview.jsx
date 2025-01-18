import { View, Text, Image, Pressable, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomModal from "../ui/Modal";
import LoadingModal from "../ui/LoadingModal";

const PhotoPreview = ({
  intake,
  intakeMeals,
  photo,
  handleRetakePhoto,
  handleUsePhoto,
  progress,
  signupLoadingText,
  isModalVisible,
  handleModalClose,
}) => {
  console.log("intake meals", intakeMeals);

  const { meal, nutrition, foodDetected } = intake ?? {};
  const { sugar, fiber, cholesterol, salt, macros, micros } = nutrition ?? {};
  const { calories, carbs, fats, protein } = macros ?? {};
  const { vitamins, minerals } = micros ?? {};

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <CustomModal
          body={
            <LoadingModal
              progress={progress}
              signupLoadingText={signupLoadingText}
            />
          }
          visible={isModalVisible}
          onClose={handleModalClose}
        />
        <View className="flex-row">
          <Image
            source={{ uri: photo }}
            className="w-40 h-40 rounded-lg object-contain"
          />
          <Text>{meal}</Text>
        </View>
        <View>
          <Text>Health</Text>
        </View>
        <View>
          <Text>Vitamins</Text>
        </View>
        <View>
          <Text>Minerals</Text>
        </View>
        <Text>{JSON.stringify(intake)}</Text>
        <Text>{JSON.stringify(vitamins)}</Text>
        <Text>{JSON.stringify(minerals)}</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default PhotoPreview;
