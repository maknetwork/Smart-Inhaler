import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2946c6',
    accent: 'yellow',
  },
}
import PushNotification, { Importance } from 'react-native-push-notification'
import FlashMessage from 'react-native-flash-message'

const App = () => {
  useEffect(() => {
    PushNotification.channelExists('channel-id', function (exists) {
      if (!exists) {
        PushNotification.createChannel({
          channelId: 'channel-id', // (required)
          channelName: 'Notification Channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        })
      }
    })
  }, [])

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
          <FlashMessage position="top" />
        </PersistGate>
      </PaperProvider>
    </Provider>
  )
}

export default App
