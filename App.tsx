// Imports follow the format: external, shared, local
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Component local file imports
import bookmarked from './app/views/home/bookmarked';
import search from './app/views/home/search';
import login from './app/views/login';

// State provider
import {AppProvider} from './app/provider';

//Navigation Initializers
const Stack = createStackNavigator();

const App: React.FC = () => {
  // Tab view kept crashing
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
