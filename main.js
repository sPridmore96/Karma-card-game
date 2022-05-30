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
let htmlFoundCard = []



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

// --------------- moving cards to be used

const removeFromDeck = (deck) => {
    return deck.pop()
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

const createCardInfo = (givenObj) => {
    let cardInfo =
        `<section class="card select card--${givenObj.suit}" name="${givenObj.name}" value = ${givenObj.value}>
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

const loopThroughHandArr = (playerHandArr) => {
    let collectedInfo = []
    playerHandArr.forEach(card => {
        collectedInfo.push(card["card info"])

    })
    return collectedInfo
}


const removeCardFromPlayer = (event) => {
    htmlFoundCard = []
    for (let i = 0; i < event.path.length - 4; i++) {
        if (event.path[i].className.includes("card select card")) {
            htmlFoundCard.push(event.path[i])
        } else {
            null
        }
    }
    copyCardInfo(htmlFoundCard[0], tableStackArr)
    console.log(tableStackArr);
    let collectedInfo = loopThroughHandArr(userHandArr)
    removedCardFromPlayerArr(userHandArr, showDiscardedCardIndex(htmlFoundCard, collectedInfo))
    console.log(userHandArr);

}

const showDiscardedCardIndex = (collectedInfo, playerArr) => {
    for (let i = 0; i < playerArr.length; i++) {
        if (playerArr[i].includes(collectedInfo[0].attributes[0].value && collectedInfo[0].attributes[2].value)) {
            let foundIndex = (i);
            return(foundIndex);
        } else {
            null;
        }
    }

}




const copyCardInfo = (htmlElement, receivingElement) => {
    let copiedInfo = htmlElement.innerHTML
    receivingElement.innerHTML = copiedInfo
    return receivingElement
}

const removedCardFromPlayerArr = (playerArr, objFrom) => {
    playerArr = playerArr.splice(objFrom, 1)
    return playerArr;
}

const compareCardValues = (valueOne, valueTwo) => {
    let highest = 0
    valueOne > valueTwo ? highest = valueOne : highest = valueTwo
    return highest;
}



// ------------- Adding to burn deck
const cardToBurnFromStack = (event) => {
}




// ------------ event listeners
giveCard.addEventListener("click", makePlayerHand)
userDiv.addEventListener('click', removeCardFromPlayer)
