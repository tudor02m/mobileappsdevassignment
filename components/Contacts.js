import React, { Component } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This component contains the endpoints for:

//GET /contacts = getContacts
//GET /blocked = getBlockedContacts
//POST /user/${userId}/contact = addContact
//POST /user/${userId}/block = blockUser
//DELETE /user/${userId}/contact = removeContact
//DELETE /user/${userId}/block = unblockContact
//GET /search = searchUsers

class Contacts extends Component {
    constructor(props) {
        super(props);
        

        this.state = {
            contacts: [],
            blockedContacts: [],
            isLoading: true,
            contactInput: '',
            searchQuery: '',
            searchResults: [],
        };
    }

    //Lifecycle method that is ran after the component is mounted
    componentDidMount() {
        this.getContacts();
        this.getBlockedContacts();
    }

    //Fetch contacts using a GET request to the /contacts endpoint
    getContacts = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");

        fetch("http://localhost:3333/api/1.0.0/contacts", {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
        
        .then((data) => {
            this.setState({
                contacts: data,
                isLoading: false,
            });
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }

    //Fetch blocked contacts using a GET request to the /blocked endpoint
    getBlockedContacts = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");

        fetch("http://localhost:3333/api/1.0.0/blocked", {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
        
        .then((data) => {
            this.setState({
                blockedContacts: data,
                isLoading: false,
            });
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }


    //Add a contact using a POST request to the /user/${userId}/contact endpoint
    addContact = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        const userId = this.state.contactInput;
    
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('User information updated successfully');
                this.getContacts();
            } else if (response.status === 400) {
                throw "You can't add yourself as a contact";
            } else if (response.status === 401) {
                throw "Unauthorized";
            } else if (response.status === 404) {
                throw "Not Found";
            } else {
                throw "Server Error";
            }
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }

    //Block a user using a POST request to the /user/${userId}/block endpoint
    blockUser = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        const userId = this.state.contactInput;
        
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('User blocked successfully');
                this.getBlockedContacts();  
            } else if (response.status === 400) {
                throw "You can't block yourself";
            } else if (response.status === 401) {
                throw "Unauthorized";
            } else if (response.status === 404) {
                throw "Not Found";
            } else {
                throw "Server Error";
            }
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }
    
    //Remove a contact using a DELETE request to the /user/${userId}/contact endpoint
    removeContact = async (userId) => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('User removed from contacts successfully');
                this.getContacts(); 
            } else if (response.status === 400) {
                throw "You can't remove yourself as a contact";
            } else if (response.status === 401) {
                throw "Unauthorized";
            } else if (response.status === 404) {
                throw "Not Found";
            } else {
                throw "Server Error";
            }
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }
    
