let wordContainer = document.getElementById("word");
let hangmanImageContainer = document.querySelector(".hangman-container");
hangmanImageContainer.style.background =
    '#cccccc url("/images/s0.gif") no-repeat right top';
let errorContainer = document.querySelector(".error-container");
let errorText = document.querySelector(".error-text");
let statusMessage = document.querySelector(".status-message");
let playAgain = document.querySelector(".play-again");

class Hangman {
    constructor(word, guessedLetter = [], remainingGuesses = 8) {
        this.word = word.toLowerCase().split("");
        this.guessedLetter = guessedLetter;
        this.remainingGuesses = remainingGuesses;
        this.counterGuess = 0;
        this.lettersToGuessed = "";
        this.status = "playing";
    }

    setStatus() {
        let finished = this.word.every(
            letter => this.guessedLetter.includes(letter) || letter === " "
        );
        if (finished) {
            this.status = "finished";
        } else if (this.remainingGuesses !== 0) {
            this.status = "playing";
        } else {
            this.status = "lose";
        }
    }

    get statusMessage() {
        if (this.status === "finished") {
            return `Great! You guess the password!`;
        } else if (this.status === "playing") {
            return `Guess left : ${this.remainingGuesses}`;
        } else {
            return `Ohh, you lose! The password was: ${this.word
                .join("")
                .toUpperCase()}`;
        }
    }

    drawLines() {
        this.lettersToGuessed = "";

        this.word.map(letter => {
            if (this.guessedLetter.includes(letter)) {
                this.lettersToGuessed += letter.toUpperCase();
            } else if (letter === " ") {
                this.lettersToGuessed += "&ensp;";
            } else {
                this.lettersToGuessed += "_ ";
            }
        });

        return (wordContainer.innerHTML = this.lettersToGuessed);
    }

    makeGuess(letter) {
        errorText.innerHTML = "";
        errorContainer.style.display = "none";
        let includeLetter = this.guessedLetter.includes(letter);
        let isGoodGuess = this.word.includes(letter);

        this.guessedLetter.push(letter);

        if (includeLetter) {
            errorText.innerHTML = "Już wykorzystałeś tę literę!";
            errorContainer.style.display = "block";
        } else if (!includeLetter && !isGoodGuess) {
            this.counterGuess++;
            hangmanImageContainer.style.background = `url("/images/s${this.counterGuess}.gif") no-repeat right top`;
            this.remainingGuesses--;
        }
        this.drawLines();
    }
}

async function play() {
    let word = await fetch(`http://puzzle.mead.io/puzzle`)
        .then(res => res.json())
        .then(body => {
            const { puzzle } = body;
            const hangman1 = new Hangman(puzzle);
            hangman1.drawLines();
            const keyPress = function(e) {
                hangman1.makeGuess(e.key);
                hangman1.setStatus();
                statusMessage.textContent = hangman1.statusMessage;
                if (
                    hangman1.remainingGuesses === 0 ||
                    hangman1.status === "finished" ||
                    hangman1.status === "lose"
                ) {
                    window.removeEventListener("keydown", keyPress);
                }
            };

            window.addEventListener("keydown", keyPress);
        })
        .catch(err => console.log(err));
    return word;
}

playAgain.addEventListener("click", function() {
    hangmanImageContainer.style.background = `url("/images/s0.gif") no-repeat right top`;
    statusMessage.textContent = "";
    play();
});
