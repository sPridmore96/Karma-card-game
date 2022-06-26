//----------- imported obj
import fullDeckObj from './cards.js';

//------------ global Vars
let shuffledDeckArr = [];
let tableStackArr = [];
let userHandArr = [];
let opponentHandArr = [];
let randomIndex = 0;
let removedDeckCardObj = {};
let htmlFoundCard = [];
let copiedCardInfoCheckCards = [];
let discardedCardIndex = 0;
const rules = 'reset,invisible,go lower than,miss ago,burn';
let currentStackRule = [];
let burnArray = [];
let tableCard = {};
let playerCard = {};
let userPlayed = false;
let answer;
let message = ``;

// ---------- DOM selectors
const userDiv = document.querySelector('.user');
const usersHandHTML = document.querySelector('.user__hand');
const opponentHandHTML = document.querySelector('.opponent__hand');
const tableDeck = document.querySelector('.table__deck');
const tableStackElement = document.querySelector('.table__stack');
const tableBurn = document.querySelector('.table__burn');
const cantGoButton = document.querySelector('#cant-go');
const showTurn = document.querySelector('#playerTurn');
const startAgain = document.querySelector('#start-again');

// --------- start of game

const showPlayerTurn = () => {
  if (userPlayed === true) {
    showTurn.innerHTML = `<p>It's The Opponents Turn</p>`;
  } else {
    showTurn.innerHTML = `<p>It's Your Turn</p>`;
  }
};

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
    tableDeck.innerHTML = `<p>Deck <br> Finished</p>`;
    return;
  }
};

const declareWinner = (playerArr, otherPlayerArr) => {
  if (playerArr.length === 0) {
    message = `<h1>Winner!!!</h1> <br> <p>Play Again?</p>`;
    let gameFinished = true;
    return (showTurn.innerHTML = message), gameFinished;
  } else if (otherPlayerArr.length === 0) {
    let gameFinished = true;
    message = `<h1>Unlucky, Play Again?</h1>`;
    return (showTurn.innerHTML = message), gameFinished;
  } else {
    return;
  }
};

const reStartGame = (event) => {
  location.reload();
};

// --------------- moving cards to be used

//wrapper functions --------------------------------
const makePlayerHandFromDeck = () => {
  if (shuffledDeckArr.length === 0) {
    return;
  } else {
    if (userHandArr.length === 0) {
      createHand(userHandArr, 3);
      createHand(opponentHandArr, 3);
      makeHTMLForFirstHand(opponentHandArr, opponentHandHTML);
      makeHTMLForFirstHand(userHandArr, usersHandHTML);
    } else if (userHandArr.length != 0) {
      while (userHandArr < 3) {
        createHand(userHandArr, 1);
        createHand(opponentHandArr, 1);
        makeHTMLForPlayingHand(userHandArr, usersHandHTML);
        makeHTMLForPlayingHand(opponentHandArr, opponentHandHTML);
      }
    }
  }
};

const createHand = (playerHandArr, amountOfCards) => {
  for (let i = 0; i < amountOfCards; i++) {
    removedDeckCardObj = removeFromDeck(shuffledDeckArr);
    addCardToArr(playerHandArr, removedDeckCardObj);
    playerHandArr.forEach((obj) => {
      obj = createCardInfo(obj);
      obj = createCardInfoForOpponent(obj);
    });
  }
};

const ReplenishHand = (playerArr, playerHTML) => {
  if (shuffledDeckArr.length === 0) {
    return;
  } else {
    if (playerArr.length < 3) {
      do {
        createHand(playerArr, 1);
        makeHTMLForPlayingHand(playerArr, playerHTML);
      } while (playerArr.length < 3);
    } else {
      null;
    }
  }
};

// -----------------------------------------------

const addCardToArr = (playerArr, givenCard) => {
  playerArr = playerArr.push(givenCard);
  return playerArr;
};

