import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import HealthScore from "../HealthScore";
import RectangleButtonPrimary from "../buttons/RectangleButtonPrimary";
import RectangleButtonSecondary from "../buttons/RectangleButtonSecondary";
import MacroNutrientSimple from "../MacroSimple";
import Accordion from "../animations/accordion/Accordion";
import HorizontalDivider from "../dividers/HorizontalDivider";
import VerticleDivider from "../dividers/VerticleDivider";
import AccordionDetail from "../animations/AccordionDetail";

const ScannedSheetDetail = ({ scannedProduct }) => {
  const {
    name,
    thumbnail,
    healthColor,
    healthScore,
    healthLabel,
    allNutrients,
    additives,
    macros,
    vitamins,
    minerals,
    macrosArray,
    vitaminsArray,
    mineralsArray,
    brand,
    allergens,
    novaGroupDescription,
  } = scannedProduct ?? {};

  const nutritionDetails = [
    { title: "Allergens", items: allergens },
    { title: "Additives", items: additives },
    { title: "Vitamins", items: vitaminsArray },
    { title: "Minerals", items: mineralsArray },
  ];

  // const formatAmount = (value) => {
  //   if (value == null) return "-"; // Check for undefined or null
  //   if (value === 0) return "0"; // Check if the value is exactly 0
  //   return Math.round(value).toString(); // Round the value to the nearest integer and convert it to a string
  // };

  // const macros = [
  //   { type: "Cal", amount: formatAmount(allNutrients?.["energy-kcal"]) },
  //   { type: "Protein", amount: formatAmount(allNutrients?.proteins) },
  //   { type: "Carb", amount: formatAmount(allNutrients?.carbohydrates) },
  //   { type: "Fat", amount: formatAmount(allNutrients?.fat_serving) },
  // ];

  return (
    <View className=" mb-48 flex-1 mt-4 border-t border-black/10">
      <View className="flex-1 w-full">
        <View className="flex-row gap-4 px-8 py-4 items-center justify-center">
          <View className="shadow-sm rounded-lg bg-white p-2">
            <Image
              source={{ uri: thumbnail }}
              className="w-24 h-24 aspect-square"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 justify-center gap-2">
            {/* Ensure the View takes up available space */}
            <Text className="text-h4 font-medium w-full items-center text-wrap  ">
              {name}
            </Text>
            {novaGroupDescription && (
              <Text className=" text-xs text-black/70">
                {novaGroupDescription}
              </Text>
            )}
            <View className="flex-row justify-between w-full items-center ">
              <View className="">
                {/* Render HealthScore only when scannedProduct is available */}
                <HealthScore
                  healthColor={healthColor}
                  healthLabel={healthLabel}
                  healthScore={healthScore}
                />
              </View>

              <Pressable className="">
                <Text className="text-blue-400 underline">Alternatives</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <HorizontalDivider />
        <View className=" px-8 py-4 flex-row flex-wrap items-center justify-center flex-1 gap-2">
          {Object.entries(macros).map(([key, value], index, array) => (
            <React.Fragment key={key}>
              <View className="min-w-[25%] flex-grow h-20 p-4 aspect-auto  bg-white border border-black/15 rounded-lg">
                <MacroNutrientSimple
                  type={value.abbreviation}
                  amount={value.amount_per_serving}
                />
              </View>

              {/* {index < array.length - 1 && index !== 2 && (
                <View className="divider-container">
                  <VerticleDivider />
                </View>
              )} */}
            </React.Fragment>
          ))}
        </View>
        {/* <HorizontalDivider /> */}
        <View className="flex-row justify-between items-center px-8 pt-4 pb-2">
          <Text className=" text-black/30">Amount</Text>
          <Text className=" text-black/30">per serving</Text>
        </View>
        <HorizontalDivider />
        {nutritionDetails.map((nutrition, index) => {
          const { title, items } = nutrition;
          if (items.length > 0) {
            return (
              <View className="px-8 " key={index}>
                <Accordion
                  title={title}
                  detailComponent={
                    <AccordionDetail title={title} items={items} />
                  }
                  detailItems={items}
                />
              </View>
            );
          }
        })}

        {/* <Pressable onPress={handleSavetoFirestore}>
          <Text>Save to Db</Text>
        </Pressable>
        <Pressable className="mt-20" onPress={handleBarCodeScanned}>
          <Text>Scan product</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

export default ScannedSheetDetail;
