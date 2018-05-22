const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const CoreGame = require('./core/game')
const CoreTools = require('./core/tools')
let ArrayGames = []

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
  // Generate Game
  let id = CoreTools.uniqueId()
  ArrayGames.push(new CoreGame(id))
  socket.join(id)

  // Send connected
  ArrayGames.forEach(element => {
    if(element.session == id) {
        socket.emit('connected', element.toJson())
    }
  })

  // Disconnect
  socket.on('disconnect', function(){ 
    ArrayGames.forEach(element => {
        if(element.session == id) {
            console.log('Player left : ', element.session)
            element.playerLeft()
            io.in(element.session).emit('connected', element.toJson())
        }
    })
  });

  // Join game
  socket.on('join', (data) => {
    // Find session
    let find = ArrayGames.find(function(element) {
        return element.session == data.session;
    });

    if(find && find.player < 2) {
        socket.join(data.session)
        console.log('Join session : ', data.session)
        // Remove old session
        ArrayGames = ArrayGames.filter(function(el) {
            return el.id !== id && el.player > 0;
        })

        // Add player
        ArrayGames.forEach(element => {
            if(element.session == data.session) {
                id = element.session
                element.playerJoin()
                io.in(element.session).emit('connected', element.toJson())
            }
        });
    }
  });

});