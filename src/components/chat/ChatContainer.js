import React, { Component } from 'react';
import SideBar from '../sideBar/SideBar';
import { COMMUNITY_CHAT, MESSAGE_RECIEVED, TYPING, MESSAGE_SENT, PRIVATE_MESSAGE, USER_CONNECTED, USER_DISCONNECTED, NEW_CHAT_USER } from '../../Events'
import ChatHeading from './ChatHeading'
import Messages from '../Message/Messages'
import MessageInput from '../Message/MessageInput'
import { values, difference, differenceBy } from 'lodash'

class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            activeChat: null,
            users: []
        }
    }

    componentDidMount() {
        const { socket } = this.props
        this.initSocket(socket)
    }

    componentWillUnmount() {
        const { socket } = this.props
        socket.off(PRIVATE_MESSAGE)
        socket.off(USER_CONNECTED)
        socket.off(USER_DISCONNECTED)
        socket.off(NEW_CHAT_USER)
    }

    initSocket = (socket) => {
        socket.emit(COMMUNITY_CHAT, this.resetChat)
        socket.on(PRIVATE_MESSAGE, this.addChat)
        socket.on('connect', () => {
            socket.emit(COMMUNITY_CHAT, this.resetChat)
        })
        socket.on(USER_DISCONNECTED, (users) => {
            const removedUsers = differenceBy(this.state.users, values(users), 'id')
            this.removeUserFromChat(removedUsers)
            this.setState({ users: values(users) })
        })
        socket.on(USER_CONNECTED, (users) => {
            this.setState({ users: values(users) })
        })
        socket.on(NEW_CHAT_USER, this.addUserToChat)
    }

    sendPrivateMessage = (reciever) => {
        const { socket, user } = this.props
        const { activeChat } = this.state
        socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.name, activeChat })
    }

    addUserToChat = ({ chatId, newUser }) => {
        const { chats } = this.state
        const newChats = chats.map(chat => {
            if (chat.id === chatId) {
                return Object.assign({}, chat, { user: [...chat.users, newUser] })
            }
            return chat
        })
        this.setState({ chats: newChats })
    }

    removeUserFromChat = removedUsers => {
        const { chats } = this.state
        const newChats = chats.map(chat => {
            let newUsers = difference(chat.users, removedUsers.map(u => u.name))
            return {
                ...chat,
                users: newUsers
            }
        })
        this.setState({ chats: newChats })
    }

    //Reset the chat back to only the chat passed in
    resetChat = (chat) => {
        return this.addChat(chat, true)
    }
    //Adds a new chat to the chat container, if reset is true ,than it removes
    //all chats and sets the chat to be the main chat .
    addChat = (chat, reset = false) => {

        const { socket } = this.props
        const { chats } = this.state

        const newChats = reset ? [chat] : [...chats, chat]
        this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat })

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    //returns a function that will add message to chat with
    //the chatId passed in
    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat

            })
            this.setState({ chats: newChats })
        }
    }
    //updates the typing of chat with id passed in 
    updateTypingInChat = (chatId) => {
        return ({ isTyping, user }) => {
            if (user !== this.props.user.name) {
                const { chats } = this.state
                let newChats = chats.map((chat) => {
                    if (chat.id === chatId) {
                        if (isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user)
                        } else if (!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                        }
                    }
                    return chat
                })
                this.setState({ chats: newChats })
            }
        }
    }

    //Adds a message to the specified chat
    sendMessage = (chatId, message) => {
        const { socket } = this.props
        socket.emit(MESSAGE_SENT, { chatId, message })
    }
    //Sends typing status to the server
    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props
        socket.emit(TYPING, { chatId, isTyping })
    }
    setActiveChat = (activeChat) => {
        this.setState({ activeChat })
    }

    render() {
        const { user, logout } = this.props
        const { chats, activeChat, users } = this.state
        return (
            <div className="container">
                <SideBar
                    users={users}
                    logout={logout}
                    chats={chats}
                    user={user}
                    activeChat={activeChat}
                    setActiveChat={this.setActiveChat}
                    onSendPrivateMessage={this.sendPrivateMessage}
                />
                <div className="chat-room-container">
                    {
                        activeChat !== null ? (
                            <div className="chat-room">
                                <ChatHeading name={activeChat.name} />
                                <Messages
                                    messages={activeChat.messages}
                                    user={user}
                                    typingUsers={activeChat.typingUsers}
                                />
                                <MessageInput
                                    sendMessage={
                                        (message) => {
                                            this.sendMessage(activeChat.id, message)
                                        }
                                    }
                                    sendTyping={
                                        (isTyping) => {
                                            console.log(activeChat.id)
                                            this.sendTyping(activeChat.id, isTyping)
                                        }
                                    }
                                />
                            </div>
                        ) :
                            (
                                <div className="chat-room choose">
                                    <h3>Choose a Chat</h3>
                                </div>
                            )
                    }
                </div>

            </div>
        );
    }
}

export default ChatContainer;