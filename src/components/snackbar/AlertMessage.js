import { Component } from "react";
import { Dimensions } from "react-native";
import { showMessage } from "react-native-flash-message";
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

import { Colors } from "../../styling";

export default class AlertMessage extends Component {

  static showMessage = (message) => {
    showMessage({
      message: message,
      type: "info",
      autoHide: true,
      duration: 2500,
      position: "top",
      backgroundColor: Colors.primaryColor,
      color: Colors.onPrimaryColor,
      style: {
        padding: SCREEN_WIDTH / 80,
      },
    });
  };

}
