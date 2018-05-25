const ROCK = 0
const PAPER = 1
const SCISSORS = 2

class Game {
    constructor(idSession, idPlayer) {
        this.session = idSession
        this.players = []
        this.players.push({
            idPlayer,
            pseudo : idPlayer,
            choice : null,
            point: 0
        })
        console.log('New session : ', this.session)
    }

    getSumPlayers() {
        return this.players.length
    }

    getPseudo(idPlayer) {
        var pseudo = ''
        this.players.forEach(player => {
            if (idPlayer == player.idPlayer) {
                pseudo = player.pseudo
            }
        });
        return pseudo
    }

    changePseudo(idPlayer, pseudo) {
        this.players.forEach(player => {
            if(player.idPlayer == idPlayer) {
                player.pseudo = pseudo
            }
        });
    }

    getResults() {
        let localPlayer = []
        localPlayer.push(JSON.parse(JSON.stringify(this.players[0])))
        localPlayer.push(JSON.parse(JSON.stringify(this.players[1])))

        let results = {
            win: {},
            result: {},
            player: localPlayer
        }

        switch (localPlayer[0].choice) {
            case ROCK:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                    break;
                    case PAPER:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo

                        results.result.en = 'The sheet covers the stone'
                        results.result.fr = 'La feuille couvre la pierre'
                    break;
                    case SCISSORS:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo

                        results.result.en = 'The stone breaks the scissors'
                        results.result.fr = 'La pierre brise les ciseaux'
                    break;
                }
            break;
            case PAPER:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo

                        results.result.en = 'The sheet covers the stone'
                        results.result.fr = 'La feuille couvre la pierre'
                    break;
                    case PAPER:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                    break;
                    case SCISSORS:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo

                        results.result.en = 'Scissors cut the sheet'
                        results.result.fr = 'Les ciseaux coupent la feuille'
                    break;
                }
            break;
            case SCISSORS:
                switch (localPlayer[1].choice) {
                    case ROCK:
                        this.playerWin(localPlayer[1].idPlayer)
                        results.win.en = localPlayer[1].pseudo
                        results.win.fr = localPlayer[1].pseudo

                        results.result.en = 'The stone breaks the scissors'
                        results.result.fr = 'La pierre brise les ciseaux'
                    break;
                    case PAPER:
                        this.playerWin(localPlayer[0].idPlayer)
                        results.win.en = localPlayer[0].pseudo
                        results.win.fr = localPlayer[0].pseudo
                        
                        results.result.en = 'Scissors cut the sheet'
                        results.result.fr = 'Les ciseaux coupent la feuille'
                    break;
                    case SCISSORS:
                        this.playerEgality()
                        results.win.en = "Egality !"
                        results.win.fr = "Egalité !"
                    break;
                }
            break;
        }

        return results
    }

    playerWin(idPlayer) {
        this.players.forEach(player => {
            player.choice = null
            if(player.idPlayer == idPlayer) {
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
            if(player.idPlayer == idPlayer) {
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
            idPlayer,
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
            return player.idPlayer != idPlayer
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