const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#locaton-message-template').innerHTML


socket.on('message',(welcomeMessage)=>{
    console.log(welcomeMessage)
    const html = Mustache.render(messageTemplate,{
        message: welcomeMessage.text
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationMessageTemplate,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
   e.preventDefault()

   $messageFormButton.setAttribute('disabled','disabled')

   
   const message = e.target.elements.message.value
   socket.emit('sendMessage',message,(error)=>{
       $messageFormButton.removeAttribute('disabled')
       $messageFormInput.value = ''
       $messageFormInput.focus()


       if(error){
           return console.log(error)
       }
       console.log('Message delivered!')
   })
})

$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocation.removeAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('Location shared!')
            $sendLocation.removeAttribute('disbled')
        })       
    })
    
})