import { logBlock } from '../selectors';

export const showLog = () => {
    logBlock.classList.add('active');
};

export const hideLog = () => {
    logBlock.classList.remove('active');
};

export const logCard = (currentCard) => {
    showLog();
    const log = document.createElement('div');
    log.classList.add(currentCard.color);
    log.textContent = `${currentCard.id}.${currentCard.difficulty}`;
    logBlock.appendChild(log);
};

export const clearLog = () => {
    logBlock.textContent = '';
    hideLog();
};
