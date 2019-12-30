let wordContainer = document.getElementById("word");
let hangmanImageContainer = document.querySelector(".hangman-container");
hangmanImageContainer.style.background =
    '#cccccc url("/images/s0.gif") no-repeat right top';
let errorContainer = document.querySelector(".error-container");
let errorText = document.querySelector(".error-text");
let categoryContainer = document.querySelector("#category-container");

const passwords = [
    { "Cristiano Ronaldo": "Footballer" },
    { Mouse: "Accessories for PC" },
    { Laptop: "Electronic equipment" },
    { Tatry: "Polish mountain" },
    { Iphone: "Electronic equipment" },
    { "Joanna Brodzik": "Polish actress" },
    { "Far Cry 5": "Game" },
    { "Nie dolewaj oliwy do ognia": "Proverb" },
    { "Kazdy kij ma dwa konce": "Proverb" }
];

class Hangman {
    constructor(word, guessedLetter = [], remainingGuesses = 8) {
        this.word = word.toLowerCase().split("");
        this.guessedLetter = guessedLetter;
        this.remainingGuesses = remainingGuesses;
        this.counterGuess = 0;
        this.lettersToGuessed = "";
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

        if (includeLetter) {
            errorText.innerHTML = "Już wykorzystałeś tę literę!";
            errorContainer.style.display = "block";
            throw new Error("Już wykorzystałeś tę literę!");
        } else if (!includeLetter && !isGoodGuess) {
            this.counterGuess++;
            hangmanImageContainer.style.background = `url("/images/s${this.counterGuess}.gif") no-repeat right top`;
            this.remainingGuesses--;
        }

        this.guessedLetter.push(letter);
        this.drawLines();
    }
}

function generateRandomPassword() {
    const numberOfIndex = Math.floor(Math.random() * passwords.length) + 1;
    let category = Object.values(passwords[numberOfIndex - 1]).join("");
    let password = Object.keys(passwords[numberOfIndex - 1]).join("");
    categoryContainer.textContent += category;
    return {
        category,
        password
    };
}

function play() {
    let generatedObject = generateRandomPassword();
    const hangman1 = new Hangman(generatedObject.password);
    hangman1.drawLines();
    const keyPress = function(e) {
        hangman1.makeGuess(e.key);
        if (hangman1.remainingGuesses === 0) {
            window.removeEventListener("keydown", keyPress);
        }
    };

    window.addEventListener("keydown", keyPress);
}

play();
