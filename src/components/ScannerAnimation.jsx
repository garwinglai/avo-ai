import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";

const ScannerAnimation = () => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View className="absolute bottom-[28rem] left-0 right-0 mx-10 h-48">
      {/* Top Left Corner */}
      <Animated.View
        style={{
          transform: [{ scale: pulse }],
        }}
        className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded"
      />
      {/* Top Right Corner */}
      <Animated.View
        style={{
          transform: [{ scale: pulse }],
        }}
        className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded"
      />
      {/* Bottom Left Corner */}
      <Animated.View
        style={{
          transform: [{ scale: pulse }],
        }}
        className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded"
      />
      {/* Bottom Right Corner */}
      <Animated.View
        style={{
          transform: [{ scale: pulse }],
        }}
        className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded"
      />
    </View>
  );
};

export default ScannerAnimation;
