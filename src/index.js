const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

app.get('/',(req,res)=>{
    console.log('Active')
})

app.use(express.json())

// let count = 0

//server (emit) -> client (receive) - countUpdated
//client(emit) -> server (receive) - increment
let welcomeMessage = "Welcome user!"

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message',welcomeMessage)

    socket.on('sendMessage',(msg)=>{
        io.emit('message',msg)
    })
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})