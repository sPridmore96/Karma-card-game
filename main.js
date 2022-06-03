//----------- imported obj
import fullDeckObj from "./cards.js";

//------------ global Vars
let shuffledDeckArr = [];
let shuffledDeckArrTwo = []
let tableStackArr = [];
let userHandArr = [];
let opponentHandArr = [];
let randomIndex = 0
let removedDeckCardObj = {};
let htmlFoundCard = [];
let copiedCardInfoCheckCards = [];
let discardedCardIndex = 0
const rules = 'reset,invisible,go lower than,miss ago,burn'
let currentStackRule = []
let burnArray = []
let tableCard = {}
let playerCard = {}
let userPlayed = false
let answer = Boolean


// ---------- DOM selectors
const userDiv = document.querySelector(".user");
const opponentsDiv = document.querySelector(".opponent")
const usersHandHTML = document.querySelector(".user__hand");
const opponentHandHTML = document.querySelector(".opponent__hand")
const table = document.querySelector(".table")
const tableDeck = document.querySelector(".table__deck");
const tableStackElement = document.querySelector(".table__stack");
const tableBurn = document.querySelector(".table__burn");
const cantGoButton = document.querySelector("#cant-go");
const cantGoButtonPTwo = document.querySelector("#cant-go-PTwo");
const chose = document.querySelector("#chose");
const showTurn = document.querySelector("#playerTurn")

// --------- start of game

const showPlayerTurn = () => {
    if (userPlayed === true) {
        showTurn.innerHTML = `<p>It's The Opponents Turn</p>`
    } else {
        showTurn.innerHTML = `<p>It's Your Turn</p>`
    }
}

const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
};

const startGame = () => {
    shuffledDeckArr = shuffle(fullDeckObj);
    return shuffledDeckArr;
};
startGame();

const removeFromDeck = (deck) => {
    if (deck.length > 0) {
        return deck.pop();
    } else {
        tableDeck.innerHTML = ``
    }
};

// --------------- moving cards to be used

//wrapper functions --------------------------------
const makePlayerHandFromDeck = () => {
    if (userHandArr.length === 0) {
        createHand(userHandArr, 3);
        createHand(opponentHandArr, 3)
        makeHTMLForFirstHand(opponentHandArr, opponentHandHTML);
        makeHTMLForFirstHand(userHandArr, usersHandHTML);
    } else if (userHandArr.length != 0) {
        while (userHandArr < 3) {
            createHand(userHandArr, 1);
            createHand(opponentHandArr, 1);
            makeHTMLForPlayingHand(userHandArr, usersHandHTML);
            makeHTMLForPlayingHand(opponentHandArr, opponentHandHTML)
        }
    }
};

const createHand = (playerHandArr, amountOfCards) => {
    for (let i = 0; i < amountOfCards; i++) {
        removedDeckCardObj = removeFromDeck(shuffledDeckArr);
        addCardToArr(playerHandArr, removedDeckCardObj);
        playerHandArr.forEach((obj) => {
            obj = createCardInfo(obj);
        });
    }
};


const ReplenishHand = (playerArr, playerHTML) => {
    if (playerArr.length < 3) {
        do {
            createHand(playerArr, 1);
            makeHTMLForPlayingHand(playerArr, playerHTML);
        }
        while (playerArr.length < 3)
    } else {
        null
    }
}


// -----------------------------------------------

const addCardToArr = (playerArr, givenCard) => {
    playerArr = playerArr.push(givenCard);
    return playerArr;
};

const makeHTMLForPlayingHand = (playerHandArr, htmlElement) => {
    let newHTML = [];
    playerHandArr.forEach((cardObj) => {
        newHTML = cardObj["card info"];
    });
    return (htmlElement.innerHTML += newHTML);
};
const makeHTMLForFirstHand = (playerHandArr, htmlElement) => {
    playerHandArr.forEach((cardObj) => {
        htmlElement.innerHTML += cardObj["card info"];
    });
};

const createCardInfo = (givenObj) => {
    let cardInfo = `<section class="card select card--${givenObj.suit}" name="${givenObj.name}" value = ${givenObj.value}>
            <div class="card__inner card__inner--centered">
                <div class="card__column">
                    <div class="card__symbol"></div>
                    <div class="card__symbol"></div>
                </div>
            </div>
        </section>`;
    givenObj["card info"] = cardInfo;
    return givenObj;
};

makePlayerHandFromDeck()



// wrapper function -------------------

