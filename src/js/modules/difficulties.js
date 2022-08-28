import { difficultiesBlock } from '../selectors';

export const difficulties = [
    {
        id: 'super-easy',
        name: 'Очень лёгкий',
        select: ['easy']
    },
    {
        id: 'easy',
        name: 'Легкий',
        select: ['easy', 'normal']
    },
    {
        id: 'normal',
        name: 'Средний',
        select: ['easy', 'normal', 'hard']
    },
    {
        id: 'hard',
        name: 'Сложный',
        select: ['normal', 'hard']
    },
    {
        id: 'super-hard',
        name: 'Очень сложный',
        select: ['hard']
    }
];

const activeClass = 'active';

export const difficultieDataAttr = 'data-difficultie';

const createDifficultieButton = (id, name, activeDifficulty) => {
    const difficultieButton = document.createElement('button');
    difficultieButton.classList.add('button');
    if (id === activeDifficulty) difficultieButton.classList.add(activeClass);
    difficultieButton.textContent = name;
    difficultieButton.setAttribute(difficultieDataAttr, id);
    return difficultieButton;
};

const createDifficultiesButtons = (selector, difficultiesData, activeDifficulty) => {
    const diffs = [];
    difficultiesData.forEach(({ id, name }) => {
        diffs.push(createDifficultieButton(id, name, activeDifficulty));
    });
    selector.replaceChildren(...diffs);
};

const renderDifficultiesBlock = (activeDifficulty = null) => {
    createDifficultiesButtons(difficultiesBlock, difficulties, activeDifficulty);
};

export default renderDifficultiesBlock;
