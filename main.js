const cardArray = [
    {
        name: "Philippines",
        img: "images/Philippines.png"
    },
    {
        name: "Japan",
        img: "images/Japan.png"
    },
    {
        name: "South-Korea",
        img: "images/South-Korea.png"
    },
    {
        name: "China",
        img: "images/China.png"
    },
    {
        name: "India",
        img: "images/India.png"
    },
    {
        name: "Indonesia",
        img: "images/Indonesia.png"
    },
    {
        name: "Malaysia",
        img: "images/Malaysia.png"
    },
    {
        name: "Singapore",
        img: "images/Singapore.png"
    },
    {
        name: "Thailand",
        img: "images/Thailand.png"
    },
    {
        name: "Vietnam",
        img: "images/Vietnam.png"
    },
        {
        name: "Philippines",
        img: "images/Philippines.png"
    },
    {
        name: "Japan",
        img: "images/Japan.png"
    },
    {
        name: "South-Korea",
        img: "images/South-Korea.png"
    },
    {
        name: "China",
        img: "images/China.png"
    },
    {
        name: "India",
        img: "images/India.png"
    },
    {
        name: "Indonesia",
        img: "images/Indonesia.png"
    },
    {
        name: "Malaysia",
        img: "images/Malaysia.png"
    },
    {
        name: "Singapore",
        img: "images/Singapore.png"
    },
    {
        name: "Thailand",
        img: "images/Thailand.png"
    },
    {
        name: "Vietnam",
        img: "images/Vietnam.png"
    }
]

  cardArray.sort(() => 0.5 - Math.random())

  let currentPlayer = "Player 1"
  let count1 = 0;
  let count2 = 0;
  
  const player = document.querySelector("#player");

  player.textContent = currentPlayer;

  const grid = document.querySelector('#grid')
  const resultDisplay = document.querySelector('#result')
  const player1 = document.querySelector("#player1")
  const player2 = document.querySelector("#player2")
  const btn = document.querySelector("#btn")
  let cardsChosen = []
  let cardsChosenId = []
  let cardsWon = []



  btn.addEventListener('click',function(){
    createBoard();
    this.remove();

  })
  //create your board
function createBoard() {
  for (let i = 0; i < cardArray.length; i++) {
    const card = document.createElement('img');
    card.setAttribute('src', cardArray[i].img);
    card.setAttribute('data-id', i);

    card.classList.add("unclickable"); // prevent early click
    grid.appendChild(card);
  }

  startCountdown(); // start the 3-2-1 countdown
}

function startCountdown() {
  const countdownDisplay = document.getElementById('countdown');
  let count = 3;
  countdownDisplay.textContent = `Memorize the cards: ${count}`;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownDisplay.textContent = `Memorize the cards: ${count}`;
    } else {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = ''; // clear text
      flipAllCard();
      enableCardClicks();
    }
  }, 1000);
}


  function flipAllCard() {
    const cards = document.querySelectorAll('#grid img');
    cards.forEach(card => {
      card.setAttribute('src', 'images/question-mark.png');
    });
  }
function enableCardClicks() {
  const cards = document.querySelectorAll('#grid img');
  cards.forEach(card => {
    card.addEventListener('click', flipCard);
    card.classList.remove("unclickable");
  });
}





  //check for matches
  function checkForMatch() {
    const cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]
    
    if(optionOneId == optionTwoId) {
      cards[optionOneId].setAttribute('src', 'images/question-mark.png')
      cards[optionTwoId].setAttribute('src', 'images/question-mark.png')
      alert('You have clicked the same image!')
    }
    else if (cardsChosen[0] === cardsChosen[1]) {
      cards[optionOneId].setAttribute('src', 'images/white.png')
      cards[optionTwoId].setAttribute('src', 'images/white.png')
      cards[optionOneId].removeEventListener('click', flipCard)
      cards[optionTwoId].removeEventListener('click', flipCard)
      cardsWon.push(cardsChosen)
       if(currentPlayer==="Player 1"){
        count1++
        player1.textContent = count1;
        }else{
        count2++
        player2.textContent = count2; 
        }
      
    } else {
      cards[optionOneId].setAttribute('src', 'images/question-mark.png')
      cards[optionTwoId].setAttribute('src', 'images/question-mark.png')
        if(currentPlayer==="Player 1"){
        currentPlayer = "Player 2"
        player.textContent = currentPlayer;
        }else{
        currentPlayer = "Player 1"
        player.textContent = currentPlayer;
        }

    }
    cardsChosen = []
    cardsChosenId = []
    resultDisplay.textContent = cardsWon.length
    if  (cardsWon.length === cardArray.length/2) {
      resultDisplay.textContent = `${checkWinner()} Congratulations! `
    }
  }

  //flip your card
function flipCard() {
  let cardId = this.getAttribute('data-id');

  if (cardsChosenId.length === 1 && cardsChosenId[0] === cardId) return; // prevent double click on same card

  this.setAttribute('src', cardArray[cardId].img);
  cardsChosen.push(cardArray[cardId].name);
  cardsChosenId.push(cardId);
  if (cardsChosen.length === 2) {
    // disable clicks temporarily
    const allCards = document.querySelectorAll('#grid img');
    allCards.forEach(card => card.removeEventListener('click', flipCard));
    setTimeout(() => {
      checkForMatch();
      allCards.forEach(card => card.addEventListener('click', flipCard));
    }, 500);
  }
}


  