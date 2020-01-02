let wordContainer = document.getElementById("word");
let hangmanImageContainer = document.querySelector(".hangman-container");
hangmanImageContainer.style.background =
    '#cccccc url("/images/s0.gif") no-repeat right top';
let errorContainer = document.querySelector(".error-container");
let errorText = document.querySelector(".error-text");
const numberWords = 100;
const apiKey = "FCH3RI55";

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
        let finished = this.word.every(letter =>
            this.guessedLetter.includes(letter)
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
            window.location.reload();
            return `Great! You guess the password!`;
        } else if (this.status === "playing") {
            return `Guess left : ${this.remainingGuesses}`;
        } else {
            return `Ohh, you lose! The password was ${this.word.join("")}`;
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
            throw new Error("Już wykorzystałeś tę literę!");
        } else if (!includeLetter && !isGoodGuess) {
            this.counterGuess++;
            hangmanImageContainer.style.background = `url("/images/s${this.counterGuess}.gif") no-repeat right top`;
            this.remainingGuesses--;
        }
        this.drawLines();
    }
}

async function play() {
    let words = await fetch(
        `https://random-word-api.herokuapp.com/word?key=${apiKey}&number=${numberWords}`
    )
        .then(res => res.json())
        .then(body => {
            let wordsLength = body.length;
            let index = Math.floor(Math.random() * wordsLength + 1);
            const hangman1 = new Hangman(body[index]);
            hangman1.drawLines();
            const keyPress = function(e) {
                hangman1.makeGuess(e.key);
                hangman1.setStatus();
                hangman1.statusMessage;
                if (hangman1.remainingGuesses === 0) {
                    window.removeEventListener("keydown", keyPress);
                }
            };

            window.addEventListener("keydown", keyPress);
        })
        .catch(err => console.log(err));
    return words;
}

play();
