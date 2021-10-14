//this object contains events received from the server. can send and receive now.
const socket = io()

socket.on('message', (welcomeMessage)=> {
    console.log(welcomeMessage)
})

document.querySelector('#chat').addEventListener('submit', (e)=> {
    e.preventDefault();
    //target returns the form itself, so we can get it's elements
    const message = e.target.elements.messagebox
    socket.emit('sent', message.value)
})

document.querySelector('#sharelocation').addEventListener('click', () => {
    if(!navigator.geolocation)
        return alert('This is not available on your browser.')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const coords = {lat: position.coords.latitude, long: position.coords.longitude}
        socket.emit('location_shared',coords )

    })
})