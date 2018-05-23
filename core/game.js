const ROCK = 0
const PAPER = 1
const SCISSORS = 2

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

    getResults() {
        let localPlayer = []
        localPlayer.push(JSON.parse(JSON.stringify(this.players[0])))
        localPlayer.push(JSON.parse(JSON.stringify(this.players[1])))

        let results = {
            win: '',
            result: '',
            player: localPlayer
        }

        switch (localPlayer[0].choice) {
            case ROCK:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerEgality()
                        results.win = "Egality !"
                    break;
                    case PAPER:
                        this.playerWin(localPlayer[1].pseudo)
                        results.win = localPlayer[1].pseudo
                        results.result = 'The sheet covers the stone'
                    break;
                    case SCISSORS:
                        this.playerWin(localPlayer[0].pseudo)
                        results.win = localPlayer[0].pseudo
                        results.result = 'The stone breaks the scissors'
                    break;
                }
            break;
            case PAPER:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[0].pseudo)
                        results.win = localPlayer[0].pseudo
                        results.result = 'The sheet covers the stone'
                    break;
                    case PAPER:
                        this.playerEgality()
                        results.win = "Egality !"
                    break;
                    case SCISSORS:
                        this.playerWin(localPlayer[1].pseudo)
                        results.win = localPlayer[1].pseudo
                        results.result = 'Scissors cut the sheet'
                    break;
                }
            break;
            case SCISSORS:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[1].pseudo)
                        results.win = localPlayer[1].pseudo
                        results.result = 'The stone breaks the scissors'
                    break;
                    case PAPER:
                        this.playerWin(localPlayer[0].pseudo)
                        results.win = localPlayer[0].pseudo
                        results.result = 'Scissors cut the sheet'
                    break;
                    case SCISSORS:
                        this.playerEgality()
                        results.win = "Egality !"
                    break;
                }
            break;
        }

        return results
    }

    playerWin(idPlayer) {
        this.players.forEach(player => {
            player.choice = null
            if(player.pseudo == idPlayer) {
                player.point ++
            }
        });
    }

    playerEgality() {
        this.players.forEach(player => {
            player.choice = null
        });
    }

    playerAction(idPlayer, action) {
        var endGame = true
        this.players.forEach(player => {
            if(player.pseudo == idPlayer) {
                player.choice = action
            }

            if(player.choice == null) {
                endGame = false
            }
        });

        return endGame
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