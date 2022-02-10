const socket = io()

socket.on('message',(welcomeMessage)=>{
    console.log(welcomeMessage)
})

document.querySelector('#message-from').addEventListener('submit',(e)=>{
   e.preventDefault()
   const message = document.querySelector('input').value
   socket.emit('sendMessage',message)
})