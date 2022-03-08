import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { changeTheme } from '@/Store/Theme'
import { Appbar, Card } from 'react-native-paper'

const ExampleContainer = () => {
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
    <ScrollView
      style={{ ...Layout.fill, backgroundColor: '#fff' }}
      contentContainerStyle={[Layout.fill]}
    >
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>

      <Card>
        <Card.Title
          title="Hello Adarsh!"
          titleStyle={{ ...Fonts.textRegular, fontSize: 24 }}
          style={{ marginTop: 20 }}
        />
      </Card>
    </ScrollView>
  )
}

export default ExampleContainer
