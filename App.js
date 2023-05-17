import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Conversation from './components/Conversations';
import Profile from './components/Profile';
import MainAppNav from './components/MainAppNav';
import Contacts from './components/Contacts';
import ConversationContent from './components/ConversationContent';
import styles from './components/styles';

// Create a Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (

    //The whole application is wrapped in the NavigationContainer
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Signup" component={SignupForm} />
        <Stack.Screen name="MainAppNav" component={MainAppNav} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Contacts" component={Contacts} />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="ConversationContent" component={ConversationContent} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
