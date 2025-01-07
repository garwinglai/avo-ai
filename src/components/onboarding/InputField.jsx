import React from "react";
import { Text, TextInput, View } from "react-native";

export default function InputField({
  placeholder,
  value,
  label,
  className,
  onChangeText,
  numberOfLines,
}) {
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="text-h5 text-secondary-dark mb-1">{label}</Text>
      <TextInput
        numberOfLines={numberOfLines}
        className="w-full h-12 border border-secondary rounded-lg px-4 bg-white"
        placeholder={placeholder}
        value={value} // Bind value directly to TextInput
        onChangeText={onChangeText} // Pass onChangeText prop for handling input changes
      />
    </View>
  );
}