const makeHTMLForPlayingHand = (playerHandArr, htmlElement) => {
  if (playerHandArr === userHandArr) {
    let newHTML = [];
    playerHandArr.forEach((cardObj) => {
      newHTML = cardObj['card info'];
    });
    return (htmlElement.innerHTML += newHTML);
  } else {
    let newHTML = [];
    playerHandArr.forEach((cardObj) => {
      newHTML = cardObj['opponent card'];
    });
    return (htmlElement.innerHTML += newHTML);
  }
};
const makeHTMLForFirstHand = (playerHandArr, htmlElement) => {
  if (playerHandArr === userHandArr) {
    playerHandArr.forEach((cardObj) => {
      htmlElement.innerHTML += cardObj['card info'];
    });
  } else {
    playerHandArr.forEach((cardObj) => {
      htmlElement.innerHTML += cardObj['opponent card'];
    });
  }
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
  givenObj['card info'] = cardInfo;
  return givenObj;
};

const createCardInfoForOpponent = (givenObj) => {
  let opponentCard = `<section class="card select card--back">
            <div class="card__inner card__inner--centered">
                <div class="card__column">
                    <div class="card__symbol"></div>
                    <div class="card__symbol"></div>
                </div>
            </div>
        </section>`;
  givenObj['opponent card'] = opponentCard;
  return givenObj;
};

makePlayerHandFromDeck();

