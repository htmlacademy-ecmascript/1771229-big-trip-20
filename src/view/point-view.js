import AbstractView from '../framework/view/abstract-view.js';
import { getTimeFromIso, getDurationFromIso, getDateFromIso } from '../dayjs-custom.js';

const getOffersOfType = (offersByType, pointType) => {
  for (const offersOfType of offersByType){
    if (offersOfType.type === pointType){
      return offersOfType.offers;
    }
  }
};

const createOfferListItem = (offer) => {
  const {id ,title, price} = offer;
  return `
     <li class="event__offer" id=${id}>
     <span class="event__offer-title">${title}</span>
     &plus;&euro;&nbsp;
     <span class="event__offer-price">${price}</span>
   </li>
     `;
};

const createOffersOfPointList = (offersOfType, offersOfPoint) => {

  let offersOfPointList ='';
  for (const offerOfType of offersOfType) {
    for (const offerOfPoint of offersOfPoint) {
      if (offerOfType.id === offerOfPoint) {
        offersOfPointList = `${offersOfPointList}${createOfferListItem(offerOfType)}`;
      }
    }
  }
  return offersOfPointList;
};


const createPointTemplate = (point, offersByType) => {
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, is_favorite:isFavorite, offers, type} = point;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const timeFrom = getTimeFromIso(dateFrom);
  const timeTo = getTimeFromIso(dateTo);
  const offersOfType = getOffersOfType(offersByType, type);
  const offersList = createOffersOfPointList(offersOfType, offers);
  const duration = getDurationFromIso(dateFrom, dateTo);

  return(`
<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateFrom}date">${getDateFromIso(dateFrom)}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">


  ${offersList}



  </ul>
  <button class="event__favorite-btn ${favoriteClass}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>
`);};

export default class PointView extends AbstractView {

  constructor(point, offers){
    super();
    this.point = point;
    this.offers = offers;
  }

  get template() {
    return createPointTemplate(this.point, this.offers);
  }

  setRollupButtonClickHandler = (callback) =>{
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };


  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    //console.log('favhandler');
  };


}
