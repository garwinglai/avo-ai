import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { nutritionRDI } from "../../utils/nutrientUtils";

const AccordionDetail = ({ title, items }) => {
  const progressAmount = (amountInGrams, rdiInMilligrams) => {
    const amountInMilligrams = amountInGrams * 1000; // Convert grams to milligrams
    return amountInMilligrams / rdiInMilligrams;
  };

  return (
    <View className="flex-1">
      {items.map((item, index) => {
        const { name, amount } = item;

        if (title == "Vitamins" || title == "Minerals") {
          const recommendedRDI = nutritionRDI[name]?.RDI;
          const nutritionAmount = progressAmount(amount, recommendedRDI);

          return (
            <View key={index} className="px-4 py-2 w-full">
              <Text className="text-gray-600  py-2  ">{name}</Text>
              <Progress.Bar progress={nutritionAmount} width={null} />
            </View>
          );
        }

        return (
          <View key={index} className="px-4 ">
            <Text className="text-gray-600  py-2  ">{item}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default AccordionDetail;
