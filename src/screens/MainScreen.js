import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FlatList, StyleSheet, View, Dimensions, Image } from 'react-native';
import { AddTodo } from '../components/AddTodo';
import { Todo } from '../components/Todo';
import { THEME } from '../theme';
import { TodoContext } from '../context/todo/todoContext';
import { ScreenContext } from '../context/screen/screenContext';
import { AppLoader } from '../components/ui/AppLoader';
import { AppText } from '../components/ui/AppText';
import { AppButton } from '../components/ui/AppButton';

export const MainScreen = () => {
  const {addTodo, todos, removeTodo, fetchTodos, loading, error} = useContext(TodoContext)
  const {changeScreen} = useContext(ScreenContext)
  const [deviceWidth, setDeviceWidth] = useState(
    Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
  );

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos])

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    const update = () => {
      const width = Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2;
      setDeviceWidth(width)
    }

    Dimensions.addEventListener('change', update)
    return () => {
      Dimensions.removeEventListener('change', update)
    }
  })

  if (loading) {
    return <AppLoader />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.error}>{error}</AppText>
        <AppButton onPress={loadTodos}>Try now</AppButton>
      </View>
    )
  }

  let content = (
    <View style={{width: deviceWidth}}>
      <FlatList
        keyExtractor={item => item.id}
        data={todos}
        renderItem={({item}) => {
          return <Todo todo={item} onRemove={removeTodo} onOpen={changeScreen}/>
        }}
      />
    </View>
  )

  if (todos.length === 0) {
    content = <View style={styles.imgWrap}>
      <Image source={require('../../assets/no-file.png')} />
    </View>
  }

  return <View>
    <AddTodo onSubmit={addTodo}/>
    {content}
  </View>
}

const styles = StyleSheet.create({
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 20,
    color: THEME.RED,
    marginBottom: 20,
  }
})
