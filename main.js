// Game configuration
const CONFIG = {
    easy: { pairs: 5, memorizeTime: 3 },
    medium: { pairs: 10, memorizeTime: 5 },
    hard: { pairs: 15, memorizeTime: 7 }
};

// Full card array with all possible cards
const fullCardArray = [
    { name: "Philippines", img: "images/Philippines.png" },
    { name: "Japan", img: "images/Japan.png" },
    { name: "South-Korea", img: "images/South-Korea.png" },
    { name: "China", img: "images/China.png" },
    { name: "India", img: "images/India.png" },
    { name: "Indonesia", img: "images/Indonesia.png" },
    { name: "Malaysia", img: "images/Malaysia.png" },
    { name: "Singapore", img: "images/Singapore.png" },
    { name: "Thailand", img: "images/Thailand.png" },
    { name: "Vietnam", img: "images/Vietnam.png" },

    // You can add more countries if needed
];

// Game state
let cardArray = [];
let currentPlayer = "Player 1";
let count1 = 0;
let count2 = 0;
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let moves = 0;
let gameStartTime;
let gameTimer;
let difficultyLevel = 'medium';
let totalPairs = CONFIG.medium.pairs;

// DOM Elements
const player = document.querySelector("#player1-card");
const grid = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');
const player1Display = document.querySelector("#player1");
const player2Display = document.querySelector("#player2");
const player1Card = document.querySelector("#player1-card");
const player2Card = document.querySelector("#player2-card");
const startBtn = document.querySelector("#btn");
const restartBtn = document.querySelector("#restart");
const countdownDisplay = document.querySelector('#countdown');
const movesDisplay = document.querySelector('#moves');
const timerDisplay = document.querySelector('#timer');
const totalPairsDisplay = document.querySelector('#total-pairs');
const difficultySelector = document.querySelector('#difficulty');
const gameOverModal = document.querySelector('#gameOverModal');
const winnerMessage = document.querySelector('#winner-message');
const finalScore = document.querySelector('#final-score');
const timeTaken = document.querySelector('#time-taken');
const playAgainBtn = document.querySelector('#play-again');
const backBtn = document.querySelector('#back');
backBtn.style.display = 'none';

// Event Listeners
backBtn.addEventListener('click',()=>{location.reload()})
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);
difficultySelector.addEventListener('change', function() {
    difficultyLevel = this.value;
    totalPairs = CONFIG[difficultyLevel].pairs;
    totalPairsDisplay.textContent = totalPairs;
});

// Initialize the game
function startGame() {
    // Hide start button and show restart
    backBtn.style.display = 'inline-block';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    
    // Prepare cards for selected difficulty
    prepareCards();
    
    // Reset game state
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    count1 = 0;
    count2 = 0;
    moves = 0;
    player1Display.textContent = '0';
    player2Display.textContent = '0';
    resultDisplay.textContent = '0';
    movesDisplay.textContent = 'Moves: 0';
    
    // Set current player
    currentPlayer = "Player 1";
    updatePlayerUI();
    
    // Create the board
    createBoard();
}

function prepareCards() {
    // Shuffle and get subset based on difficulty
    const shuffledDeck = [...fullCardArray].sort(() => 0.5 - Math.random());
    const selectedCards = shuffledDeck.slice(0, totalPairs);
    
    // Create pairs
    cardArray = [...selectedCards, ...selectedCards].sort(() => 0.5 - Math.random());
}

function createBoard() {
    // Clear the grid
    grid.innerHTML = '';
    
    // Create cards
    for (let i = 0; i < cardArray.length; i++) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', i);
        card.classList.add('unclickable'); // Prevent clicking during countdown
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        
        const img = document.createElement('img');
        img.setAttribute('src', cardArray[i].img);
        img.setAttribute('alt', cardArray[i].name);
        
        cardFront.appendChild(img);
        card.appendChild(cardBack);
        card.appendChild(cardFront);
        cardContainer.appendChild(card);
        grid.appendChild(cardContainer);
        
        // Initially show front face for memorizing
        card.classList.add('flipped');
    }
    
    // Start the countdown
    startCountdown();
}

function startCountdown() {
    let count = CONFIG[difficultyLevel].memorizeTime;
    countdownDisplay.textContent = `Memorize the cards: ${count}`;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.textContent = `Memorize the cards: ${count}`;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = 'Go!';
            setTimeout(() => {
                countdownDisplay.textContent = '';
                flipAllCards();
                enableCardClicks();
                startTimer();
            }, 1000);
        }
    }, 1000);
}

