import Toast from "react-native-toast-message";

export const showToast = ({ type, header, body, position, topOffset }) => {
  Toast.show({
    type,
    text1: header,
    text2: body,
    body,
    position,
    topOffset,
  });
};

export const handleErrors = (message, next) => {
  next();
  showToast({
    type: "error",
    header: "Error",
    body: message,
    position: "top",
    topOffset: 80,
  });
};
