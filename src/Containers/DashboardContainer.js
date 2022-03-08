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
  const [locateMode, setLocateMode] = useState(false)

  const [puffsToday, setPuffsToday] = useState(2)
  const [puffsTotal, setPuffsTotal] = useState(144)

  const [pm2Concentration, setPm2Concentration] = useState(0)

  useEffect(async () => {
    check(PERMISSIONS.ANDROID.CAMERA).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          break
        case RESULTS.DENIED:
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
            console.log(result)
          })

          break
        case RESULTS.LIMITED:
          break
        case RESULTS.GRANTED:
          console.log('adasdasd')

          break
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore')
          break
      }
    })
    Geolocation.getCurrentPosition(
      async position => {
        console.log(position)
        const resp = await getAirQualityIndex(
          position.coords.latitude,
          position.coords.longitude,
        )

        const Location = await getLocationData(
          position.coords.latitude,
          position.coords.longitude,
        )
        console.log(JSON.stringify(Location.data.results[4].formatted_address))
        setCurrentLocation(Location.data.results[4].formatted_address)

        if (resp.success) {
          console.log(resp.data.list[0].main.aqi)
          setAqi(resp.data.list[0].main.aqi)
          console.log(resp.data.list[0].components.pm2_5)
          setPm2Concentration(resp.data.list[0].components.pm2_5)
        }
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }, [])

  const renderAQI = () => {
    // Air Quality Index. Possible values: 1, 2, 3, 4, 5. Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor.
    if (aqi == 1)
      return (
        <View
          style={{
            padding: 6,
            backgroundColor: Colors.green400,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.white,
            }}
          >
            Good
          </Text>
        </View>
      )
    else if (aqi == 2) {
      return (
        <View
          style={{
            padding: 6,
            backgroundColor: Colors.green200,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.white,
            }}
          >
            Fair
          </Text>
        </View>
      )
    } else if (aqi == 3) {
      return (
        <View
          style={{
            padding: 6,
            backgroundColor: Colors.orange300,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.white,
            }}
          >
            Moderate
          </Text>
        </View>
      )
    } else if (aqi == 4) {
      return (
        <View
          style={{
            padding: 6,
            backgroundColor: Colors.red400,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.white,
            }}
          >
            Poor
          </Text>
        </View>
      )
    } else if (aqi == 5) {
      return (
        <View
          style={{
            padding: 6,
            backgroundColor: Colors.red400,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.white,
            }}
          >
            Very Poor
          </Text>
        </View>
      )
    }
    return null
  }

  const renderPM2 = () => {
    const pm2Percentage = pm2Concentration / 500
    console.log(pm2Percentage)
    return (
      <View style={{ marginTop: 15 }}>
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: Colors.black,
            }}
          >
            PM2.5 Concentration:{' '}
            <Text style={{ color: Colors.blue300, fontSize: 12 }}>GOOD</Text>
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View>
              <Text
                style={{ marginRight: 10, fontFamily: 'Montserrat-SemiBold' }}
              >
                {Math.round(pm2Percentage * 100)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={pm2Percentage} color={'#2946c6'} />
            </View>
          </View>
        </View>
      </View>
    )
  }
  useEffect(() => {
    var myDate = new Date()
    var hrs = myDate.getHours()

    if (hrs < 12) setGreeting('Good Morning')
    else if (hrs >= 12 && hrs <= 17) setGreeting('Good Afternoon')
    else if (hrs >= 17 && hrs <= 24) setGreeting('Good Evening')
  }, [])

  const connectData = async () => {
    setInterval(async () => {
      console.log('asdasd')
      let value = await AsyncStorage.getItem('puffs')

      console.log(value)
      if (value !== null) {
        value = parseInt(value)
        setPuffsToday(value)

        setPuffsTotal(value + 100)
      } else {
        setPuffsToday(1)
        setPuffsTotal(1 + 100)
      }
    }, 5000)
  }
  useEffect(() => {
    connectData()
  }, [])
  const locateInhaler = async () => {}

  return (
    <ScrollView
      style={{ ...Layout.fill, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar backgroundColor="#2946c6" barStyle="light-content" />
      <Card style={{ height: 380 }}>
        <LinearGradient
          colors={['#2946c6', '#182fa1', '#020098']}
          style={{ flex: 1 }}
        >
          <Card.Content style={{ marginTop: 10 }}>
            <Text
              style={{
                ...Fonts.textRegular,
                fontSize: 24,
                color: '#fff',
                fontFamily: 'Montserrat-Bold',
              }}
            >
              Dashboard
            </Text>
            <Text
              style={{
                ...Fonts.textRegular,
                fontSize: 20,
                color: '#fff',

                fontFamily: 'Montserrat-Bold',
              }}
            >
              {greeting}
            </Text>
            <Card
              style={{
                marginTop: 24,
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Card.Title
                title="Daily Asthma Forecast"
                titleStyle={{
                  fontFamily: 'Montserrat-SemiBold',
                  color: Colors.grey900,
                  fontSize: 16,
                }}
                style={{ padding: 0, margin: 0 }}
                left={props => (
                  <MaterialCommunityIcon
                    {...props}
                    name="thermometer"
                    color="#2946c6"
                  />
                )}
              />
              <Card.Content>
                <Text
                  style={{
                    color: Colors.grey700,
                    textAlign: 'center',
                  }}
                >
                  for {currentLocation}
                </Text>
                <Text
                  style={{
                    color: Colors.grey700,
                    textAlign: 'center',
                  }}
                >
                  As of today, {moment().format('h:mm a')}
                </Text>
                {renderAQI()}
                {renderPM2()}
              </Card.Content>
            </Card>
          </Card.Content>
        </LinearGradient>
      </Card>
      <Card
        style={{
          margin: 16,
          elevation: 4,
          borderRadius: 20,

          padding: 10,
        }}
      >
        <Card.Title
          title="Puff Statistics"
          titleStyle={{
            fontFamily: 'Montserrat-SemiBold',
            color: Colors.grey900,
            fontSize: 16,
          }}
          right={props => (
            <IconButton
              {...props}
              icon="reload"
              color="#2946c6"
              onPress={connectData}
            />
          )}
          style={{ padding: 0, margin: 0 }}
          left={props => (
            <MaterialCommunityIcon
              {...props}
              name="chart-box-outline"
              color="#2946c6"
            />
          )}
        />
        <Card.Content>
          <View style={{ marginLeft: 18 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}
                >
                  Today
                </Text>

                <LinearGradient
                  colors={['#2946c6', '#182fa1', '#020098']}
                  style={{
                    height: 60,
                    width: 60,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 60,
                    position: 'relative',
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,

                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {puffsToday}
                  </Text>
                </LinearGradient>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2946c6',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    GOOD
                  </Text>
                </View>
              </View>
              <View
                style={{
                  padding: 1,
                  height: '100%',
                  borderRadius: 20,
                  backgroundColor: Colors.grey300,
                }}
              ></View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}
                >
                  Total
                </Text>

                <LinearGradient
                  colors={['#2946c6', '#182fa1', '#020098']}
                  style={{
                    height: 60,
                    width: 60,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 60,
                    position: 'relative',
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,

                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    {puffsTotal}
                  </Text>
                </LinearGradient>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2946c6',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    {200 - puffsTotal} LEFT
                  </Text>
                </View>
              </View>
              <View
                style={{
                  padding: 1,
                  borderRadius: 20,

                  height: '100%',
                  backgroundColor: Colors.grey300,
                }}
              ></View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}
                >
                  Locate
                </Text>
                <TouchableOpacity
                  onPress={async () => {
                    const connectedState = await manageBluetooth.isDeviceConnected(
                      '4C:11:AE:9C:B4:72',
                    )
                    console.log('connectedState', connectedState)
                    if (connectedState) {
                      setLocateMode(!locateMode)

                      if (locateMode) {
                        manageBluetooth.writeCharacteristicWithoutResponseForDevice(
                          '4C:11:AE:9C:B4:72',
                          '4b7c1487-9c7b-441a-8441-45c1f2a69c7e',
                          '5773ae67-0874-4aff-8d73-84f984ce959b',
                          base64.encode('1'),
                        )
                      } else {
                        manageBluetooth.writeCharacteristicWithoutResponseForDevice(
                          '4C:11:AE:9C:B4:72',
                          '4b7c1487-9c7b-441a-8441-45c1f2a69c7e',
                          '5773ae67-0874-4aff-8d73-84f984ce959b',
                          base64.encode('B'),
                        )
                      }
                    }
                  }}
                >
                  <LinearGradient
                    colors={['#2946c6', '#182fa1', '#020098']}
                    style={{
                      backgroundColor: Colors.grey600,
                      height: 60,
                      width: 60,
                      marginTop: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 60,
                    }}
                  >
                    <MaterialCommunityIcon
                      name="map-marker-radius"
                      color="#fff"
                      size={24}
                    />
                  </LinearGradient>
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    PRESS
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
      <Card
        style={{
          marginLeft: 16,
          marginRight: 16,
          marginBottom: 16,
          elevation: 4,
          borderRadius: 20,

          padding: 10,
        }}
      >
        <Card.Title
          title="Daily Schedule"
          titleStyle={{
            fontFamily: 'Montserrat-SemiBold',
            color: Colors.grey900,
            fontSize: 16,
          }}
          style={{ padding: 0, margin: 0 }}
          left={props => (
            <MaterialCommunityIcon
              {...props}
              name="clock-time-three-outline"
              color="#2946c6"
            />
          )}
        />
        <Card.Content>
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}
                >
                  Medication
                </Text>

                <LinearGradient
                  colors={['#2946c6', '#182fa1', '#020098']}
                  style={{
                    backgroundColor: '#2946c6',
                    height: 60,
                    width: 60,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 60,
                    position: 'relative',
                  }}
                >
                  <MaterialCommunityIcon
                    name="check"
                    style={{ position: 'absolute', top: 10 }}
                    color={'#FFF'}
                    size={12}
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,

                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    9:15
                  </Text>
                </LinearGradient>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#2946c6',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    9:00PM
                  </Text>
                </View>
              </View>
              <View
                style={{
                  padding: 1,
                  borderRadius: 20,
                  height: '100%',
                  backgroundColor: Colors.grey300,
                }}
              ></View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}
                >
                  Medication
                </Text>

                <View
                  style={{
                    backgroundColor: Colors.grey600,
                    height: 60,
                    width: 60,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 60,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,
                      fontFamily: 'Montserrat-Regular',
                    }}
                  >
                    Next
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                    }}
                  >
                    3:00PM
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

export default DashboardContainer
