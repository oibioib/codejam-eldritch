// CSS
import '../css/style.scss';

// Selectors
import {
    ancientsBlock,
    deckTakeCard,
    difficultiesBlock,
    main,
    makeDeckButton
} from './selectors';

// Imports
import { ancientCardDataAttr, createAncients, updateAncientsBlock } from './modules/ancients';
import renderDifficultiesBlock, { difficultieDataAttr } from './modules/difficulties';
import {
    getAncientData,
    hideDeck,
    renderCurrentCard,
    selectAllCardsForDeckHandler,
    showDeck,
    updateCardsBlock
} from './modules/cards';
import { hideMakeDeck, showMakeDeck } from './modules/make-deck';
import { arrayShuffle, getRandomNums, isAllBoolenTrue } from './auxiliary/functions';
import { clearLog, logCard } from './modules/log';
import cardsAncients from './data/cardsAncients';

// Props
let ancientChoosen = false;
let difficultieChoosen = false;
let cardsCurrentState = {};
let currentStage = null;

const renderInitBlocks = async (activeAncient = null) => {
    main.classList.add('loading');
    await createAncients(cardsAncients, activeAncient);
    main.classList.remove('loading');
    ancientsBlock.classList.add('active');
    difficultiesBlock.classList.add('active');
    renderDifficultiesBlock();
};

document.addEventListener('DOMContentLoaded', () => {
    renderInitBlocks();
});

// Functions
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
    Object.entries(cardsCurrentState)
        .forEach(([stage, stageCards]) => {
            Object.keys(stageCards)
                .forEach((value) => {
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

    Object.entries(cardsObject)
        .forEach(([stage, cards]) => {
            const stageCards = [];
            Object.entries(cards)
                .forEach(([color, quantity]) => {
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

const getCurrentCard = async () => {
    if (currentStage) {
        const currentCard = cardsCurrentState[currentStage].cards.pop();
        cardsCurrentState[currentStage][currentCard.color] -= 1;
        await renderCurrentCard(currentCard.cardFace, currentCard.color);
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

const deckTakeCardListener = async () => {
    deckTakeCard.removeEventListener('click', deckTakeCardListener);
    setCurrentStage();
    await getCurrentCard();
    updateCardsBlock(cardsCurrentState);
    deckTakeCard.addEventListener('click', deckTakeCardListener);
};

const makeDeckButtonListener = () => {
    hideMakeDeck();
    showDeck(ancientChoosen, difficultieChoosen);
    setCardsInitState(ancientChoosen);
    setRandomCardsForStages(
        cardsCurrentState,
        selectAllCardsForDeckHandler(ancientChoosen, difficultieChoosen)
    );
};

const ancientsBlockListener = (e) => {
    const attr = e.target.getAttribute(ancientCardDataAttr);
    if (attr && !ancientChoosen && difficultieChoosen) {
        ancientChoosen = attr;
        updateAncientsBlock(attr);
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
        updateAncientsBlock(attr);
        hideMakeDeck();
        hideDeck();
        clearLog();
        if (isAllBoolenTrue(ancientChoosen, difficultieChoosen)) {
            showMakeDeck();
        }
    }
};

const difficultiesBlockListener = (e) => {
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
};

// Event Listeners
ancientsBlock.addEventListener('click', (e) => ancientsBlockListener(e));
difficultiesBlock.addEventListener('click', (e) => difficultiesBlockListener(e));
makeDeckButton.addEventListener('click', makeDeckButtonListener);
deckTakeCard.addEventListener('click', deckTakeCardListener);
