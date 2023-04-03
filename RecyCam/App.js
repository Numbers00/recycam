
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  setCustomText
} from 'react-native-global-props';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  useNavigationContainerRef
} from '@react-navigation/native';

import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Footer from './src/common/Footer.js';
import Header from './src/common/Header.js';

import Record from './src/screens/Record.js';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const App = () => {
  const isLoggedIn = false;

  const [appIsReady, setAppIsReady] = useState(false);
  const [currRouteName, setCurrRouteName] = useState('');

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'Roboto': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (err) {
        console.warn(err);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const setDefaultFont = () => {
    const customTextProps = {
      style: {
        fontFamily: 'Roboto'
      }
    };
    setCustomText(customTextProps);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();

      setDefaultFont();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setCurrRouteName(navigationRef.getCurrentRoute().name);
      }}
      onStateChange={async () => {
        const previousRouteName = currRouteName;
        setCurrRouteName(navigationRef.getCurrentRoute().name);
      }}
    >
      <SafeAreaView
        style={styles.mainContainer}
        onLayout={onLayoutRootView}
      >
        <Header currRouteName={currRouteName} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarIcon: () => null,
            showLabel: false,
            style: {
              display: 'none',
            },
            tabBarStyle: {
              display: 'none'
            }
          }}
          initialRouteName={ isLoggedIn ? 'Record' : 'Record' }
        >
          <Tab.Screen
            name='Record'
            component={Record}
            initialParams={{ currRouteName }}
          />
        </Tab.Navigator>
        <Footer currRouteName={currRouteName} />
      </SafeAreaView>
      <StatusBar hidden />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
});

export default App;
