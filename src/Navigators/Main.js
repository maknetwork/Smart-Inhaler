import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DashboardContainer, DeviceContainer } from '@/Containers'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createMaterialBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator barStyle={{ backgroundColor: '#694fad' }}>
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
        name="Settings"
        component={DeviceContainer}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" color={color} size={24} />
          ),

          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