const removeCardFromUser = (event) => {

    if (userPlayed === false) {
        htmlFoundCard = [];
        for (let i = 0; i < event.path.length - 4; i++) {
            if (event.path[i].className.includes("card select card")) {
                htmlFoundCard.push(event.path[i]);
            } else {
                null;
            }
        }

        let collectedInfo = loopThroughHandArr(userHandArr);
        discardedCardIndex = showDiscardedCardIndex(htmlFoundCard, collectedInfo);
        let CopyRemovedCardObj = removeCopyCardFromPlayerArr(userHandArr, discardedCardIndex);

        if (tableStackArr.length === 0) {
            removeCardFromPlayerAfterApproval(userHandArr)
            ReplenishHand(userHandArr, usersHandHTML)
            userPlayed = true
        } else {
            copyCardInfoToCheck(CopyRemovedCardObj);
            const playerCard = collectPlayerCardToCompare()
            const tableCard = collectTableCardToCompare()


            if (isCardMagic(playerCard)) {
                removeCardFromPlayerAfterApproval(userHandArr)
                ReplenishHand(userHandArr, usersHandHTML)
                if (playerCard.value === 8 || playerCard.value === 10) {
                    userPlayed = false
                } else {
                    userPlayed = true
                }
                showPlayerTurn()
                setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
                return
            } else if (isCardMagic(tableCard)) {
                ifStackCardIsMagic(tableCard, playerCard, userHandArr)
                ReplenishHand(userHandArr, usersHandHTML)
                userPlayed = true
                showPlayerTurn()
                setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
                return

            } else if (compareCardValues(playerCard, tableCard)) {
                removeCardFromPlayerAfterApproval(userHandArr)
                ReplenishHand(userHandArr, usersHandHTML)
                userPlayed = true
                showPlayerTurn()
                setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
                return
            } else {
                null
            }
        }
    } else {
        setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
    }
    showPlayerTurn()
}

// ------------------------------------
// opponent wrapper function

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}
const getIndexToPlay = (array) => {
    let length = array.length
    console.log(getRandomInt(length))
    return randomIndex = getRandomInt(length);
}



const removeCardFromUserTwo = (turn) => {
    let whileCount = 0
    if (turn === true) {
        do {
            if (userPlayed === true) {


                randomIndex = getIndexToPlay(opponentHandArr)

                htmlFoundCard = [];

                htmlFoundCard.push(opponentHandHTML.childNodes[randomIndex]);



                discardedCardIndex = randomIndex
                let CopyRemovedCardObj = removeCopyCardFromPlayerArr(opponentHandArr, discardedCardIndex);

                if (tableStackArr.length === 0) {
                    removeCardFromPlayerAfterApproval(opponentHandArr)
                    ReplenishHand(opponentHandArr, opponentHandHTML)
                    userPlayed = false

                } else {

                    copyCardInfoToCheck(CopyRemovedCardObj);
                    const playerCard = collectPlayerCardToCompare()
                    const tableCard = collectTableCardToCompare()

                    if (isCardMagic(playerCard)) {
                        removeCardFromPlayerAfterApproval(opponentHandArr)
                        ReplenishHand(opponentHandArr, opponentHandHTML)
                        if (playerCard.value === 8 || playerCard.value === 10) {
                            userPlayed = true
                            setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
                        } else {
                            userPlayed = false
                        }
                        showPlayerTurn()
                        return

                    } else if (isCardMagic(tableCard)) {
                        ifStackCardIsMagic(tableCard, playerCard, opponentHandArr)
                        if (answer === true) {
                            ReplenishHand(opponentHandArr, opponentHandHTML)
                            userPlayed = false
                            showPlayerTurn()
                            return
                        } else { 
                            userPlayed = true 
                        }
                    } else if (compareCardValues(playerCard, tableCard)) {
                        removeCardFromPlayerAfterApproval(opponentHandArr)
                        ReplenishHand(opponentHandArr, opponentHandHTML)
                        userPlayed = false
                        showPlayerTurn()
                        return
                    } else {
                        userPlayed = true 
                    }
                }
            } whileCount++
            if (whileCount === 100) {
                cantGoPTwo()
                return
            }
        } while (userPlayed === true)
        showPlayerTurn()
    } else {
        null
    }
}
//-----------------------------

const loopThroughHandArr = (playerHandArr) => {
    let collectedInfo = [];
    playerHandArr.forEach((card) => {
        collectedInfo.push(card["card info"]);
    });
    return collectedInfo;
};

const showDiscardedCardIndex = (collectedInfo, playerArr) => {
    for (let i = 0; i < playerArr.length; i++) {
        if (
            playerArr[i].includes(
                collectedInfo[0].attributes[0].nodeValue &&
                collectedInfo[0].attributes[2].value
            )
        ) {
            let foundIndex = i;
            return foundIndex;
        } else {
            null;
        }
    }
};

const copyCardInfoToCheck = (objArray) => {
    objArray.forEach((obj) => {
        copiedCardInfoCheckCards.push(obj);
    });
};



const removeCardFromPlayerArr = (playerArr, index) => {
    let removedObj = playerArr.splice(index, 1);
    return playerArr, removedObj;
};

const removeCopyCardFromPlayerArr = (playerArr, index) => {
    const copyPlayArr = [...playerArr]
    let copyRemovedObj = copyPlayArr.splice(index, 1);
    return copyPlayArr, copyRemovedObj;
};


