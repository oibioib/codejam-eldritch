import cardsAncients from '../data/cardsAncients';
import cardsGreen from '../data/cardsGreen';
import cardsBrown from '../data/cardsBrown';
import cardsBlue from '../data/cardsBlue';
import { difficulties } from './difficulties';
import { cardsBlock, deckBlock, deckCurrentCard, deckTakeCard } from '../selectors';
import { getRandomNums, loadImg } from '../auxiliary/functions';

const cardsStageClass = 'cards__stage';
const cardsStageTitleClass = 'cards__stage-title';
const cardsStageCardsClass = 'cards__stage-cards';
const cardsStageCardClass = 'cards__stage-card';

const cardsColors = {
    green: cardsGreen,
    brown: cardsBrown,
    blue: cardsBlue
};

export const getAncientData = (ancientId) => cardsAncients.filter(({ id }) => id === ancientId)[0];
const getDifficultyData = (difficultyId) => difficulties.filter(
    ({ id }) => id === difficultyId
)[0].select;

const createStage = (stageData, stageNum) => {
    const stage = document.createElement('div');
    stage.classList.add(cardsStageClass);

    const stageTitle = document.createElement('span');
    stageTitle.classList.add(cardsStageTitleClass);
    const stageTitles = ['Первая', 'Вторая', 'Третья'];
    stageTitle.textContent = `${stageTitles[stageNum]} стадия`;
    const { green, brown, blue } = stageData;
    const cardsInStage = [green, brown, blue].reduce((acc, cur) => acc + cur, 0);
    if (!cardsInStage) stageTitle.classList.add('desaturate');

    const stageCards = document.createElement('div');
    stageCards.classList.add(cardsStageCardsClass);
    [green, brown, blue].forEach((card, index) => {
        const colors = ['green', 'brown', 'blue'];
        const div = document.createElement('div');
        div.classList.add(cardsStageCardClass);
        div.classList.add(colors[index]);
        div.textContent = card;
        if (!card) {
            div.classList.add('empty');
        }
        stageCards.appendChild(div);
    });

    stage.appendChild(stageTitle);
    stage.appendChild(stageCards);
    return stage;
};

const createCardsBlock = (ancientData) => {
    const stages = [];
    const { firstStage, secondStage, thirdStage } = ancientData;
    [firstStage, secondStage, thirdStage].forEach((stage, index) => {
        stages.push(createStage(stage, index));
    });
    return stages;
};

const countAncientCardsColors = (ancientData) => {
    const colors = {
        green: 0,
        brown: 0,
        blue: 0
    };
    const { firstStage, secondStage, thirdStage } = ancientData;
    [firstStage, secondStage, thirdStage].forEach((stage) => {
        colors.green += stage.green;
        colors.brown += stage.brown;
        colors.blue += stage.blue;
    });
    return colors;
};

const selectAllCardsByColorAndDifficultie = (color, difficultie) => cardsColors[color]
    .filter((card) => card.difficulty === difficultie);

const selectAllCardsByColorAndAllDifficulties = (color, quantity, diffData) => {
    let cards = [];

    diffData.forEach((difficultie) => {
        const selectedCards = selectAllCardsByColorAndDifficultie(color, difficultie);
        cards = [...cards, ...selectedCards];
    });

    const { length } = cards;

    if (quantity < length) {
        const randoms = getRandomNums(0, length, quantity);
        return cards.filter((_, index) => randoms.includes(index));
    }

    if (quantity > length) {
        const additionalCards = selectAllCardsByColorAndDifficultie(color, 'normal');
        const additionalRandoms = getRandomNums(0, additionalCards.length, quantity - length);
        additionalRandoms.forEach((random) => {
            cards.push(additionalCards[random]);
        });
    }

    return cards;
};

const selectAllCardsForDeck = (colors, diffData) => {
    let cards = [];
    Object.entries(colors)
        .forEach(([color, quantity]) => {
            cards = [
                ...cards,
                ...selectAllCardsByColorAndAllDifficulties(color, quantity, diffData)
            ];
        });
    return cards;
};

export const selectAllCardsForDeckHandler = (ancientId, difficultyId) => selectAllCardsForDeck(
    countAncientCardsColors(getAncientData(ancientId)),
    getDifficultyData(difficultyId)
);

const renderCardsBlock = (ancientId) => {
    cardsBlock.replaceChildren(...createCardsBlock(getAncientData(ancientId)));
};

export const updateCardsBlock = (blockData) => {
    cardsBlock.replaceChildren(...createCardsBlock(blockData));
};

const clearCardsBlock = () => {
    cardsBlock.textContent = '';
};

export const renderCurrentCard = async (imageSrc, color) => {
    deckCurrentCard.classList.add('loading_with-background');
    await loadImg(imageSrc);
    deckCurrentCard.classList.remove('loading_with-background', 'green', 'brown', 'blue');
    deckCurrentCard.style.backgroundImage = `url(${imageSrc})`;
    deckCurrentCard.classList.add(color);
};

export const showDeck = (ancientId, difficultyId) => {
    deckBlock.classList.add('active');
    clearCardsBlock();
    renderCardsBlock(ancientId, difficultyId);
    deckTakeCard.classList.add('active');
};

export const hideDeck = () => {
    deckBlock.classList.remove('active');
    clearCardsBlock();
    deckCurrentCard.style.backgroundImage = 'none';
    deckCurrentCard.classList.remove('green', 'brown', 'blue');
};
