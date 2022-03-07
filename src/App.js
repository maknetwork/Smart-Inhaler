import 'react-native-gesture-handler'
import React from 'react'
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
const App = () => (
  <Provider store={store}>
    <PaperProvider theme={theme}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationNavigator />
      </PersistGate>
    </PaperProvider>
  </Provider>
)

export default App