function startTimer() {
    gameStartTime = new Date().getTime();
    gameTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - gameStartTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function flipAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
}

function enableCardClicks() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', flipCard);
        card.classList.remove('unclickable');
    });
}

function flipCard() {
    if (this.classList.contains('flipped')) return; // Already flipped
    
    const cardId = this.getAttribute('data-id');
    
    // Don't allow clicking the same card twice or more than 2 cards
    if (cardsChosenId.length === 1 && cardsChosenId[0] === cardId) return;
    if (cardsChosenId.length >= 2) return;
    
    // Flip the card visually
    this.classList.add('flipped');
    
    // Add card to selected cards
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    
    // Check if we have a pair
    if (cardsChosen.length === 2) {
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        
        // Disable all cards temporarily
        disableAllCards();
        
        // Check for match after a short delay
        setTimeout(checkForMatch, 800);
    }
}

function disableAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
}

function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const firstCardId = cardsChosenId[0];
    const secondCardId = cardsChosenId[1];
    
    // Clicked the same card
    if (firstCardId === secondCardId) {
        cards[firstCardId].classList.remove('flipped');
        alert('You clicked the same card!');
    }
    // Found a match
    else if (cardsChosen[0] === cardsChosen[1]) {
        // Add match animation
        cards[firstCardId].classList.add('match-found');
        cards[secondCardId].classList.add('match-found');
        
        // Remove click listeners permanently for matched cards
        cards[firstCardId].removeEventListener('click', flipCard);
        cards[secondCardId].removeEventListener('click', flipCard);
        
        // Add to won cards
        cardsWon.push(cardsChosen);
        
        // Update score for current player
        if (currentPlayer === "Player 1") {
            count1++;
            player1Display.textContent = count1;
        } else {
            count2++;
            player2Display.textContent = count2;
        }
        
        // Update matches display
        resultDisplay.textContent = cardsWon.length;
        
        // Check if game is over
        if (cardsWon.length === totalPairs) {
            endGame();
        }
    } 
    // No match
    else {
        cards[firstCardId].classList.remove('flipped');
        cards[secondCardId].classList.remove('flipped');
        
        // Switch player
        if (currentPlayer === "Player 1") {
            currentPlayer = "Player 2";
        } else {
            currentPlayer = "Player 1";
        }
        updatePlayerUI();
    }
    
    // Reset choices
    cardsChosen = [];
    cardsChosenId = [];
    
    // Re-enable cards
    enableRemainingCards();
}

function enableRemainingCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Only enable cards that haven't been matched
        if (!card.classList.contains('match-found')) {
            card.addEventListener('click', flipCard);
        }
    });
}

function updatePlayerUI() {
    // Update active player visual
    if (currentPlayer === "Player 1") {
        player1Card.classList.add('active-player');
        player2Card.classList.remove('active-player');
    } else {
        player2Card.classList.add('active-player');
        player1Card.classList.remove('active-player');
    }
}

function endGame() {
    clearInterval(gameTimer);
    
    // Determine winner
    let winner;
    if (count1 > count2) {
        winner = "Player 1";
    } else if (count2 > count1) {
        winner = "Player 2";
    } else {
        winner = "It's a tie!";
    }
    
    // Calculate time elapsed
    const endTime = new Date().getTime();
    const timeElapsed = Math.floor((endTime - gameStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    // Update modal content
    if (winner === "It's a tie!") {
        winnerMessage.textContent = "It's a tie!";
    } else {
        winnerMessage.textContent = `${winner} wins!`;
    }
    finalScore.textContent = `Final Score: Player 1 (${count1}) - Player 2 (${count2})`;
    timeTaken.textContent = `Time: ${minutes}m ${seconds}s | Moves: ${moves}`;
    
    // Create confetti effect
    createConfetti();
    
    // Show modal
    gameOverModal.style.display = 'flex';
}

function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function getRandomColor() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function restartGame() {
    // Clear confetti if any
    document.querySelectorAll('.confetti').forEach(el => el.remove());
    
    // Hide modal
    gameOverModal.style.display = 'none';
    
    // Stop timer if running
    clearInterval(gameTimer);
    timerDisplay.textContent = '00:00';
    
    // Reset and start new game
    startGame();
}

// Set initial display
totalPairsDisplay.textContent = totalPairs;