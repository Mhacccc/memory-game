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
      const card = document.createElement('img')
      card.setAttribute('src', cardArray[i].img)
      card.setAttribute('data-id', i)
      card.style.width="150px"
      card.style.height="100px"
      card.addEventListener('click', flipCard)
      grid.appendChild(card)
    }
    setTimeout(flipAllCard,3000)
  }


  function flipAllCard(){
    const card = document.querySelectorAll('img')
    card.forEach((element,i) => {
        element.setAttribute('src','images/question-mark.png')
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
    let cardId = this.getAttribute('data-id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenId.push(cardId)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length ===2) {
      setTimeout(checkForMatch, 300)
    }
  }

  function checkWinner(){
    return count1>count2?"PLAYER 1":"PLAYER 2"
  }

  