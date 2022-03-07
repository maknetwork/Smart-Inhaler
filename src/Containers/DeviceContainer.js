import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme } from '@/Store/Theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Colors } from 'react-native-paper'

const BluetoothContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [userId, setUserId] = useState('9')
  const [
    fetchOne,
    { data, isSuccess, isLoading, isFetching, error },
  ] = useLazyFetchOneQuery()

  useEffect(() => {
    fetchOne(userId)
  }, [fetchOne, userId])

  const onChangeTheme = ({ theme, darkMode }) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  return (
    <View style={{ ...Layout.fill, flex: 1 }}>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ backgroundColor: '#2946c6' }}>
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
        </View>

        <View
          style={{ flexGrow: 1, height: '100%', marginTop: 40, padding: 30 }}
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

            <View style={{ paddingLeft: 40, paddingRight: 40, marginTop: 40 }}>
              <Button
                mode="contained"
                color="#2946c6"
                onPress={() => console.log('Pressed')}
                style={{ borderRadius: 40, padding: 5 }}
                contentStyle={{ padding: 5 }}
              >
                Pair Device
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default BluetoothContainer
