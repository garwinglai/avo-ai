import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

const LoadingModal = ({ progress, signupLoadingText }) => {
  return (
    <>
      <Progress.Circle
        progress={progress}
        showsText={true}
        size={70}
        thickness={3}
        color={"green"}
        fill={"transparent"}
      />
      <View className="flex-row items-center gap-2">
        <Progress.CircleSnail thickness={1} size={14} color={"black"} />
        <Text>{signupLoadingText}</Text>
      </View>
    </>
  );
};

export default LoadingModal;
