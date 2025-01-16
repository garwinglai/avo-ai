import React from "react";
import { View, Modal, StyleSheet, Alert } from "react-native";

export default function CustomModal({ body, visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View className="bg-white rounded-lg w-[80%] p-4 m-8 items-center gap-4">
          {body}
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
});
