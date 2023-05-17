import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This component contains the endpoints for:

//POST /login = loginUser

class LoginForm extends Component {

    constructor(props){
      super(props);
      this.state = {
        email: '',
        password: '',
        errorMessage: '',
      };
    }
    
    //Check if the email is in the correct format
    validateEmail = (email) => {
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      return regex.test(email);
    }

    //Check if the password is in the correct format
    validatePassword = (password) => {
      // The password must be at least 8 characters long and contain at least 1 lower case, 1 upper case, 1 number and 1 special character
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ ;
      return regex.test(password);
    }
  
    //Log in using a POST request to the /login endpoint with the user's Email and Password
    loginUser = () => {
      fetch("http://localhost:3333/api/1.0.0/login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email: this.state.email,
              password: this.state.password
          })
      })
      .then((response) => {
          if(response.status === 200){
              return response.json();
          }else if(response.status === 400) {
            throw "Invalid email/password supplied"
          }else {
            throw "Something went wrong"
          }
      })
      .then(async (rJson) => {
        console.log(rJson)
        //If the login was successful, save the user ID and session token with Asyncstorage
        try{
            await AsyncStorage.setItem("whatsthat_user_id", rJson.id)
            await AsyncStorage.setItem("whatsthat_session_token", rJson.token)
    
            this.setState({"submitted": false});
          //Then navigate to the MainAppNav, the main navigation screen
            this.props.navigation.navigate("MainAppNav")
        }catch{
          throw "something went wrong"
        }
      })
      .catch((error) => {
        this.setState({"error": error})
        this.setState({"submitted": false});
      })
  }
  
    //Function to validate the user input
    login = () => {
      this.setState({errorMessage: ''});
      const { email, password } = this.state;
      

      //Checking that both fields have been filled
      if ( !email || !password) {
        this.setState({errorMessage: 'Please fill in both fields!' })
      }

      //Checking that the email and password are in the correct data type
  
      if ( typeof email != 'string' || typeof password != 'string') {
        this.setState({errorMessage: 'Please fill in the correct data type.'})
      }
  
      //Checking that the email is in the correct format
      if (!this.validateEmail(email)) {
        this.setState({errorMessage: 'Invalid email format'});
        return;
      }

      //Checking that the password is in the correct format
      if (!this.validatePassword(password)) {
        this.setState({errorMessage: 'Password must be at least 8 characters long and contain at least 1 lower case, 1 upper case, 1 number and 1 special character'});
        return;
      }
      
      //If all the checks are passed, log in user
      this.loginUser();
      //Alert with login details
      Alert.alert("Login details", `Email: ${email}, Password: ${password}`)
    }
  
    //Rendering the login form
    //Two text inputs that take in an email and a password, with validation. If validation is not passed, an error message will pop up in red
    //under the input boxes and above the buttons.
    //Under the input boxes, there are two buttons, Login, which attempts to log in with the input details, and Registration,
    //which will navigate to a separate screen, found in the SignupForm.js, where we register new users.
    render() {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
            placeholder="Enter your email"
          />
          <TextInput
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            placeholder="Enter your password"
            secureTextEntry
          />
           {this.state.errorMessage != '' && <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>}
  
          <Button
            onPress={this.login}
            title="Log in"
          />
          <Button
            onPress={() => this.props.navigation.navigate('Signup')} 
            title="Registration"
          />
        </View>
      );
    }
  }
  
  export default LoginForm;




  

