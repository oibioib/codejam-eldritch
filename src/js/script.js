// CSS
import '../css/style.scss';

// Selectors
import { ancientsBlock, difficultiesBlock, makeDeckButton } from './selectors';

// Imports
import createAncientsHandler, { ancientCardDataAttr } from './modules/ancients';
import createDifficultiesButtonsHandler, { difficultieDataAttr } from './modules/difficulties';
import { hideCardsBlock, showCardsBlock } from './modules/cards';
import { hideMakeDeck, showMakeDeck } from './modules/make-deck';

let ancientChoosen = false;
let difficultieChoosen = false;

createAncientsHandler();
createDifficultiesButtonsHandler();

const checkProps = () => ancientChoosen && difficultieChoosen && true;

ancientsBlock.addEventListener('click', (e) => {
    const attr = e.target.getAttribute(ancientCardDataAttr);
    if (attr) {
        ancientChoosen = attr;
        createAncientsHandler(attr);
        hideCardsBlock();
        if (checkProps()) {
            showMakeDeck();
        }
    }
    console.log(ancientChoosen);
});

difficultiesBlock.addEventListener('click', (e) => {
    const attr = e.target.getAttribute(difficultieDataAttr);
    if (attr) {
        difficultieChoosen = attr;
        createDifficultiesButtonsHandler(attr);
        hideCardsBlock();
        if (checkProps()) {
            showMakeDeck();
        }
    }
    console.log(difficultieChoosen);
});

makeDeckButton.addEventListener('click', () => {
    hideMakeDeck();
    showCardsBlock(ancientChoosen, difficultieChoosen);
});
