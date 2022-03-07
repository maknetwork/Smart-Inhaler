import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DashboardContainer, DeviceContainer } from '@/Containers'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createMaterialBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={DashboardContainer}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
        }}
      />
      <Tab.Screen
        name="Device"
        activeColor="#f0edf6"
        component={DeviceContainer}
        tabBarColor="#2946c6"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chip" color={color} size={24} />
          ),

          tabBarIconStyle: { display: 'none', backGroundColor: '#2946c6' },
          tabBarColor: '#2946c6',
          tabBarLabelPosition: 'beside-icon',
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
