class Game {
    constructor(idSession) {
        this.session = idSession
        this.player = 1
        console.log('New session : ', this.session)
    }

    playerJoin() {
        this.player ++
    }

    playerLeft() {
        this.player --
    }

    toJson() {
        return {
            session: this.session,
            player: this.player
        }
    }
}

module.exports = Game