import { loadImg } from '../auxiliary/functions';
import cardsAncients from '../data/cardsAncients';
import { ancientsBlock } from '../selectors';
import renderDifficultiesBlock from './difficulties';

const ancientCardClass = 'card';
export const ancientCardDataAttr = 'data-ancient';
const ancientCardDataAttrName = 'data-ancient-name';
const activeClass = 'active';

const createAncientCard = async (id, name, cardFace, activeAncient) => {
    const ancientCard = document.createElement('div');
    ancientCard.classList.add(ancientCardClass);
    ancientCard.setAttribute(ancientCardDataAttr, id);
    ancientCard.setAttribute(ancientCardDataAttrName, name);
    ancientsBlock.appendChild(ancientCard);
    await loadImg(cardFace);
    ancientCard.style.backgroundImage = `url(${cardFace})`;
    // ancientCard.classList.remove('loading');
    if (id === activeAncient) ancientCard.classList.add(activeClass);
};

export const createAncients = (ancientsData, activeAncient) => Promise.all(
    ancientsData.map(
        ({ id, name, cardFace }) => createAncientCard(id, name, cardFace, activeAncient)
    )
);

export const updateAncientsBlock = (activeAncient = null) => {
    const currentActiveEncient = ancientsBlock.querySelector('.active');
    if (currentActiveEncient) {
        currentActiveEncient.classList.remove('active');
    }
    ancientsBlock.querySelector(`[${ancientCardDataAttr}="${activeAncient}"]`).classList.add('active');
};
