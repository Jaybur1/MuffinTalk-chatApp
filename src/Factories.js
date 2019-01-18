const uuidv4 = require('uuid/v4')

//create a new user
const createUser = ({
    name = '',
    socketId = null
} = {}) => ({
    id: uuidv4(),
    name,
    socketId
})

//create a message 

const createMessage = ({
    message = '',
    sender = ''
} = {}) => ({
    id: uuidv4(),
    time: getTime(new Date(Date.now())),
    message,
    sender
})

//create a chat 
const createChat = ({
    messages = [],
    name = "General",
    users = [],
    isGeneral = false
} = {}) => ({
    id: uuidv4(),
    name: isGeneral ? "General" : createChatNameFromUsers(users),
    messages,
    users,
    typingUsers: [],
    isGeneral
})

const createChatNameFromUsers = (users, excludedUser = "") => {
    return users.filter(u => u !== excludedUser).join(' & ') || "Empty Users"
}



const getTime = (date) => {
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
    createUser,
    createMessage,
    createChat,
    createChatNameFromUsers
}