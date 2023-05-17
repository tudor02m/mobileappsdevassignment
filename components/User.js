import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//This component contains the endpoints for:

//GET /user/${userId} = getUserData
//PATCH /user/${userId} = updateUserData

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            error: '',
            isLoading: true
        };
    }

    //Lifecycle function that runs after the component is mounted, fetching user data
    componentDidMount() {
        this.getUserData();
    }


    //Fetch user data from the server using a GET request to the /user/${userId} endpoint
    getUserData = async () => {
        //Retrieve user id and session token using Asyncstorage
        const userId = await AsyncStorage.getItem("whatsthat_user_id");
        const token = await AsyncStorage.getItem("whatsthat_session_token");

        fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            }
        })
        .then((response) => response.json())
        .then((data) => {
            this.setState({

                //Update states with user data found on the server
                isLoading: false,
                user_id: data.user_id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email
            });
        })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
          })
    }

    //Update user data using a PATCH request to the /user/${userId} endpoint
    updateUserData = async () => {
        //Retrieve user id and session token using Asyncstorage
        const userId = await AsyncStorage.getItem("whatsthat_user_id");
        const token = await AsyncStorage.getItem("whatsthat_session_token");
    
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify({

                //Update server data with the states given through the PATCH request
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response) => {
            if(response.status === 200){
                console.log('User information updated successfully');
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
            this.setState({"submitted": false});
          })
    }
}

export default User;