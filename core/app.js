const CoreGame = require('./game')

class App {
    constructor(idSession) {
        this.ArrayGames = []
    }

    /* Stats */
    getSumGames() {
        return Object.keys(this.ArrayGames).length
    }

    getSumPlayers() {
        let num = 0
        for (let key in this.ArrayGames) {
            num += this.ArrayGames[key].getSumPlayers()
        }
        return num
    }

    /* Connexion */
    connected(io, game) {
        console.log('Connected : ', game.session)
        io.in(game.session).emit('connected', this.ArrayGames[game.session].toJson())
    }

    disconnect(io, socket, idSession, idPlayer) {
        this.ArrayGames[idSession].playerLeft(idPlayer)
        this.connected(io, this.ArrayGames[idSession])
        this.cleanChannel()
    }

    /* Channel */
    newChannel(io, socket, idSession, idPlayer, isJoin = false) {
        if (isJoin) {
            this.ArrayGames[idSession].playerJoin(idPlayer)
        } else {
            this.ArrayGames[idSession] = new CoreGame(idSession, idPlayer)
        }
        
        socket.join(idSession)
        this.connected(io, this.ArrayGames[idSession].toJson())
    }

    joinChannel(io, socket, oldSession, newSession, idPlayer) {
        if(this.ArrayGames[newSession] != undefined && this.ArrayGames[newSession].getSumPlayers() < 2) {
            this.ArrayGames[oldSession].playerLeft(idPlayer)
            this.newChannel(io, socket, newSession, idPlayer, true)
            return true
        }

        return false
    }

    cleanChannel() {
        for (let key in this.ArrayGames) {
            if(this.ArrayGames[key].getSumPlayers() == 0) {
                delete this.ArrayGames[key]
            }
        }
    }

    /* Choice */
    setChoice(io, socket, idSession, idPlayer, choice) {
        var endGame = this.ArrayGames[idSession].playerAction(idPlayer, choice)
        io.in(idSession).emit('haveChoice', {player: idPlayer})

        if (endGame) {
            io.in(idSession).emit('results', this.ArrayGames[idSession].getResults())
            this.connected(io, this.ArrayGames[idSession])
        }
    }

}

module.exports = App