import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Dropdown({ label, value, onChange, options }) {
  return (
    <View className="mb-4">
      <Text className="text-h5 text-secondary-dark">{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          // style={styles.picker}
          itemStyle={styles.pickerItem} // Adjusts individual item styles
        >
          {options.map((option, index) => (
            <Picker.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginTop: 2,
    borderRadius: 8, // Round corners of the picker container
    backgroundColor: "white"
  },
  pickerItem: {
    height: 120, // Height for each picker item
    fontSize: 16, // Font size of each item
    borderWidth: 1, // Border width for the container
    borderColor: "#95B25F", // Border color, can change this to any color
    borderRadius: 8, // Optional: rounded corners for the border
  },
});