// ------------- Adding to table deck
const cardToTableStackArr = (array) => {
    array.forEach(obj => {
        tableStackArr.push(obj);
    })
    return tableStackArr
};

const createStackHTML = (array, htmlElement) => {
    array.forEach(obj => {
        htmlElement.innerHTML = obj["card info"]
    })

}


// -------------- card rules 

const collectPlayerCardToCompare = () => {
    const playerCard = copiedCardInfoCheckCards[0];
    copiedCardInfoCheckCards = []
    return playerCard
}

const collectTableCardToCompare = () => {
    const tableCard = tableStackArr[tableStackArr.length - 1];
    return tableCard
}

const isCardMagic = (card) => {
    return rules.includes(card.rule) ? true : false;
}

const compareCardValues = (valueOne, valueTwo) => {
    return valueOne.value >= valueTwo.value ? true : false;
};


const collectRule = (stackCard) => {
    const ArrOfRules = rules.split(",")
    ArrOfRules.filter(rule => {
        if (rule.includes(stackCard.rule)) {
            currentStackRule.push(rule)
        }
    })
    return currentStackRule
}

const compareLowerThanCardValues = (tableCard, playerCard) => {
    return playerCard.value <= tableCard.value ? true : false;
};

const removeCardFromPlayerAfterApproval = (playerHandArr) => {
    let removedCardObj = removeCardFromPlayerArr(playerHandArr, discardedCardIndex)
    cardToTableStackArr(removedCardObj)
    createStackHTML(removedCardObj, tableStackElement)
    htmlFoundCard[0].remove();
}

const ifStackCardIsMagic = (topStackCard, cardPlayed, arrayFrom) => {
    let stackRule = collectRule(topStackCard);
    let newCardValue = 0
    switch (stackRule[0]) {
        case "reset":
            newCardValue = 0;
            topStackCard.value = newCardValue
            removeCardFromPlayerAfterApproval(arrayFrom)
            break
        case "invisible":
            let newCardRule = tableStackArr[tableStackArr.length - 2].rule
            newCardValue = tableStackArr[tableStackArr.length - 2].value
            topStackCard.value = newCardValue
            topStackCard.rule = newCardRule
            if (topStackCard.rule != "invisible" && topStackCard.rule != "nothing") {
                stackRule[0] = topStackCard.rule
                ifStackCardIsMagic(tableCard, playerCard, userHandArr)
                answer = true
                break
            } else if (topStackCard.rule === "invisible") {
                removeCardFromPlayerAfterApproval(arrayFrom)
                answer = true
                break
            }
            break
        case "go lower than":
            answer = compareLowerThanCardValues(topStackCard, cardPlayed)
            if (answer || isCardMagic(cardPlayed)) {
                removeCardFromPlayerAfterApproval(arrayFrom)
            } else { answer === false }
            break
        case "miss ago":
            newCardValue = 0;
            topStackCard.value = newCardValue
            removeCardFromPlayerAfterApproval(arrayFrom)
            answer = true
            break
        case "burn":
            moveDeckArray(burnArray, tableBurn)
            removeCardFromPlayerAfterApproval(arrayFrom)
            answer = true
            break
        case "nothing":
            answer = compareCardValues(topStackCard, playerCard)
            if (answer) {
                removeCardFromPlayerAfterApproval(arrayFrom)
            }
    }
    currentStackRule = []
}

const cantGoPTwo = () => {
    // event = event.target;
    opponentHandArr = opponentHandArr.concat(tableStackArr);
    opponentHandArr.sort((a, b) => {
        return a.value - b.value
    })
    tableStackArr = []
    tableStackElement.innerHTML = ``
    opponentHandHTML.innerHTML = ``
    makeHTMLForFirstHand(opponentHandArr, opponentHandHTML)
    userPlayed = true
    setTimeout(() => {removeCardFromUserTwo(userPlayed)},3000)
}

const cantGo = (event) => {
    event = event.target;

    userHandArr = userHandArr.concat(tableStackArr);
    userHandArr.sort((a, b) => {
        return a.value - b.value
    })
    tableStackArr = []
    tableStackElement.innerHTML = ``
    usersHandHTML.innerHTML = ``
    makeHTMLForFirstHand(userHandArr, usersHandHTML)
    userPlayed = false
}

const moveDeckArray = (arrayToo, htmlElement) => {
    arrayToo = tableStackArr;
    tableStackArr = []
    tableStackElement.innerHTML = ``
    createStackHTML(arrayToo, htmlElement)
}


// ------------ event listeners
userDiv.addEventListener("click", removeCardFromUser);
opponentsDiv.addEventListener("click", removeCardFromUserTwo)
cantGoButton.addEventListener("click", cantGo)
cantGoButtonPTwo.addEventListener("click", cantGoPTwo)
chose.addEventListener("click", removeCardFromUserTwo)