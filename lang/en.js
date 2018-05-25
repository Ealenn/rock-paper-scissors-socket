module.exports = {
    notification: {
        text: 'have played'
    },
    username: {
        title: 'Choose your username',
        field: 'Username',
        submit: 'Submit',
        clear: 'Clear',
        errors: {
            required: 'Username is required',
            length: 'Username must be less than 10 characters'
        }
    },
    await: {
        title: 'Waiting for player',
        invite: 'To invite a friend, copy the link below or share it with the social buttons.',
        warning: 'WARNING, if you refresh or close the page a new link will be generated !',
        clipboard: {
            title: 'Clipboard',
            description: 'Copy to clipboard'
        }
    },
    qrcode: {
        title: 'Invite Player with QRCode',
        description: 'Scan the QRCode for play with me !'
    },
    game: {
        title: 'Game',
        waiting: 'Waiting for your opponent',
        me: 'Me',
        continue: 'CONTINUE',
        action: {
            title: 'Choose an action',
            rock: 'Rock',
            paper: 'Paper',
            scissors: 'Scissors'
        }
    },
    stats: {
        score: 'Score',
        allparty: 'All party',
        online: 'players online',
        party: 'party active'
    }
}