import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This component contains the endpoints for:

//GET /chat = getConversations
//POST /chat = createConversation


//Component for creating new and displaying existing conversations 
class Conversation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            conversations: [],
            isLoading: true,
            newConversation: '',
        };
    }

    //Lifecycle method that is ran when component is mounted
    componentDidMount() {
        this.getConversations();
    }

    //Fetch all conversations using a GET request to the /chat endpoint
    getConversations = async () => {

        // Get the session token from async storage
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        console.log(token);
        console.log("Fetching conversations");
        fetch("http://localhost:3333/api/1.0.0/chat", {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
       
        
        .then((data) => {
            this.setState({
                conversations: data,
                isLoading: false,
            });
            console.log("Fetched conversations:", data); 
        })
        .catch((error) => {
            console.log("Error fetching conversations:", error);
            this.setState({"error": error})
            this.setState({"submitted": false});
        });
    };


    //Create new conversations using a POST request to the /chat endpoint
    createConversation = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        const newConversation = this.state.newConversation;
    
        fetch("http://localhost:3333/api/1.0.0/chat", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({ name: newConversation }),
        })
        .then((response) => {
            if (response.status === 201) {
                console.log('Conversation created successfully');
                this.getConversations();
                this.setstate.isLoading = false;
            } else if (response.status === 400) {
                throw "Bad request";
            } else if (response.status === 401) {
                throw "Unauthorized";
            } else if (response.status === 500) {
                throw "Server Error";
            }
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
        });
        
        //Reset the new conversation input after running the function
        this.setState({ newConversation: '' }); 
    }

    //Function used to navigate to the ConversationContent of a chat with a certain chatId
    showConversation = (chatId) => {
        this.props.navigation.navigate('ConversationContent', { chatId: chatId });
    }



    render() {
        const isLoading= this.state.isLoading;
        const conversations = this.state.conversations;
        const newConversation = this.state.newConversation;


        //Display a loading ActivityIndicator while the data is loading
        if (isLoading) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            );
        }


        //Display a input field for a conversation name with a button to create the conversation, as well as a list of all conversations the user is part of
        //The conversations use the TouchableOpacity which is a wrapper that responds to touches. Upon pressing a conversation, the app navigates to
        //the ConversationContent related to that certain conversation based on it's chat_id.
        return (
            <View>
                <TextInput
                    placeholder="New Conversation Name"
                    value={newConversation}
                    onChangeText={(text) => this.setState({ newConversation: text })}
                />
                <Button
                    title="Create Conversation"
                    onPress={this.createConversation}
                />

                <Text>Conversations:</Text>
                <FlatList
                    data={conversations}
                    renderItem={({item: conversation}) => (
                        <TouchableOpacity onPress={() => this.showConversation(conversation.chat_id)}>
                            <View>
                                <Text>{conversation.name}</Text>
                                <Text>{conversation.last_message.message}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => item.chat_id.toString()}
                />
            </View>
        );
    };
}

export default Conversation;