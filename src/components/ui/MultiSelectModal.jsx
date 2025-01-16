import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RectangleButtonPrimary from "./buttons/RectangleButtonPrimary";
import RectangleButtonSecondary from "./buttons/RectangleButtonSecondary";
import { showToast } from "../../utils/toast";

export default function MultiSelectModal({
  label,
  options,
  value,
  onChange,
  visible,
  onClose,
  subtitle,
}) {
  const [selectedValues, setSelectedValues] = useState(value);

  const toggleSelection = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleApply = () => {
    //check if selectedValues length > 3 if so , show Alert
    if (selectedValues.length > 3) {
      Alert.alert("You can only select up to 3 choices.");
      return;
    }

    onChange(selectedValues);
    onClose(); // Close the modal after applying changes
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{label}</Text>
          <Text className="pb-6  font-light">{subtitle}</Text>
          <ScrollView style={styles.scrollView}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => toggleSelection(option.value)}
                style={styles.optionContainer}
              >
                <BouncyCheckbox
                  size={25}
                  fillColor="#95B25F" // Change the checkbox fill color
                  unfillColor="#FFFFFF"
                  text={option.label}
                  iconStyle={{ borderColor: "#95B25F" }} // Optional: Border color of checkbox
                  isChecked={selectedValues.includes(option.value)}
                  onPress={() => toggleSelection(option.value)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalActions}>
            <RectangleButtonPrimary onPress={onClose}>
              Cancel
            </RectangleButtonPrimary>
            <RectangleButtonSecondary onPress={handleApply}>
              Apply
            </RectangleButtonSecondary>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 300,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 8,
  },
});
