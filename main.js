//----------- imported obj
import fullDeckObj from "./cards.js"


//------------ global Vars
let shuffledDeckArr = [];
let tableStackArr = []
let stackCardValue = 0;
let userCardValue = 0;
let userCardObj = {}
let userHandArr = []
let opponentHandArr = []
let removedCardObj = {}



// ---------- DOM selectors
const userDiv = document.querySelector(".user");
const usersHandHTML = document.querySelector(".user__hand");
const tableDeck = document.querySelector(".table__deck");
const tableStackElement = document.querySelector(".table__stack")
const tableBurn = document.querySelector('.table__burn')
const giveCard = document.querySelector("#give-card");
const compareButton = document.querySelector('#compare')
const goToBurn = document.querySelector('#burn-card')
const remove = document.getElementById('remove')



// --------- start of game
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const startGame = () => {
    shuffledDeckArr = shuffle(fullDeckObj)
    return shuffledDeckArr
}
startGame()


const compareCardValues = (valueOne, valueTwo) => {
    let highest = 0
    valueOne > valueTwo ? highest = valueOne : highest = valueTwo
    return highest;
}


// --------------- moving cards to be used

const giveStackCard = (playersCard) => {
    givenCard = playersCard.innerHTML
}

const giveUserCard = (event) => {
    let userCard = ''
    event = event.target;
    const removedCardObj = removeFromDeck(shuffledDeckArr)
    addCardToPlayerArr(userHandArr, removedCardObj)
    return userHand, userHandArr
}

const addCardToPlayerArr = (playerArr, givinCard) => {
    playerArr = playerArr.push(givinCard)
    return playerArr
}

const makePlayerHand = (playerHandArr) => {
    for (let i = 0; i < 3; i++) {
        removedCardObj = removeFromDeck(shuffledDeckArr)
        addCardToPlayerArr(userHandArr, removedCardObj)
        userHandArr.forEach(obj => {
        createCardInfo(obj)
        

        })
    }
    makeHTMLForHand(userHandArr, usersHandHTML)
}

const makeHTMLForHand = (playerHandArr, htmlElement) => {
    playerHandArr.forEach(cardObj => {
        htmlElement.innerHTML += cardObj["card info"]
    })
}

const addClickEvent = () => {
    const cardHTMLElement = document.querySelector(".select")
      cardHTMLElement.addEventListener('click', handlePlayerSelectCard)
}

const handlePlayerSelectCard = () => {
    console.log("yeah");
}

const removedCardFromPlayer = () => {

}

const removeCardHTML = (givenObj, htmlElement) => {

}

const removedCardFromPlayerArr = (playerArr, indexFrom, amount) => {
    playerArr = userHandArr.splice(indexFrom, amount)
    return playerArr;
}








const removeFromDeck = (deck) => {
    return deck.pop()
}

const createCardInfo = (givenObj) => {
    let cardInfo =
        ` <section class="card select card--${givenObj.suit}" name="${givenObj.name}" value = ${givenObj.value}>
    <div class="card__inner card__inner--centered">
        <div class="card__column">
            <div class="card__symbol"></div>
            <div class="card__symbol"></div>
        </div>
    </div>
</section>`
    givenObj["card info"] = cardInfo
    return givenObj

}

const makeCardHTML = (givenCardInfo, htmlElement) => {
    htmlElement.innerHTML += givenCardInfo
}


// ------------- Adding to burn deck
const cardToBurnFromStack = (event) => {

}
const copyCardInfo = (htmlElement, receivingElement) => {
    let copiedInfo = htmlElement.innerHTML
    receivingElement.innerHTML = copiedInfo
    return receivingElement
}
const clearCardInfo = (card) => {
    const cardInfoReset = ``
    card.innerHTML = cardInfoReset
}


// ------------ event listeners
giveCard.addEventListener("click", makePlayerHand)
goToBurn.addEventListener('click', cardToBurnFromStack)
userDiv.addEventListener('click', (event) => {
    console.log(event);
})
