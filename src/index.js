const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

let myArray = [{"child": ["one", "two", "three", "four"]}, {"child": ["five", "six", "seven", "eight"]}];

for(let i = 0;i < myArray.length; i++){
    let childArray = myArray[i].child;
    for(let j = 0; j < childArray.length; j++){
        console.log(childArray[j])
    }
}

//server (emit) -> client (receive) - countUpdated
//client(emit) -> server (receive) - increment

let welcomeMessage = "Welcome user!"

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

    socket.emit('message',welcomeMessage)
    socket.broadcast.emit('message','A new user has joined!')

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        io.emit('message',message)
        callback()
    })
    
    socket.on('sendLocation',(coords,callback)=>{
        console.log(coords)
        io.emit('locationMessage',`https://www.google.com/maps/@${coords.latitude},${coords.longitude}`)
        callback()
    })  

    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})