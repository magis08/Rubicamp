const readline = require('readline');

class View {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    askQuestion(query) {
        return new Promise(resolve => this.rl.question(query, answer => resolve(answer)));
    }

    showMessage(message) {
        console.log(message);
    }

    close() {
        this.rl.close();
    }
}

module.exports = View;
