const startScreen = document.querySelector(".startscreen");
const startButton = document.querySelector(".startbtn");
const gameWrapper = document.querySelector(".gamearea");
const inputs = document.querySelector(".inputs"),
    hintTag = document.querySelector(".hint span"),
    guessLeft = document.querySelector(".guess span"),
    wrongLetter = document.querySelector(".wrong span"),
    keyboard = document.querySelector(".keyboard"),
    resetBtn = document.querySelector(".resetbtn"),
    typingInput = document.querySelector(".typing-input");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];

// Start the game when the "Start Game" button is clicked
startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameWrapper.style.display = "block";
    randomWord();
});

// Function to select a random word and initialize the game
function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word.toLowerCase();
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = [];
    incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters.join(", ");

    // Create input boxes for the word
    inputs.innerHTML = "";
    for (let i = 0; i < word.length; i++) {
        inputs.innerHTML += `<input type="text" disabled>`;
    }

    // Generate the keyboard
    generateKeyboard();
}

// Function to generate the on-screen keyboard
function generateKeyboard() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    keyboard.innerHTML = ""; // Clear existing keyboard
    letters.split("").forEach(letter => {
        const key = document.createElement("button");
        key.textContent = letter;
        key.className = "key";
        key.setAttribute("data-key", letter);
        key.addEventListener("click", handleKeyClick);
        keyboard.appendChild(key);
    });
}

// Function to handle key clicks from the keyboard
function handleKeyClick(e) {
    const key = e.target.getAttribute("data-key");
    if (!key || e.target.disabled) return;

    e.target.disabled = true; // Disable the button after it's clicked
    e.target.classList.add("disabled"); // Add a visual indication for disabled keys
    processGuess(key);
}

// Function to process the guessed letter
function processGuess(key) {
    if (!incorrectLetters.includes(key) && !correctLetters.includes(key)) {
        if (word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === key) {
                    correctLetters.push(key);
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
        } else {
            maxGuesses--;
            incorrectLetters.push(key);
        }

        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters.join(", ");

        checkGameState();
    }
}

// Function to check if the game is won or lost
function checkGameState() {
    if (correctLetters.length === new Set(word).size) {
        setTimeout(() => {
            alert(`Congratulations! You guessed the word: ${word.toUpperCase()}`);
            randomWord();
        }, 200);
    } else if (maxGuesses < 1) {
        setTimeout(() => {
            alert(`Game Over! The word was: ${word.toUpperCase()}`);
            // Reveal the word
            for (let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }, 200);
    }
}

// Reset the game when the "Reset Game" button is clicked
resetBtn.addEventListener("click", randomWord);

// Handle keyboard input when a physical key is pressed
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key.match(/^[a-z]$/) && !keyboard.querySelector(`button[data-key="${key}"]`)?.classList.contains("disabled")) {
        handleKeyClick({ target: keyboard.querySelector(`button[data-key="${key}"]`) });
    }
});
