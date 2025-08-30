const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

app.get('/', (req, res) => {
    res.send('Server running')
})


const socketToRoom = new Map()
io.on('connection', socket => {
    console.log(socket.id)
    socket.on('join-room', (data) => {
        socket.join(data.roomId)
        socketToRoom.set(socket, data.roomId)
        socket.broadcast.emit('turn', '')
    })

    socket.on('remote-input', (remote)=> {
        socket.broadcast.emit('remote-input', remote)
    })

    socket.on('remote-word', (remote)=> {
        socket.broadcast.emit('remote-word', remote)
    })

    socket.on('remote-score', (remote)=> {
        socket.broadcast.emit('remote-score', remote)
    })

    socket.on('turn', () => {
        socket.broadcast.emit('turn', '')
    })

})

const port = 8080
server.listen(port, console.log(`Listen on port ${port}`))