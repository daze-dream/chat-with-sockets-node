const express = require ('express')
const http = require('http')
const path = require('path')
const Filter = require('bad-words')

const socketio = require('socket.io')
//------------------------------
const port = process.env.PORT
const app = express();
const server = http.createServer(app)
//io expects the raw HTTP server. Express does this behind the scenes, we need it exposed to inject socketio

const publicPath =  path.join(__dirname, '../public')
app.use(express.static(publicPath))
const io = socketio(server)
/**
 * in a nutshell:
 * server(emit) -> client(receive) - countUpdated
 * client(emit) -> server(receive) - increment
 * acknowledgements send back something to the emitter to indicate successful delivery
 */


let count = 0
io.on('connection', (socket) => {
    //broadcast emits it to everyone but the orignal socket
    socket.broadcast.emit('message', 'A new arrival has dropped into the dunes')
    //pass any data you want to be sent as arguments. available as a callback value in client
    const welcomeMessage = 'WELCOME TO THE DUNES'

    socket.emit('message', welcomeMessage)
    socket.on('sent', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message))
            return callback('ey no cussin round these parts')
        io.emit('message', message)
        //we can provide as many arguments as we want back to the client callback.
        callback();
    })
    socket.on('location_shared', (coords, callback) => {
        console.log('user lat: ' + coords.lat + ' long: ' + coords.long)
        callback('location shared successfully')
        io.emit('message',`https://www.google.com/maps?q=${coords.lat},${coords.long}`)
    })
    /**
     * so we have 3 ways to emit
     * socket: to the connecting client only
     * socket.broadcast: to everyone but the client
     * io: to all clients connected
     * */
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the dunes')
    })
})

server.listen(port, () => {
    console.log('listening on port ' + port);
})