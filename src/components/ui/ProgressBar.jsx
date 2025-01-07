import { View } from "react-native";

export default function ProgressBar({ step, totalSteps }) {
  const percentage = (step / totalSteps) * 100;
  return (
    <View className="w-full bg-white rounded-md h-2">
      <View
        className="bg-secondary h-2 rounded-md"
        style={{ width: `${percentage}%` }}
      ></View>
    </View>
  );
}
