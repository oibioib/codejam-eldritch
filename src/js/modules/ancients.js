import cardsAncients from '../data/cardsAncients';
import { ancientsBlock } from '../selectors';

const ancientCardClass = 'card';
export const ancientCardDataAttr = 'data-ancient';
const ancientCardDataAttrName = 'data-ancient-name';
const activeClass = 'active';

const createAncientCard = (id, name, cardFace, activeAncient) => {
    const ancientCard = document.createElement('div');
    ancientCard.classList.add(ancientCardClass);
    if (id === activeAncient) ancientCard.classList.add(activeClass);
    ancientCard.setAttribute(ancientCardDataAttr, id);
    ancientCard.setAttribute(ancientCardDataAttrName, name);
    ancientCard.style.backgroundImage = `url(${cardFace})`;
    return ancientCard;
};

const createAncients = (selector, ancientsData, activeAncient) => {
    const ancients = [];
    ancientsData.forEach(({ id, name, cardFace }) => {
        ancients.push(createAncientCard(id, name, cardFace, activeAncient));
    });
    selector.replaceChildren(...ancients);
};

const renderAncientsBlock = (activeAncient = null) => {
    createAncients(ancientsBlock, cardsAncients, activeAncient);
};

export default renderAncientsBlock;
