import React, {useState, useEffect, useCallback} from "react";
import { StyleSheet, View } from "react-native";
import AppNavigator from "./AppNavigator";
import { PeopleProvider } from "./PeopleContext"; // Import PeopleProvider
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
      } catch (e) {
      } finally {
        setAppIsReady(!appIsReady);
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      //if the font is loaded  the appIsReady variable is set to true
      //which will render the <View></View>
      //when it finishes creating its layout it will call this callback function
      //which will hide the SplashScreen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // doing this stops the return below with the <View>...
    return null;
  }

  return (
    <PeopleProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <AppNavigator />
      </View>
    </PeopleProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
