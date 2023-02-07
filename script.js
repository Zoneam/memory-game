const cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let flippedCards = [];
let flippedCardIds = [];
let score = 0;

const cardDeck = document.querySelector('.scene');

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create and return HTML for a card
function createCard(id, value) {
    return `<div class="card" data-id="${id}" data-value="${value}">
                <div class="card__face card__face--front"></div>
                <div class="card__face card__face--back">${value}</div>
            </div>`
}

// Render the deck of cards
function renderDeck() {
    const shuffledCards = shuffle(cards);
    const deckHTML = shuffledCards.map((card, index) => createCard(index, card)).join('');
    cardDeck.innerHTML = deckHTML;
}

// Flip a card
function flipCard(event) {
    const card = event.currentTarget;
    const id = card.getAttribute('data-id');
    const value = card.getAttribute('data-value');

    if (flippedCards.length < 2 && !flippedCardIds.includes(id)) {
        flippedCards.push({ id, value });
        flippedCardIds.push(id);
        card.classList.add('is-flipped');

        if (flippedCards.length === 2) {
            if (flippedCards[0].value === flippedCards[1].value) {
                score++;
                flippedCards = [];
                flippedCardIds = [];
                if (score === 8) {
                    alert('You win!');
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach((flippedCard) => {
                        const cardToFlip = document.querySelector(`[data-id="${flippedCard.id}"]`);
                        cardToFlip.classList.remove('is-flipped');
                    });
                    flippedCards = [];
                    flippedCardIds = [];
                }, 1000);
            }
        }
    }
}

// Initial render of the deck
renderDeck();

// Add event listeners to each card
const allCards = document.querySelectorAll('.card');
allCards.forEach((card) => {
    card.addEventListener('click', flipCard);
});
