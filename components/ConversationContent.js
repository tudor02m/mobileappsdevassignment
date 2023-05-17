import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Button, TextInput, Alert, flex, flexd } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { ScrollView } from 'react-native-web';

class ConversationContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatId: null,
            messages: [],
            members: [],
            isLoading: true,
            isEditing: false,
            conversation_name: '',
            newMemberId: '',
            removeMemberId: '',
            currentMessage: '',
        };
    }


    isEditingToggle = () => {
        this.setState(prevState => (
            {
            isEditing: !prevState.isEditing
            }
        ));
    }

    editName = () => {
        this.editConversation();
        this.isEditingToggle();
    }

    componentDidMount() {
        const chatId = this.props.route.params.chatId; 
        this.setState({ chatId: chatId }, () => {
            this.getMessages();
        });
    }

    getMessages = async () => {
        const token = await AsyncStorage.getItem("whatsthat_session_token");
        const chatId = this.state.chatId;

        fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
        
        .then((data) => {
            this.setState({
                messages: data.messages,
                members: data.members,
                conversation_name: data.name,
                isLoading: false,
            });
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    };

    editConversation = async () => {
        const chatId = this.state.chatId; 
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({
                name: this.state.conversation_name
            })
        })
        .then((response) => {
            if(response.status === 200){
                console.log('Chat information updated successfully');
            }else if(response.status === 400){
                throw "Bad request";
            }else if(response.status === 401){
                throw "Unauthorized";
            }else if(response.status === 403){
                throw "Forbidden";
            }else if(response.status === 404){
                throw "Not Found";
            }else if(response.status === 500){
                throw "Server Error";
            }else throw "Something went wrong";
        })
        .catch((error) => {
            this.setState({"error": error})
            console.log(error);
        })
    }

    addMemberToConversation = async () => {
        const chatId = this.state.chatId;
        const userId = this.state.newMemberId; 
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200){
                console.log('User added to chat successfully');
                this.getMessages(); 
            }else if(response.status === 400){
                throw "Bad request";
            }else if(response.status === 401){
                throw "Unauthorized";
            }else if(response.status === 403){
                throw "Forbidden";
            }else if(response.status === 404){
                throw "Not Found";
            }else if(response.status === 500){
                throw "Server Error";
            }else throw "Something went wrong";
        })
        .catch((error) => {
            this.setState({"error": error})
            console.log(error);
        })
    }

    removeMemberFromConversation = async () => {
        const chatId = this.state.chatId;
        const userId = this.state.removeMemberId;
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200){
                console.log('User removed from chat successfully');
                this.getMessages(); 
            }else if(response.status === 400){
                throw "Bad request";
            }else if(response.status === 401){
                throw "Unauthorized";
            }else if(response.status === 403){
                throw "Forbidden";
            }else if(response.status === 404){
                throw "User Not Found in the chat";
            }else if(response.status === 500){
                throw "Server Error";
            }else throw "Something went wrong";
        })
        .catch((error) => {
            this.setState({"error": error})
            console.log(error);
        })
    }

    sendMessage = async () => {
        const chatId = this.state.chatId;
        const message = this.state.currentMessage;
        const token = await AsyncStorage.getItem("whatsthat_session_token");

        fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({
                message: message,
            })
        })
        .then((response) => {
            if(response.status === 200){
                console.log('Message sent successfully');
                this.getMessages(); 
                this.setState({ currentMessage: '' });
            }else if(response.status === 400){
                throw "Bad request";
            }else if(response.status === 401){
                throw "Unauthorized";
            }else if(response.status === 403){
                throw "Forbidden";
            }else if(response.status === 404){
                throw "Not Found";
            }else if(response.status === 500){
                throw "Server Error";
            }else throw "Something went wrong";
        })
        .catch((error) => {
            this.setState({"error": error})
            console.log(error);
        })
    }

    render() {
        const isLoading = this.state.isLoading;
        const messages = this.state.messages;
        const members = this.state.members;
        const isEditing = this.state.isEditing;
        const conversation_name = this.state.conversation_name;

        if (isLoading) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            );
        }
        if (!isEditing) {
        return (
        <View>
            <View>
            <Text>Conversation Name: {conversation_name}</Text>
            <Button
                onPress={this.isEditingToggle}
                title="Edit Conversation Name"
            />
            <Text>Members:</Text>
            {members.map((member, index) => (
                <Text key={index}>
                    {member.first_name} {member.last_name}
                </Text>
            ))}
            <TextInput
                style={styles.container}
                onChangeText={id => this.setState({ newMemberId: id, removeMemberId: id })}
                value={this.state.newMemberId}
                placeholder="Enter the user id to add or remove"
            />
            <Button
                onPress={this.addMemberToConversation}
                title="Add user to chat (must be in contacts list)"
            />
            <Button
                onPress={this.removeMemberFromConversation}
                title="Remove user from chat"
            />
            <Text >Messages:</Text>
            <View style={{ flexDirection: 'column-reverse' }}>
            {messages.map((message, index) => (
                <View key={index}>
                    <Text>
                        {message.author.first_name}: {message.message}
                    </Text>
                </View>
            ))}
            </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <TextInput
                style={{ flex: 1, borderColor: 'gray', borderWidth: 1, marginRight: 10 }}
                onChangeText={message => this.setState({ currentMessage: message })}
                value={this.state.currentMessage}
                placeholder="Type a message..."
            />
            <View style={{ width: '25%' }}>
                <Button
                    onPress={this.sendMessage}
                    title="Send"
                />
            </View>
        </View>
    </View>
        );

        } else {
            return (
                <View>
                    <View>
                        <ScrollView>
                            <TextInput
                                style={styles.container}
                                onChangeText={name => this.setState({ conversation_name: name })}
                                value={conversation_name}
                                placeholder="Enter the new conversation name"
                            />
                            <Button
                                onPress={this.editName}
                                title="Edit Conversation Name"
                            />
                            <Text>Members:</Text>
                            {members.map((member, index) => (
                                <Text key={index}>
                                    {member.first_name} {member.last_name}
                                </Text>
                            ))}
                            <TextInput
                                style={styles.container}
                                onChangeText={id => this.setState({ newMemberId: id, removeMemberId: id })}
                                value={this.state.newMemberId}
                                placeholder="Enter the user id to add or remove"
                            />
                            <Button
                                onPress={this.addMemberToConversation}
                                title="Add user to chat (must be in contacts list)"
                            />
                            <Button
                                onPress={this.removeMemberFromConversation}
                                title="Remove user from chat"
                            />
                        </ScrollView>
                    </View>
                </View>
            );
        }
    }
}

export default ConversationContent;