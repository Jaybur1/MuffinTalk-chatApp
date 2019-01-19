const io = require('./index.js').io
const {
    COMMUNITY_CHAT,
    MESSAGE_RECIEVED,
    MESSAGE_SENT,
    USER_CONNECTED,
    USER_DISCONNECTED,
    TYPING,
    PRIVATE_MESSAGE,
    VERIFY_USER,
    LOGOUT,
    NEW_CHAT_USER
} = require('../Events')
const {
    createUser,
    createChat,
    createMessage
} = require('../Factories')

let generalChat = createChat({
    isGeneral: true
})

let connectedUsers = {};



module.exports = function (socket) {


    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    //Verify Username 1
    socket.on(VERIFY_USER, function (newUser, callback) {
        if (!isUser(connectedUsers, newUser)) {

            callback({
                isUser: false,
                user: createUser({
                    name: newUser,
                    socketId: socket.id
                })
            })

        } else {

            callback({
                isUser: true
            })

        }
    })

    //userconnects 2
    socket.on(USER_CONNECTED, function (user) {
        user.socketId = socket.id
        connectedUsers = addUser(connectedUsers, user)
        socket.user = user.name;
        sendMessageToChatFromUser = sendMessageToChat(user.name)
        sendTypingFromUser = sendTypingToChat(user.name)

        console.log(connectedUsers);
        io.emit(USER_CONNECTED, connectedUsers)

    })


    //user disconnects 3
    socket.on('disconnect', function () {
        if (!!socket.user) {
            connectedUsers = removeUser(connectedUsers, socket.user)

            io.emit(USER_DISCONNECTED, connectedUsers)
        }

    })

    //user logout 4
    socket.on(LOGOUT, function () {
        connectedUsers = removeUser(connectedUsers, socket.user)
        io.emit(USER_DISCONNECTED, connectedUsers)
    })

    //send community chat 5
    socket.on(COMMUNITY_CHAT, function (callback) {
        callback(generalChat)
    })

    //user sends message 6
    socket.on(MESSAGE_SENT, function ({
        chatId,
        message
    }) {
        sendMessageToChatFromUser(chatId, message)
    })

    //add user to typing users on chatId 7
    socket.on(TYPING, function ({
        chatId,
        isTyping
    }) {

        sendTypingFromUser(chatId, isTyping)
    })

    // private message 8
    socket.on(PRIVATE_MESSAGE, ({
        reciever,
        sender,
        activeChat
    }) => {
        if (reciever in connectedUsers) {

            const recieverSocket = connectedUsers[reciever].socketId
            if (activeChat === null || activeChat.id === generalChat.id) {
                const newChat = createChat({
                    name: `You & ${reciever}`,
                    users: [reciever, sender]
                })
                socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat)
                socket.emit(PRIVATE_MESSAGE, newChat)
            } else {
                if (!(reciever in activeChat.users)) {
                    activeChat.users.filter(user => user in connectedUsers)
                        .map(user => connectedUsers[user])
                        .map(user => {
                            socket.to(user.socketId).emit(NEW_CHAT_USER, {
                                chatId: activeChat.id,
                                newUser: reciever
                            })
                        })
                    socket.emit(NEW_CHAT_USER, {
                        chatId: activeChat.id,
                        newUser: reciever
                    })
                }
                socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)
            }
        }
    })

}

/*
 * Returns a function that will take a chat id and message
 * and then emit a broadcast to the chat id.
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendMessageToChat(sender) {

    return (chatId, message) => {
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({
            message,
            sender
        }))
    }
}

/*
 * Returns a function that will take a chat id and boolean isTyping variable
 * and then emit a broadcast to the chat id that the sender is typing
 * @param sender {string} username of sender
 * @return function(chatId, isTyping)
 */
function sendTypingToChat(user) {

    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, {
            user,
            isTyping
        })
    }
}


/*
 * Adds user to list passed in.
 * @param userList {Object} Object with key value pairs of users
 * @param user {User} the user to added to the list.
 * @return userList {Object} Object with key value pairs of Users
 */
function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}

/*
 * Removes user from the list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {string} name of user to be removed
 * @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}

/*
 * Checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, username) {
    return username in userList
}

/*function createError(message) {
    return {
        error: {
            message
        }
    }
}*/