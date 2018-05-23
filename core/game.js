class Game {
    constructor(idSession, idPlayer) {
        this.session = idSession
        this.players = []
        this.players.push({
            pseudo : idPlayer,
            choice : null,
            point: 0
        })
        console.log('New session : ', this.session)
    }

    getSumPlayers() {
        return this.players.length
    }

    playerJoin(idPlayer) {
        console.log('Player Join')
        this.players.push({
            pseudo : idPlayer,
            choice: null,
            point: 0
        })
    }

    playerLeft(idPlayer) {
        console.log('Player Left')
        this.players = this.players.filter((player) => {
            player.point = 0
            player.choice = null
            return player.pseudo != idPlayer
        })
    }

    toJson() {
        return {
            session: this.session,
            player: this.players
        }
    }
}

module.exports = Game