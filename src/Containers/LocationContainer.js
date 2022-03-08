import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { Card, Colors, IconButton, ProgressBar } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'
import { getAirQualityIndex, getLocationData } from '@/Action'
import { ScrollView } from 'react-native-gesture-handler'
import manageBluetooth from '@/Config/manageBluetooth'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DashboardContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const [greeting, setGreeting] = useState('Good Morning')
  const [currentLocation, setCurrentLocation] = useState('')
  const [aqi, setAqi] = useState(1)
  const [puffsToday, setPuffsToday] = useState(2)
  const [puffsTotal, setPuffsTotal] = useState(144)

  const [pm2Concentration, setPm2Concentration] = useState(0)

  return (
    <ScrollView
      style={{ ...Layout.fill, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1 }}
    ></ScrollView>
  )
}

export default DashboardContainer