    //Unblock a contact using a DELETE request to the /user/${userId}/contact endpoint
    unblockContact = async (userId) => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log('User unblocked successfully');
                this.getBlockedContacts();
            } else if (response.status === 400) {
                throw "You can't unblock yourself";
            } else if (response.status === 401) {
                throw "Unauthorized";
            } else if (response.status === 404) {
                throw "Not Found";
            } else {
                throw "Server Error";
            }
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }


    //Search for a user using a GET request to the /search endpoint, using the query parameter q: a string to search
    //for in the user's first name, last name, or email, and search_in that allows you to search through all users or contacts
    searchUsers = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        const searchQuery = this.state.searchQuery;

        fetch(`http://localhost:3333/api/1.0.0/search?q=${searchQuery}&search_in=all`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
        
        .then((data) => {
            this.setState({
                searchResults: data,
            });
        })
        .catch((error) => {
            this.setState({"error": error})
            console.log(error);
        })
    };


    //Lifecycle method that displays what the component looks like
    render() {

        //Update values based on current state
        const contacts = this.state.contacts;
        const isLoading = this.state.isLoading;
        const searchQuery = this.state.searchQuery;
        const searchResults = this.state.searchResults

        //If fetch is still ongoing, displays loading activityindicator
        if (isLoading) {
            return <ActivityIndicator />;
        }

        //Change the display depending on whether there are search results or not
        if (searchResults.length > 0) {
            
            
            //Display a text input zone, which sets the state of contactInput to whatever is written inside it
            //Display two buttons, Add Contact and Block User, which will either add a contact or block a user on press if a user ID is in the text input zone
            //Display another text input search bar and a search button to implement the search functionality.
            //Because we have search results, display them, then a list of your contacts, followed by a list of blocked users.
            //This is all wrapped in a Scrollview, to make it so when we have more contacts than we can fit on one screen, we can still scroll to see the whole list.
        return (
            <ScrollView>
                    <TextInput
                        placeholder="Enter user id"
                        value={this.state.contactInput}
                        onChangeText={contactInput => this.setState({ contactInput })}
                    />
                    <Button title="Add Contact" onPress={this.addContact} />
                    <Button title="Block User" onPress={this.blockUser} />
                    <TextInput
                        placeholder="Search contacts"
                        value={searchQuery}
                        onChangeText={text => this.setState({ searchQuery: text })}
                    />
                    <Button title="Search" onPress={this.searchUsers} />
    
                    <Text>Search Results:</Text>
                    {searchResults.map((user, index) => (
                        <Text key={index}>
                            ({user.email}) ({user.user_id})
                        </Text>
                    ))}

                <Text>Contacts:</Text>
                <FlatList
                    data={this.state.contacts}
                    renderItem={({item: contact}) => (
                        <View>
                            <Text>User ID: {contact.user_id}</Text>
                            <Text>{contact.first_name} {contact.last_name}</Text>
                            <Text>{contact.email}</Text>
                            <Button title="Remove Contact" onPress={() => this.removeContact(contact.user_id)} />
                         </View>
                    )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                />   
                <Text>Blocked Users:</Text>
                <FlatList
                    data={this.state.blockedContacts}
                    renderItem={({item: blockedContact}) => (
                        <View>
                            <Text> User ID: {blockedContact.user_id}</Text>
                            <Text>{blockedContact.first_name} {blockedContact.last_name}</Text>
                            <Text>{blockedContact.email}</Text>
                            <Button title="Unblock Contact" onPress={() => this.unblockContact(blockedContact.user_id)} />
                        </View>
                        )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                />
                    
            </ScrollView>
        );
        
        //If there are no search results, then
        } else {
        
            //Display the same as above, however instead of displaying search results, display "No users found" instead.
            return(
            <ScrollView>
                <TextInput
                    placeholder="Enter user id"
                    value={this.state.contactInput}
                    onChangeText={contactInput => this.setState({ contactInput })}
                />
                <Button title="Add Contact" onPress={this.addContact} />
                <Button title="Block User" onPress={this.blockUser} />
                <TextInput
                    placeholder="Search contacts"
                    value={searchQuery}
                    onChangeText={text => this.setState({ searchQuery: text })}
                />
                <Button title="Search" onPress={this.searchUsers} />

                {searchQuery.length > 0 && searchResults <= 0 ? 
                    <Text>No users found</Text> : 
                    <>
                        <Text>Contacts:</Text>
                        <FlatList
                            data={contacts}
                            renderItem={({item: contact}) => (
                                <View>
                                    <Text>User ID: {contact.user_id}</Text>
                                    <Text>{contact.first_name} {contact.last_name}</Text>
                                    <Text>{contact.email}</Text>
                                    <Button title="Remove Contact" onPress={() => this.removeContact(contact.user_id)} />
                                </View>
                            )}
                            keyExtractor={(item, index) => item.user_id.toString()}
                        />
                        <Text>Blocked Users:</Text>
                        <FlatList
                            data={this.state.blockedContacts}
                            renderItem={({item: blockedContact}) => (
                        <View>
                            <Text> User ID: {blockedContact.user_id}</Text>
                            <Text>{blockedContact.first_name} {blockedContact.last_name}</Text>
                            <Text>{blockedContact.email}</Text>
                            <Button title="Unblock Contact" onPress={() => this.unblockContact(blockedContact.user_id)} />
                        </View>
                        )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                />
                    </>
                }
            </ScrollView>
            )
        }

        
    };
}


export default Contacts;

