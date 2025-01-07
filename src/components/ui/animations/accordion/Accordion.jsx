import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import RippleButton from "../../buttons/RippleButton";
import HorizontalDivider from "../../dividers/HorizontalDivider";

const Accordion = ({ title, detailComponent, detailItems }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    if (expanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, detailItems.length * 100], // Adjust height of content here
  });

  const icon = (
    <Ionicons
      name={expanded ? "chevron-up" : "chevron-down"}
      size={24}
      color="black"
    />
  );

  const pressStyle =
    "py-4 rounded-lg flex-row justify-between items-center border-b border-black/10";

  return (
    <View className="">
      {/* Accordion Header */}
      <RippleButton
        onPress={toggleAccordion}
        title={title}
        icon={icon}
        pressStyle={pressStyle}
      />

      {/* Animated Content */}
      <Animated.View
        style={{ height: contentHeight }}
        className=" overflow-hidden"
      >
        {detailComponent}
      </Animated.View>
    </View>
  );
};

export default Accordion;
