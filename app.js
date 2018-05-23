const expressjs = require('express')
const express = expressjs()
const server = require('http').Server(express)
const io = require('socket.io')(server)

const CoreApp = require('./core/app')
const CoreTools = require('./core/tools')

let App = new CoreApp()

/* Express Config */
express.set('view engine', 'ejs')
express.use(expressjs.static('public'))

/* RUN */
let PORT = process.env.PORT || 8080
server.listen(PORT)
console.log('Server START on http://localhost:', PORT)

/* HTTP */
express.get('/', function (req, res) {
  res.render('index', {session: undefined})
});
express.get('/:session', function (req, res) {
  res.render('index', {
    session: req.params.session
  })
});

/* STATS */
function sendStats () {
    io.emit('stats', {
        party: App.getSumGames(),
        players: App.getSumPlayers()
    })
    setTimeout(() => { sendStats() }, 5000)
}
sendStats ();

/* SOCKET */
io.on('connection', function (socket) {
  // Generate Game
  let idSession = CoreTools.uniqueId()
  let idPlayer = CoreTools.uniqueId()

  App.newChannel(io, socket, idSession, idPlayer)
  socket.emit('yourID', {pseudo: idPlayer, idPlayer})

  // Pseudo
  socket.on('changePseudo', function ({ pseudo }) {
    App.changePseudo(io, socket, idSession, idPlayer, pseudo)
    socket.emit('yourID', {pseudo, idPlayer})
  })

  // Disconnect
  socket.on('disconnect', function(){ 
    App.disconnect(io, socket, idSession, idPlayer)
  });

  // Join game
  socket.on('join', ({session}) => {
      let isSuccess = App.joinChannel(io, socket, idSession, session, idPlayer)
      if(isSuccess) {
        idSession = session
      }
  });

  // Choice
  socket.on('choice', ({choice}) => {
      App.setChoice(io, socket, idSession, idPlayer, choice)
  });

});