const resetValues = (array, playerHandArr) => {
  for (let i = 2; i < array.length; i++) {
    if (array[i].name.includes('3')) {
      array[i].value = 3;
      array[i].rule = 'invisible';
    } else if (array[i].name.includes('8')) {
      array[i].value = 8;
    } else if (array[i].name.includes('2')) {
      array[i].value = 2;
    } else {
      null;
    }
  }
  playerHandArr.forEach((card) => {
    if (card.name.includes('3')) {
      card.value = 3;
      card.rule = 'invisible';
    } else if (card.name.includes('8')) {
      card.value = 8;
    } else if (card.name.includes('2')) {
      card.value = 2;
    } else {
      null;
    }
  });
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const getIndexToPlay = (array) => {
  let length = array.length;
  return (randomIndex = getRandomInt(length));
};

const removeCard = (event) => {
  htmlFoundCard = [];
  for (let i = 0; i < event.path.length - 4; i++) {
    if (event.path[i].className.includes('card select card')) {
      htmlFoundCard.push(event.path[i]);
    }
  }
};

// wrapper function -------------------

const removeCardFromUser = (event) => {
  console.log(tableStackArr);

  declareWinner(userHandArr, opponentHandArr);

  if (userPlayed === false) {
    removeCard(event);

    resetValues(tableStackArr, userHandArr);

    let collectedInfo = loopThroughHandArr(userHandArr);
    discardedCardIndex = showDiscardedCardIndex(htmlFoundCard, collectedInfo);
    let CopyRemovedCardObj = removeCopyCardFromPlayerArr(
      userHandArr,
      discardedCardIndex
    );

    if (tableStackArr.length === 0) {
      removeCardFromPlayerAfterApproval(userHandArr);
      ReplenishHand(userHandArr, usersHandHTML);
      userPlayed = true;
      setTimeout(() => {
        removeCardFromUserTwo(userPlayed);
      }, 3000);
      return;
    } else {
      copyCardInfoToCheck(CopyRemovedCardObj);
      const playerCard = collectPlayerCardToCompare();
      const tableCard = collectTableCardToCompare();
      setTimeout(() => {
        removeCardFromUserTwo(userPlayed);
      }, 3000);
      if (isCardMagic(playerCard)) {
        removeCardFromPlayerAfterApproval(userHandArr);
        ReplenishHand(userHandArr, usersHandHTML);

        userPlayed =
          playerCard.value === 8 || playerCard.value === 10 ? false : true;
      } else if (isCardMagic(tableCard)) {
        ifStackCardIsMagic(tableCard, playerCard, userHandArr);

        if (answer === true) {
          ReplenishHand(userHandArr, usersHandHTML);

          userPlayed = true;
        }
        showPlayerTurn();
      } else if (isCardMagic(tableCard)) {
        ifStackCardIsMagic(tableCard, playerCard, userHandArr);
        if (answer === true) {
          ReplenishHand(userHandArr, usersHandHTML);
          userPlayed = true;
        }
      } else if (compareCardValues(playerCard, tableCard)) {
        removeCardFromPlayerAfterApproval(userHandArr);
        ReplenishHand(userHandArr, usersHandHTML);
        userPlayed = true;
      } else {
        userPlayed = false;
        return;
      }
    }
  }
  showPlayerTurn();

  setTimeout(() => {
    removeCardFromUserTwo(userPlayed);
  }, 2000);
};

// ------------------------------------
// opponent wrapper function

const removeCardFromUserTwo = (turn) => {
  declareWinner(userHandArr, opponentHandArr);
  resetValues(tableStackArr, opponentHandArr);
  let whileCount = 0;
  if (turn === true) {
    do {
      if (userPlayed === true) {
        randomIndex = getIndexToPlay(opponentHandArr);
        htmlFoundCard = [];
        console.log(tableStackArr);
        htmlFoundCard.push(opponentHandHTML.childNodes[randomIndex]);

        discardedCardIndex = randomIndex;
        let CopyRemovedCardObj = removeCopyCardFromPlayerArr(
          opponentHandArr,
          discardedCardIndex
        );

        if (tableStackArr.length === 0) {
          removeCardFromPlayerAfterApproval(opponentHandArr);
          ReplenishHand(opponentHandArr, opponentHandHTML);
          userPlayed = false;
        } else {
          copyCardInfoToCheck(CopyRemovedCardObj);
          const playerCard = collectPlayerCardToCompare();
          const tableCard = collectTableCardToCompare();
          if (isCardMagic(playerCard)) {
            removeCardFromPlayerAfterApproval(opponentHandArr);
            ReplenishHand(opponentHandArr, opponentHandHTML);

            if (playerCard.value === 8 || playerCard.value === 10) {
              userPlayed = true;

              return;
            } else {
              userPlayed = false;
            }
            return showPlayerTurn();
          } else if (isCardMagic(tableCard)) {
            ifStackCardIsMagic(tableCard, playerCard, opponentHandArr);
            if (answer === true) {
              ReplenishHand(opponentHandArr, opponentHandHTML);
              userPlayed = false;
              showPlayerTurn();
              return;
            } else {
              userPlayed === false;
              removeCardFromUserTwo();
            }
          } else if (compareCardValues(playerCard, tableCard)) {
            removeCardFromPlayerAfterApproval(opponentHandArr);
            ReplenishHand(opponentHandArr, opponentHandHTML);
            userPlayed = false;
            showPlayerTurn();
            return;
          } else {
            userPlayed = true;
          }
        }
      }
      whileCount++;
      if (whileCount === 4000) {
        return cantGoPTwo();
      }
    } while (userPlayed === true);
    showPlayerTurn();
  } else {
    null;
  }
};

//-----------------------------

const loopThroughHandArr = (playerHandArr) => {
  let collectedInfo = [];
  playerHandArr.forEach((card) => {
    collectedInfo.push(card['card info']);
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
  const copyPlayArr = [...playerArr];
  let copyRemovedObj = copyPlayArr.splice(index, 1);
  return copyPlayArr, copyRemovedObj;
};

const cardToTableStackArr = (array) => {
  array.forEach((obj) => {
    tableStackArr.unshift(obj);
  });
  return tableStackArr;
};

const createStackHTML = (array, htmlElement) => {
  array.forEach((obj) => {
    htmlElement.innerHTML = obj['card info'];
  });
};

// -------------- card rules

const collectPlayerCardToCompare = () => {
  const playerCard = copiedCardInfoCheckCards[0];
  copiedCardInfoCheckCards = [];
  return playerCard;
};

const collectTableCardToCompare = () => {
  const tableCard = tableStackArr[0];
  return tableCard;
};

const isCardMagic = (card) => {
  return rules.includes(card.rule) ? true : false;
};

const compareCardValues = (valueOne, valueTwo) => {
  return valueOne.value >= valueTwo.value ? true : false;
};

const collectRule = (stackCard) => {
  const ArrOfRules = rules.split(',');
  ArrOfRules.filter((rule) => {
    if (rule.includes(stackCard.rule)) {
      currentStackRule.unshift(rule);
    }
  });
  return currentStackRule;
};

const compareLowerThanCardValues = (tableCard, playerCard) => {
  return playerCard.value <= tableCard.value ? true : false;
};

const removeCardFromPlayerAfterApproval = (playerHandArr) => {
  let removedCardObj = removeCardFromPlayerArr(
    playerHandArr,
    discardedCardIndex
  );
  cardToTableStackArr(removedCardObj);
  createStackHTML(removedCardObj, tableStackElement);
  htmlFoundCard[0].remove();
};

const ifStackCardIsMagic = (topStackCard, cardPlayed, arrayFrom) => {
  let stackRule = collectRule(topStackCard);
  let newCardValue = 0;
  switch (stackRule[0]) {
    case 'reset':
      newCardValue = 0;
      topStackCard.value = newCardValue;
      removeCardFromPlayerAfterApproval(arrayFrom);
      answer = true;
      return;
    case 'invisible':
      let newCardRule = tableStackArr[1].rule;
      newCardValue = tableStackArr[1].value;
      topStackCard.value = newCardValue;
      topStackCard.rule = newCardRule;
      if (topStackCard.rule === 'nothing') {
        answer = compareCardValues(topStackCard, playerCard);
        if (answer === true) {
          removeCardFromPlayerAfterApproval(arrayFrom);
          return;
        } else {
          return null;
        }
      } else if (topStackCard.rule != 'nothing') {
        ifStackCardIsMagic(topStackCard, cardPlayed, arrayFrom);
        break;
      } else {
        return null;
      }

    case 'go lower than':
      answer = compareLowerThanCardValues(topStackCard, cardPlayed);
      if (answer || isCardMagic(cardPlayed)) {
        removeCardFromPlayerAfterApproval(arrayFrom);
      } else {
        answer === false;
      }
      break;
    case 'miss ago':
      newCardValue = 0;
      topStackCard.value = newCardValue;
      removeCardFromPlayerAfterApproval(arrayFrom);
      answer = true;
      break;
    case 'burn':
      moveDeckArray(burnArray, tableBurn);
      removeCardFromPlayerAfterApproval(arrayFrom);
      answer = true;
      break;
    case 'nothing':
      answer = compareCardValues(topStackCard, playerCard);
      if (answer) {
        removeCardFromPlayerAfterApproval(arrayFrom);
      }
  }
  currentStackRule = [];
};

const cantGoPTwo = () => {
  resetValues(tableStackArr, opponentHandArr);
  opponentHandArr = opponentHandArr.concat(tableStackArr);
  opponentHandArr.sort((a, b) => {
    return a.value - b.value;
  });
  tableStackArr = [];
  tableStackElement.innerHTML = ``;
  opponentHandHTML.innerHTML = ``;
  makeHTMLForFirstHand(opponentHandArr, opponentHandHTML);
  userPlayed = true;
};

const cantGo = (event) => {
  event = event.target;
  resetValues(tableStackArr, userHandArr);
  userHandArr = userHandArr.concat(tableStackArr);
  userHandArr.sort((a, b) => {
    return a.value - b.value;
  });
  tableStackArr = [];
  tableStackElement.innerHTML = ``;
  usersHandHTML.innerHTML = ``;
  makeHTMLForFirstHand(userHandArr, usersHandHTML);
  userPlayed = false;
};

const moveDeckArray = (arrayToo, htmlElement) => {
  arrayToo = tableStackArr;
  arrayToo.reverse();
  tableStackArr = [];
  tableStackElement.innerHTML = ``;
  createStackHTML(arrayToo, htmlElement);
};

// ------------ event listeners
startAgain.addEventListener('click', reStartGame);
userDiv.addEventListener('click', removeCardFromUser);
cantGoButton.addEventListener('click', cantGo);
