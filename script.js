let flippedCards, flippedCardIds, guessedCards = [];
let score = 0;
let losses = 0;
let timer, countdown = null;
const cardDeck = document.querySelector('.game-wrapper');
const boardSize = document.getElementById("inputField");
const incrementButton = document.getElementById("incrementButton");
const decrementButton = document.getElementById("decrementButton");
const resetButton = document.querySelector('#resetButton');
const wrongGuesses = document.querySelector('#wrong-guesses');
const guessesLeft = document.querySelector('#guesses-left');
const totalWins = document.querySelector('#total-wins');
const timeLeftSpan = document.querySelector('#timer');
const enableHints = document.querySelector('.custom-control-input');
const range = document.querySelector('#range');
const totalLosses = document.querySelector('#losses');

// ********** Game Reset **********
resetButton.addEventListener('click', () => {
    renderDeck(parseInt(boardSize.textContent));
});

// ********** Adding Removing Hints **********
enableHints.addEventListener('click', () => {
    range.disabled = !range.disabled;
    if(enableHints.checked) {
        timer = setInterval(hint, 800/parseInt(boardSize.textContent)*40);
    } else {
        clearInterval(timer);
        const allCards = document.querySelectorAll('.card');
        allCards.forEach((card) => {
            card.firstElementChild.querySelector('h1').classList.remove('fade-number');
        });
    }
});

range.addEventListener('input', () => {
    if(timer) {
        clearInterval(timer);
        timer = setInterval(hint, (1000000/(range.value*boardSize.textContent)));
    }
});

// ********** Board Size **********

// Increase Board Size to Next Perfect Square
function nextPerfectSquare(num) {
    if(num > 28) num = 28;
    return (num + 1 % 2 == 0) ? Math.pow(num + 1,2) : Math.pow(num + 2, 2);
}

incrementButton.addEventListener("click", function() {
    let current = parseInt(boardSize.textContent);
    boardSize.textContent = nextPerfectSquare(Math.sqrt(current));
    renderDeck(boardSize.textContent);
});

// Decrease Board Size to Next Perfect Square
function prevPerfectSquare(num) {
    if(num < 4) num = 4;
    return (num - 1 % 2 == 0) ? Math.pow(num - 1,2) : Math.pow(num - 2, 2);
}

decrementButton.addEventListener("click", function() {
    let current = parseInt(boardSize.textContent);
    boardSize.textContent = prevPerfectSquare(Math.sqrt(current));
    renderDeck(boardSize.textContent);
});

// ********** Game Logic **********

function shuffle(cards) {
    let currentIndex = cards.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
}

// Create and return HTML for a card
function createCard(id, value) {
    return `<div class="card" data-id="${id}" data-value="${value}">
                <div class="card__face card__face--front"><h1 id="fade-number"></h1></div>
                <div class="card__face card__face--back"><h1 class="number">${value}</h1></div>
            </div>`
}

// Render tiles to the DOM
function renderDeck(tiles) {
    timeLeft = Math.floor((tiles/2)*Math.sqrt(tiles/2)) ;
    timeLeftSpan.textContent = timeLeft;
    if (timer) clearInterval(timer);
    if (countdown) clearInterval(countdown);
    score = 0;
    wrongGuesses.textContent = 0;
    guessesLeft.textContent = boardSize.textContent/2;
    guessedCards = [];
    flippedCardIds = [];
    flippedCards = [];
    const cards = [];
    for (let i = 0; i < tiles/2; i++) {
        cards.push(i,i);
    }
    const shuffledCards = shuffle(cards);
    const deckHTML = shuffledCards.map((card, index) => createCard(index, card)).join('');
    cardDeck.innerHTML = deckHTML;

    // Add event listeners to each card
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card) => {
        card.style.width = `${parseInt(cardDeck.offsetWidth)/Math.sqrt(tiles)}px`;
        card.style.height = `${parseInt(cardDeck.offsetWidth)/Math.sqrt(tiles)}px`;
        card.firstElementChild.querySelector('h1').style.fontSize = `${(800/Math.sqrt(tiles)/10*4)}px`;
        card.children[1].querySelector('h1').style.fontSize = `${(800/Math.sqrt(tiles)/10*4)}px`;
        card.addEventListener('click', flipCard);
    });
    if(enableHints.checked) timer = setInterval(hint, (1000000/(range.value*tiles)));
    countdown = setInterval(countDown, 1000);
}


// Flip a Card
function flipCard(event) {
    const card = event.currentTarget;
    const id = card.getAttribute('data-id');
    const value = card.getAttribute('data-value');
    if (guessedCards.includes(id)) return;
    card.firstElementChild.querySelector('h1').classList.remove('fade-number');
    if (flippedCards.length < 2 && !flippedCardIds.includes(id)) {
        card.firstElementChild.querySelector('h1').innerText = value;
        flippedCards.push({ id, value });
        flippedCardIds.push(id);
        card.classList.add('is-flipped');
        if (flippedCards.length === 2) {
            if (flippedCards[0].value === flippedCards[1].value) {
                score++;
                guessedCards.push(flippedCards[0].id, flippedCards[1].id);
                flippedCards = [];
                flippedCardIds = [];
                guessesLeft.textContent = boardSize.textContent/2 - score;
                if (score === boardSize.textContent/2) {
                    totalWins.textContent = parseInt(totalWins.textContent) + 1;
                    timeLeftSpan.innerText = "You won!"
                    clearInterval(countdown);
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach((flippedCard) => {
                        const cardToFlip = document.querySelector(`[data-id="${flippedCard.id}"]`);
                        cardToFlip.classList.remove('is-flipped');
                        cardToFlip.firstElementChild.querySelector('h1').classList.add('fade-number');
                        setTimeout(() => {
                            cardToFlip.firstElementChild.querySelector('h1').innerText = '';
                        },3000);
                        
                    });
                    flippedCards = [];
                    flippedCardIds = [];
                    wrongGuesses.textContent = parseInt(wrongGuesses.textContent) + 1;
                }, 600);
            }
        }
    }
}

// ********** Timer **********
function  countDown() {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft == 0) {
      clearInterval(countdown);
      clearInterval(timer);
      cardDeck.innerHTML = '';
      totalLosses.textContent = parseInt(totalLosses.textContent) + 1;
      timeLeftSpan.innerText = "You lost!"
    }
  }

// ********** Hint Function **********
function hint() {
        let card1 = document.querySelector(`[data-id="${Math.floor(Math.random() * boardSize.textContent)}"]`);
        card1.children[0].querySelector('h1').innerText = card1.children[1].querySelector('h1').innerText;
        card1.children[0].querySelector('h1').classList.add('fade-number');
        setTimeout(() => {
            card1.children[0].querySelector('h1').classList.remove('fade-number');
            card1.children[0].querySelector('h1').innerText = '';
        }, 3000);
}

// Initial render of the deck
renderDeck(16);


