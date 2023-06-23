import React, { useRef } from 'react';
import {
  StyleSheet,
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import { Store } from './src/stores/Store'
import { Provider } from 'react-redux'

import MainNavigationStack from './src/navigation/MainNavigationStack'


const App = () => {
  const myLocalFlashMessage = useRef(null)

  return (
    <Provider store={Store}>
      <MainNavigationStack />
      <FlashMessage ref={myLocalFlashMessage} />
    </Provider>

  );
};

const styles = StyleSheet.create({

});

export default App;
