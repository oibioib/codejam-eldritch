// CSS
import '../css/style.scss';

// Selectors
import { ancientsBlock, deckTakeCard, difficultiesBlock, logBlock, makeDeckButton } from './selectors';

// Imports
import renderAncientsBlock, { ancientCardDataAttr } from './modules/ancients';
import renderDifficultiesBlock, { difficultieDataAttr } from './modules/difficulties';
import { getAncientData, hideDeck, renderCurrentCard, selectAllCardsForDeckHandler, showDeck, updateCardsBlock } from './modules/cards';
import { hideMakeDeck, showMakeDeck } from './modules/make-deck';
import { arrayShuffle, getRandomNums, isAllBoolenTrue } from './auxiliary/functions';
import { clearLog, logCard } from './modules/log';

// Props
let ancientChoosen = false;
let difficultieChoosen = false;
let cardsCurrentState = {};
let currentStage = null;

// Init render blocks
renderAncientsBlock();
renderDifficultiesBlock();

const setCardsInitState = (ancientId) => {
    currentStage = null;
    cardsCurrentState = {
        firstStage: {
            green: 0,
            blue: 0,
            brown: 0
        },
        secondStage: {
            green: 0,
            blue: 0,
            brown: 0
        },
        thirdStage: {
            green: 0,
            blue: 0,
            brown: 0
        }
    };
    const data = getAncientData(ancientId);
    Object.entries(cardsCurrentState).forEach(([stage, stageCards]) => {
        Object.keys(stageCards).forEach((value) => {
            cardsCurrentState[stage][value] = data[stage][value];
        });
    });
};

const setRandomCardsForStages = (cardsObject, randomCards) => {
    const cardsForDeck = {
        green: randomCards.filter((card) => card.color === 'green'),
        brown: randomCards.filter((card) => card.color === 'brown'),
        blue: randomCards.filter((card) => card.color === 'blue')
    };

    const getRandomCardsByColor = (colorCards, quantity) => {
        const { length } = colorCards;
        const randoms = getRandomNums(0, length, quantity);
        return colorCards.filter((_, index) => randoms.includes(index));
    };

    const alreadyInDeck = [];

    Object.entries(cardsObject).forEach(([stage, cards]) => {
        const stageCards = [];
        Object.entries(cards).forEach(([color, quantity]) => {
            const cardsNotInDeck = cardsForDeck[color].filter(
                (card) => !alreadyInDeck.includes(card)
            );
            const randoms = getRandomCardsByColor(cardsNotInDeck, quantity);
            alreadyInDeck.push(...randoms);
            stageCards.push(...randoms);
        });
        arrayShuffle(stageCards);
        cardsCurrentState[stage].cards = [...stageCards];
    });
};

// Event Listeners
ancientsBlock.addEventListener('click', (e) => {
    const attr = e.target.getAttribute(ancientCardDataAttr);
    if (attr && !ancientChoosen && difficultieChoosen) {
        ancientChoosen = attr;
        renderAncientsBlock(attr);
        hideDeck();
        clearLog();
        if (isAllBoolenTrue(ancientChoosen, difficultieChoosen)) {
            showMakeDeck();
        }
    }
    if (attr && attr !== ancientChoosen) {
        difficultieChoosen = false;
        renderDifficultiesBlock(difficultieChoosen);
        ancientChoosen = attr;
        renderAncientsBlock(attr);
        hideDeck();
        clearLog();
        if (isAllBoolenTrue(ancientChoosen, difficultieChoosen)) {
            showMakeDeck();
        }
    }
});

difficultiesBlock.addEventListener('click', (e) => {
    const attr = e.target.getAttribute(difficultieDataAttr);
    if (attr !== difficultieChoosen) {
        difficultieChoosen = attr;
        renderDifficultiesBlock(attr);
        hideDeck();
        clearLog();
        if (isAllBoolenTrue(ancientChoosen, difficultieChoosen)) {
            showMakeDeck();
        }
    }
});

makeDeckButton.addEventListener('click', () => {
    hideMakeDeck();
    showDeck(ancientChoosen, difficultieChoosen);
    setCardsInitState(ancientChoosen);
    setRandomCardsForStages(
        cardsCurrentState,
        selectAllCardsForDeckHandler(ancientChoosen, difficultieChoosen)
    );
});

const getCurrentCard = () => {
    if (currentStage) {
        const currentCard = cardsCurrentState[currentStage].cards.pop();
        cardsCurrentState[currentStage][currentCard.color] -= 1;
        renderCurrentCard(currentCard.cardFace, currentCard.color);

        logCard(currentCard);
    }
};

const setCurrentStage = () => {
    if (cardsCurrentState.firstStage.cards.length) {
        currentStage = 'firstStage';
    } else if (cardsCurrentState.secondStage.cards.length) {
        currentStage = 'secondStage';
    } else if (cardsCurrentState.thirdStage.cards.length) {
        currentStage = 'thirdStage';
        if (cardsCurrentState.thirdStage.cards.length === 1) {
            deckTakeCard.classList.remove('active');
        }
    } else {
        currentStage = null;
    }
};

deckTakeCard.addEventListener('click', () => {
    setCurrentStage();
    getCurrentCard();
    updateCardsBlock(cardsCurrentState);
});
