/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import bookmarked from './app/views/home/bookmarked';
import search from './app/views/home/search';
import login from './app/views/login';
import {AppProvider} from './app/provider';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const Home = () => (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="Bookmarks"
        options={{title: 'Saved Searches'}}
        component={bookmarked}
      />
      <Stack.Screen name="Search" component={search} />
    </Stack.Navigator>
  );
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
