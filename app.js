let app = require('express')()
let server = require('http').Server(app)
let io = require('socket.io')(server)

/* RUN */
let PORT = process.env.PORT || 8080
server.listen(PORT)
console.log('Express listen on PORT : ', PORT)

/* HTTP */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

/* SOCKET */
io.on('connection', function (socket) {
});