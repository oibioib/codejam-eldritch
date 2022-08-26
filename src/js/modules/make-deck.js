import { makeDeck } from '../selectors';

export const showMakeDeck = () => {
    makeDeck.classList.add('active');
};

export const hideMakeDeck = () => {
    makeDeck.classList.remove('active');
};
