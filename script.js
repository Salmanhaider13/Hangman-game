let letters = document.getElementById('letters');
for (let i = 65; i < 91; i++) {
    let letter = document.createElement("button");
    letter.classList.add("letter");
    letter.setAttribute("onclick", "checkGuess(this.innerHTML)");
    letter.innerHTML = String.fromCharCode(i);
    letters.appendChild(letter);
}
let hint = "";
let indexChoosen;
let choosenWord;
let wordguess;
let wordinfo = {};
let chances;
let wordguessed = [];
let correctGuessedWord = [];
function chooseWord() {//function which initializes the required variables and start the game
    while (true) {//loop to check a word comes once.
        indexChoosen = parseInt(Math.random() * wordList.length);
        choosenWord = wordList[indexChoosen].word.toUpperCase();
        hint = wordList[indexChoosen].hint;
        if (wordguessed.indexOf(choosenWord) === -1) {
            break;
        }
    }
    chances = 5;
    wordguess = "";
    wordinfo = {};
    for (let i in choosenWord) {
        wordguess += " _";
        if (wordinfo[choosenWord[i]] === undefined) {
            wordinfo[choosenWord[i]] = [i];
        } else {
            wordinfo[choosenWord[i]].push(i);
        }
    }
    wordguessed.push(choosenWord);
    wordguess = wordguess.slice(1);
    document.getElementById('word').innerHTML = wordguess;
    document.getElementById('chances').innerHTML = chances;
}

chooseWord();
document.getElementById('hint-button').addEventListener('click', () => {
    document.getElementById('hint-text').innerHTML = hint;
});

function checkGuess(key) {//function for updating the buttons and verify the guess
    key = key.toUpperCase();
    let buttons = document.querySelectorAll(".letter");
    let buttonIndex = -1;
    if (chances > 0) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerHTML === key) { // Convert the key to uppercase for comparison
                buttonIndex = i;
                break;
            }
        }
        if (Object.keys(wordinfo).includes(key)) { // check if the pressed key is a letter
            wordguess = wordguess.split('');
            wordinfo[key].forEach(index => {
                wordguess[index * 2] = key;
            });
            wordguess = wordguess.join('');

            document.getElementById('word').innerHTML = wordguess;
            delete wordinfo[key];
            // buttons[buttonIndex].classList.remove("letter");
            buttons[buttonIndex].classList.add("lettercorrect");
            buttons[buttonIndex].setAttribute("disabled", true);
        }
        else if (buttonIndex !== -1) {
            chances--;
            // buttons[buttonIndex].classList.remove("letter");
            buttons[buttonIndex].classList.add("letterincorrect");
            buttons[buttonIndex].setAttribute("disabled", true);
            document.getElementById('chances').innerHTML = chances;
            document.getElementById('hangman-image').src = imagesrc[imagesrc.length - chances - 1];
            // alert('Wrong Letter Guessed: '+key);
        }
        if (isGameWon() || chances <= 0) {
            document.getElementById('word').innerHTML = choosenWord;
            setTimeout(nextWord, 750);
        }
    }
}
function isGameOver() {
    return wordguessed.length === 10;
}
function isGameWon() {
    if (Object.keys(wordinfo).length <= 0) {
        correctGuessedWord.push(choosenWord);
        return true;
    }
    return false;
}
function showResult() {
    let score = document.createElement('p');
    score.innerHTML = "Score: " + correctGuessedWord.length + "/10";
    score.classList.add('result-info');
    let winningPercentage = document.createElement('p');
    winningPercentage.innerHTML = "Winning Percentage: " + correctGuessedWord.length * 100 / wordguessed.length + "%";
    winningPercentage.classList.add('result-info');
    let tryAgainButton = document.createElement('button');
    tryAgainButton.innerHTML = 'Try Again';
    tryAgainButton.id = 'try-again-button';
    tryAgainButton.classList.add('otherButtons');
    tryAgainButton.addEventListener('click', () => {
        window.location.reload();
    });
    let resultsection = document.getElementById('result');
    resultsection.style.backgroundColor = "white";
    resultsection.style.height = "32%";
    resultsection.appendChild(score);
    resultsection.appendChild(winningPercentage);
    resultsection.appendChild(tryAgainButton);
}
function nextWord() {//changes the word
    if (isGameOver()) {
        document.getElementById('hint-button').disabled = true;;
        showResult();
    } else {
        chooseWord();
        let letters = document.getElementsByTagName("button");
        for (let i of letters) {
            if (i.innerHTML !== "HINT") {
                i.classList.remove("letterincorrect", "lettercorrect");
                i.classList.add("letter");
                i.removeAttribute("disabled");
            }
        }
        document.getElementById('hangman-image').src = imagesrc[0];
    }
    document.getElementById('hint-text').innerHTML = "";
    document.getElementById("words-remaining").innerHTML--;
}