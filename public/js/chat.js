//this object contains events received from the server. can send and receive now.
const socket = io()
//Page Elements
const $chatForm = document.querySelector('#chat')
const $chatSendButton = $chatForm.querySelector('#send')
const $chatText = $chatForm.querySelector('input')
const $locationShareButton = document.querySelector('#sharelocation')
const $chatlog = document.querySelector('#chatlog')
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (incMessage)=> {
    console.log(incMessage)
    const html = Mustache.render(messageTemplate, {
        message: incMessage
    })
    $chatlog.insertAdjacentHTML('beforeend', html)
})

$chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    $chatSendButton.setAttribute('disabled','disabled')

    //target returns the form itself, so we can get it's elements
    const message = e.target.elements.messagebox
    //the callback parameters are given from the receiver aka the server
    socket.emit('sent', message.value, (serverResponse) => {
        $chatSendButton.removeAttribute('disabled')
        serverResponse ? console.log(serverResponse) : console.log('message delivered')
    })
    $chatText.value = ''
    $chatText.focus()
})

$locationShareButton.addEventListener('click', () => {
    if(!navigator.geolocation)
        return alert('This is not available on your browser.')
    $locationShareButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const coords = {lat: position.coords.latitude, long: position.coords.longitude}
        socket.emit('location_shared',coords, (serverResponse) => {
            $locationShareButton.removeAttribute('disabled')
            console.log(serverResponse)
        } )

    })
})