import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile'; 
import Contacts from './Contacts';
import Conversation from './Conversations';

//Create a new Bottom Tab Navigator
const Tab = createBottomTabNavigator();

class MainAppNav extends Component {
  render() {
    return (

        //The Bottom Tab Navigator will contain 3 tabs
        //One with Contacts, which has the list of contacts and the ability to add/remove/block/search users, found in Contacts.js
        //The second with conversations, which displays all of the user's conversations, as well as conversation creation/editing
        //The third is the user profile, which allows the user 
      <Tab.Navigator>
        <Tab.Screen name="Contacts" component={Contacts} />
        <Tab.Screen name="Conversations" component={Conversation} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }
}

export default MainAppNav;