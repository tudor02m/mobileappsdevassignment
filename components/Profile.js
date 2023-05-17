import React, { Component } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import User from './User';
import styles from './styles';


//The Profile component extends the User component, in order to use the updateUserData() function
class Profile extends User {
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            error: '',
            isLoading: true,
            isEditing: false
        };
    }


    //Method used to toggle editing mode
    isEditingToggle = () => {
        this.setState(prevState => (
            {
            isEditing: !prevState.isEditing
            }
        ));
    }

    //Method used to call the updateUserData() function and then toggle editing mode back off
    updateProfile = () => {
        this.updateUserData();
        this.isEditingToggle();
    }


    
    render() {

        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const email = this.state.email;
        const isLoading = this.state.isLoading;
        const isEditing = this.state.isEditing;


        //Display a loading ActivityIndicator while the data is still loading
        if (isLoading) {
            return (
                <View>
                    <ActivityIndicator/>
                </View>
            );
        }


        //Display different content depending on whether we are in editing mode or not

        //If editing is toggled off, display the user's information and a Button to toggle editing on.
        if (!isEditing) {
            return (
                <View style={styles.container}>
                    <Text>First Name: {first_name}</Text>
                    <Text>Last Name: {last_name}</Text>
                    <Text>Email: {email}</Text>
                    <Button
                        onPress={this.isEditingToggle}
                        title="Edit Profile"
                    />
                </View>
            );

        } 
        
        //If editing is turned off, the user information fields turn into editable text inputs that can be changed, and then saved by using the Update button
        else {
            return (
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={first_name => this.setState({ first_name })}
                        value = {first_name}
                        placeholder = "Enter your First Name!"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={last_name => this.setState({ last_name })}
                        value = {last_name}
                        placeholder = "Enter your Last Name!"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={email => this.setState({ email })}
                        value = {email}
                        placeholder="Enter your Email!"
                    />
                    <Button
                        onPress={this.updateProfile}
                        title="Update Profile"
                    />
                </View>
            );
        } 
    }  
}

export default Profile;