import { View, Text, StyleSheet } from "react-native";
import React, { useRef, useCallback, useMemo } from "react";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Pressable, ScrollView } from "react-native-gesture-handler";

const BottomSheetComponent = ({
  children,
  snapPoints,
  handleOnBottomSheetClose,
  bottomSheetRef,
}) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index) => {
    if (index == "-1") {
      handleOnBottomSheetClose();
    }
  }, []);

  const handleCloseSheet = () => {
    bottomSheetRef.current.close();
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      index={1}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View className="flex-row justify-end w-full px-8">
          <Pressable onPress={handleCloseSheet}>
            <Text>Close</Text>
          </Pressable>
        </View>
        <ScrollView className="w-full">{children}</ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    // padding: 36,
    alignItems: "center",
  },
});
