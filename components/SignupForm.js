import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import styles from './styles';


//This component contains the endpoints for:

//POST /user = createUser


class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: '',
        };
    }


    //Fetch request using POST to the /user endpoint
    createUser = () => {
      return fetch("http://localhost:3333/api/1.0.0/user", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              email: this.state.email,
              password: this.state.password
          })
      })
      .then((response) => {
        if(response.status === 201){
          return response.json();
        }else if(response.status === 400) {
          throw "Email already exists or password isn't strong enough"
        }else {
          throw "Something went wrong"
        }
      })
      .then((rJson) => {
        console.log(rJson)
        this.setState({"error": "User added successfully"})
        this.setState({"submitted": false});
        this.props.navigation.navigate("Login")
      })
      .catch((error) => {
        this.setState({"error": error})
        this.setState({"submitted": false});
      })
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


    //Fuction to validate and create a new user
    signup = () => {

        //Reset the error message state
        this.setState({errorMessage:""});
        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const email = this.state.email;
        const password = this.state.password;
        const confirmPassword = this.state.confirmPassword;


        //Checking that all fields have been filled
        if (!first_name || !last_name || !email || !password || !confirmPassword) {
            this.setState({errorMessage: 'Please fill in all fields!'});
            return;
        }
        //Check that the password is in the correct format
        if (!this.validatePassword(password)) {
          this.setState({errorMessage: 'Password must be at least 8 characters long and contain at least 1 lower case, 1 upper case, 1 number and 1 special character'});
          return;
        }

        //Check that both password fields contain the same password
        if (password !== confirmPassword) {
            this.setState({errorMessage: 'Please make sure the password is the same in both fields!'});
            return;
        }

        //Check that the email is in the correct format
        if (!this.validateEmail(email)) {
            this.setState({errorMessage: 'Invalid email format'});
            return;
        }
        

        this.createUser();
        console.log(first_name);
        console.log(last_name);
        console.log(email);
        console.log(password);
    }

    render() {

        //Display a form with input fields for First and Last name, email, Password, and passwordconfirmation to make
        //sure the correct password was written the first time
        //There is also a button called "signup" that creates a user based on the input details
        //And another button that navigates back to the login screen
        return (
          <View style={styles.container}>
            <TextInput
            style={styles.input}
            onChangeText={first_name => this.setState({ first_name })}
            value = {this.state.first_name}
            placeholder = "Enter your First Name!"
          />
           <TextInput
            style={styles.input}
            onChangeText={last_name => this.setState({ last_name })}
            value = {this.state.last_name}
            placeholder = "Enter your last name!!"
          />
          <TextInput
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            value = {this.state.email}
            placeholder="Enter a email address!"
          />
          <TextInput
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            placeholder="Enter a secure password!"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            value={this.state.confirmPassword}
            placeholder="Enter the same password again!"
            secureTextEntry
          />
          {this.state.errorMessage != '' && <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>}

          <Button
            onPress={this.signup}
            title="Sign up"
          />
          <Button
          onPress={() => this.props.navigation.navigate('Login')} 
          title="Back to Login Page"
          />
          </View>
          
          
        )
    };
 }

 export default SignupForm;

