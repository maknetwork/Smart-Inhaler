import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  LayoutAnimation,
  Platform,
  PermissionsAndroid,
  UIManager,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme } from '@/Store/Theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Colors } from 'react-native-paper'
import LottieView from 'lottie-react-native'
import BluetoothSearch from '@/LottieFiles/BluetoothSearch.json'
import ConnectionSuccess from '@/LottieFiles/ConnectionSuccess.json'

import LinearGradient from 'react-native-linear-gradient'
import AnimatedEllipsis from '@/Components/AnimatedEllipsis'
import { BleManager } from 'react-native-ble-plx'
import base64 from 'react-native-base64'
import { navigateAndSimpleReset } from '@/Navigators/utils'
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
const manager = new BleManager()

const BluetoothContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [isItInScanMode, setScanMode] = useState(false)
  const [connected, setConnected] = useState(false)

  const [viewStyle, setViewStyle] = useState({})
  const startDeviceScan = () => {
    console.log('startDeviceScan')
    manager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, scannedDevice) => {
        if (error) {
          console.error(error)
        } else {
          if (scannedDevice.localName == 'Smart Inhaler') {
            manager.stopDeviceScan()

            manager.connectToDevice(scannedDevice.id).then(device => {
              console.log('connected to device')
              console.log(scannedDevice.id)
              setTimeout(() => {
                setConnected(true)
              }, 2000)
              /*   device
                .discoverAllServicesAndCharacteristics()
                .then(result => {
                  device.monitorCharacteristicForService(
                    '4b7c1487-9c7b-441a-8441-45c1f2a69c7e',
                    '5773ae67-0874-4aff-8d73-84f984ce959b',
                    (error, Characteristic) => {
                      console.log(error)
                      console.log('characteristic', Characteristic.value)
                      const decodedValue = base64.decode(Characteristic.value)
                      console.log('characteristic', decodedValue)
                    },
                    'saskkas',
                  )
                })
                .catch(err => {
                  console.log('an error occured ', err)
                })

              manager.writeCharacteristicWithoutResponseForDevice(
                scannedDevice.id,
                '4b7c1487-9c7b-441a-8441-45c1f2a69c7e',
                '5773ae67-0874-4aff-8d73-84f984ce959b',
                'sasa',
                'transaction',
              )
 */
            })
          }
        }
      },
    )
  }
  const stopDeviceScan = () => {
    console.log('stopDeviceScan')
    bleManager.stopDeviceScan()
    setScanMode(false)
  }
  const scanMode = () => {
    setScanMode(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setTimeout(() => {
      startDeviceScan()
    }, 2000)
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Allow Location Permission',
          message: 'Location permission is required foor ble ',

          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera')
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }
  useEffect(() => {
    requestLocationPermission()
  }, [])
  return (
    <View style={{ ...Layout.fill, flex: 1 }}>
      <StatusBar backgroundColor="#2946c6" barStyle="light-content" />
      {isItInScanMode ? (
        <LinearGradient
          colors={['#2946c6', '#182fa1', '#020098']}
          style={{ height: '100%', flex: 1 }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
              height: '50%',
            }}
          >
            {connected ? (
              <LottieView source={ConnectionSuccess} autoPlay loop={false} />
            ) : (
              <LottieView source={BluetoothSearch} autoPlay loop />
            )}
          </View>
          <View style={{ marginTop: 40 }}>
            {connected ? (
              <Text
                style={{
                  ...Fonts.titleSmall,
                  fontSize: 20,
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                Device Connected
              </Text>
            ) : (
              <Text
                style={{
                  ...Fonts.titleSmall,
                  fontSize: 20,
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                Searching for your device
                <AnimatedEllipsis style={{ marginTop: 'auto' }} />
              </Text>
            )}
          </View>
          <View style={{ paddingLeft: 40, paddingRight: 40, marginTop: 40 }}>
            {connected ? (
              <Button
                mode="contained"
                color="#fff"
                onPress={() => navigateAndSimpleReset('Home')}
                style={{ borderRadius: 40 }}
                contentStyle={{ padding: 10 }}
              >
                OK
              </Button>
            ) : (
              <Button
                mode="contained"
                color="#fff"
                onPress={() => {}}
                style={{ borderRadius: 40 }}
                contentStyle={{ padding: 10 }}
              >
                Cancel
              </Button>
            )}
          </View>
        </LinearGradient>
      ) : (
        <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
          <LinearGradient colors={['#2946c6', '#182fa1', '#020098']}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 40,
                padding: 40,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 20,
                  borderRadius: 90,
                }}
              >
                <MaterialCommunityIcons
                  name="bluetooth"
                  size={80}
                  color="#2946c6"
                />
              </View>
            </View>
          </LinearGradient>
          <View
            style={{
              flexGrow: 1,
              height: '100%',
              marginTop: 40,
              padding: 30,
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Text
                  style={{
                    ...Fonts.titleSmall,
                    fontSize: 20,
                    textAlign: 'center',
                  }}
                >
                  Turn on your Bluetooth connection and make sure your device is
                  close to your phone.
                </Text>
              </View>

              <View
                style={{ paddingLeft: 40, paddingRight: 40, marginTop: 40 }}
              >
                <Button
                  mode="contained"
                  color="#2946c6"
                  onPress={() => scanMode()}
                  style={{ borderRadius: 40, padding: 5 }}
                  contentStyle={{ padding: 5 }}
                >
                  Pair Device
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({})

export default BluetoothContainer
