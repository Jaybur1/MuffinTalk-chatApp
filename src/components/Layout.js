import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm';
import ChatContainer from './chat/ChatContainer'

import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../Events';
//for production
//const socketURL = "/"

//for local
const socketURL = "http://192.168.1.5:3231/"

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            user: null,

        }
    }

    componentWillMount() {
        this.initSocket()
    }
    //Connect to & initialize the socket
    initSocket = () => {
        const socket = io(socketURL)
        socket.on('connect', () => {
            if (this.state.user) {
                this.reconnect(socket)
            } else {
                console.log('Connected');
            }
        })
        this.setState({ socket })
    }

    reconnect = (socket) => {
        socket.emit(VERIFY_USER, this.state.user.name, ({ isUser, user }) => {
            if (isUser) {
                this.state({ user: null })
            } else {
                this.setUser(user)
            }
        })
    }

    //Sets the user porperty in the state.
    setUser = (user) => {
        const { socket } = this.state
        socket.emit(USER_CONNECTED, user);
        this.setState({ user })
    }
    //Sets the user property in the state back to null.
    logout = () => {
        const { socket } = this.state
        socket.emit(LOGOUT);
        this.setState({ user: null })
    }

    render() {
        const { socket, user } = this.state;
        return (
            <div className="container">
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser} />
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout} />
                }
            </div>
        );
    }
}

export default Layout;