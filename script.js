
let flippedCards = [];
let flippedCardIds = [];
let score = 0;
let timer = null;
const cardDeck = document.querySelector('.game-wrapper');
let inputField = document.getElementById("inputField");
let incrementButton = document.getElementById("incrementButton");
let decrementButton = document.getElementById("decrementButton");

function nextPerfectSquare(num) {
    let i = 1;
    while (i * i <= num) i++;
    if(i % 2 == 0) return i * i;
    else return (i + 1) * (i + 1);
  }

  function prevPerfectSquare(num) {
    let i = 1;
    while (i * i < num) i++;
    if((i-1) % 2 == 0) return (i-1) * (i-1);
    else return (i - 2) * (i - 2);
  }

  incrementButton.addEventListener("click", function() {
    score = 0;
    flippedCardIds = [];
    flippedCards = [];
    let current = parseInt(inputField.value);
    inputField.value = nextPerfectSquare(current);
    inputField.step = nextPerfectSquare(current) - current;
    renderDeck(inputField.value);
  });

  decrementButton.addEventListener("click", function() {
    score = 0;
    flippedCardIds = [];
    flippedCards = [];
    let current = parseInt(inputField.value);
    inputField.value = prevPerfectSquare(current);
    inputField.step = current - prevPerfectSquare(current);
    renderDeck(inputField.value);
  });


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
                <div class="card__face card__face--front"><h1 id="fade-number"></h1></div>
                <div class="card__face card__face--back"><h1 class="number">${value}</h1></div>
            </div>`
}

// Render the deck of cards
function renderDeck(tiles) {
    if (timer) clearInterval(timer);
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
        card.style.width = `${800/Math.sqrt(tiles)}px`;
        card.firstElementChild.querySelector('h1').style.fontSize = `${(800/Math.sqrt(tiles)/10*4)}px`;
        card.addEventListener('click', flipCard);
    });
    timer = setInterval(hint, 800/tiles*40);
}

// Flip a card
function flipCard(event) {
    const card = event.currentTarget;
    const id = card.getAttribute('data-id');
    const value = card.getAttribute('data-value');
    card.firstElementChild.querySelector('h1').classList.remove('fade-number');

    if (flippedCards.length < 2 && !flippedCardIds.includes(id)) {
        card.firstElementChild.querySelector('h1').innerText = value;
        flippedCards.push({ id, value });
        flippedCardIds.push(id);
        card.classList.add('is-flipped');

        if (flippedCards.length === 2) {
            if (flippedCards[0].value === flippedCards[1].value) {
                score++;
                flippedCards = [];
                flippedCardIds = [];
                console.log(score)
                if (score === inputField.value/2) {
                    alert('You win!');
                }
            } else {
                setTimeout(() => {
                    flippedCards.forEach((flippedCard) => {
                        const cardToFlip = document.querySelector(`[data-id="${flippedCard.id}"]`);
                        cardToFlip.classList.remove('is-flipped');
                        cardToFlip.firstElementChild.querySelector('h1').classList.add('fade-number');
                        setTimeout(() => {
                            cardToFlip.firstElementChild.querySelector('h1').innerText = '';
                        },2000);
                        
                    });
                    flippedCards = [];
                    flippedCardIds = [];
                }, 1000);
            }
        }
    }
}


function hint() {
        let card1 = document.querySelector(`[data-id="${Math.floor(Math.random() * inputField.value)}"]`);
        card1.children[0].querySelector('h1').innerText = card1.children[1].querySelector('h1').innerText;
        card1.children[0].querySelector('h1').classList.add('fade-number');
        setTimeout(() => {
            card1.children[0].querySelector('h1').classList.remove('fade-number');
            card1.children[0].querySelector('h1').innerText = '';
        }, 3000);

}

// Initial render of the deck
renderDeck(16);


