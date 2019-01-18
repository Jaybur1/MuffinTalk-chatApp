const express = require('express')
const app = express()
const server = require('http').Server(app)

const io = module.exports.io = require('socket.io')(server)

const PORT = process.env.PORT || 3231

const SocketManager = require('./SocketManager')
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '../../build'))
}
app.get('*', (req, res) => {
    res.sendFile(req.join(__dirname, 'build', 'index.html'))
})
io.on('connection', SocketManager)

server.listen(PORT, () => {
    console.log(`connected to port : ${PORT}`);
})