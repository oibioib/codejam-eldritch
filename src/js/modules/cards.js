import cardsAncients from '../data/cardsAncients';
import cardsGreen from '../data/cardsGreen';
import cardsBrown from '../data/cardsBrown';
import cardsBlue from '../data/cardsBlue';
import { difficulties } from './difficulties';
import { cardsBlock } from '../selectors';
import { getRandomNums } from '../auxiliary/functions';

const cardsStageClass = 'cards__stage';
const cardsStageTitleClass = 'cards__stage-title';
const cardsStageCardsClass = 'cards__stage-cards';
const cardsStageCardClass = 'cards__stage-card';

const cardsColors = {
    green: cardsGreen,
    brown: cardsBrown,
    blue: cardsBlue
};

const createStage = (stageData, stageNum) => {
    const stage = document.createElement('div');
    stage.classList.add(cardsStageClass);

    const stageTitle = document.createElement('span');
    stageTitle.classList.add(cardsStageTitleClass);
    const stageTitles = ['Первая', 'Вторая', 'Третья'];
    stageTitle.textContent = `${stageTitles[stageNum]} стадия`;

    const stageCards = document.createElement('div');
    stageCards.classList.add(cardsStageCardsClass);

    const { greenCards, brownCards, blueCards } = stageData;
    [greenCards, brownCards, blueCards].forEach((card, index) => {
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
        colors.green += stage.greenCards;
        colors.brown += stage.brownCards;
        colors.blue += stage.blueCards;
    });
    return colors;
};

// eslint-disable-next-line max-len
const selectAllCardsByColorAndDifficultie = (color, difficultie) => cardsColors[color].filter((card) => card.difficulty === difficultie);

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

const selectCards = (colors, diffData) => {
    let cards = [];

    Object.entries(colors).forEach(([color, quantity]) => {
        cards = [...cards, ...selectAllCardsByColorAndAllDifficulties(color, quantity, diffData)];
    });

    return cards;
};

const getAncientData = (ancientId) => cardsAncients.filter(({ id }) => id === ancientId)[0];
// eslint-disable-next-line max-len
const getDifficultyData = (difficultyId) => difficulties.filter(({ id }) => id === difficultyId)[0].select;

const createCardsBlockHandler = (ancientId, difficultyId) => {
    cardsBlock.replaceChildren(...createCardsBlock(getAncientData(ancientId)));
    console.log(countAncientCardsColors(getAncientData(ancientId)));
    console.log(getDifficultyData(difficultyId));
    // eslint-disable-next-line max-len
    console.log(selectCards(countAncientCardsColors(getAncientData(ancientId)), getDifficultyData(difficultyId)));
};

export const showCardsBlock = (ancientId, difficultyId) => {
    cardsBlock.classList.add('active');
    createCardsBlockHandler(ancientId, difficultyId);
};

export const hideCardsBlock = () => {
    cardsBlock.classList.remove('active');
    cardsBlock.textContent = '';
};


export default createCardsBlockHandler;
