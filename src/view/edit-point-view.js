import {typesMap} from '../mock/types-map.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getTimeFromIso, getEditableDateFromIso } from '../dayjs-custom.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const createOfferListItem = (offer, type, isChecked) => {
  const {id, title, price} = offer;
  return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
     `;
};
const destinationOptions = (destinationsList, destinationInfoOfPoint) => {
  if (!destinationsList) {
    return '';
  }
  let optionsList = '';
  for (const destination of destinationsList){
    optionsList = `${optionsList}<option value="${destination.id}" ${destinationInfoOfPoint.id === destination.id ? 'selected' : ''}>${destination.name}</option>}`;
  }
  return optionsList;
};
const createTypeOptionsList = (typesList, chosenType) => {
  let optionsList = '';
  for (const type of typesList){
    optionsList = `${optionsList}
          <div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === chosenType ? 'checked' : ''} >
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase()}${type.slice(1)}</label>
          </div>`;
  }
  return optionsList;
};

const createOffersOfPointList = (offersOfType, offersOfPoint, type) => {
  if (!offersOfType) {
    return '';
  }
  let offersOfPointList = '';
  for (const offerOfType of offersOfType) {
    let isChecked = false;
    for (const offerOfPoint of offersOfPoint) {
      if (offerOfType.id === offerOfPoint) {
        isChecked = true;
      }

    }
    offersOfPointList = `${offersOfPointList}${createOfferListItem(offerOfType, type, isChecked)}`;
  }
  return offersOfPointList;
};

const getOffersOfType = (offersByType, pointType) => {
  for (const offersOfType of offersByType){
    if (offersOfType.type === pointType){
      return offersOfType.offers;
    }
  }
};

const getDestinationById = (destinationsList, id) => {
  for (const destination of destinationsList){
    if (id === destination.id){
      return destination;
    }
  }
  return null;
};

//-----------------------------------------------------------------------Main function--------------------------------------------------------------------------------
const createEditPointTemplate = (pointData, offersByType, destinationsList, isNew) => {


  const {basePrice, dateFrom, dateTo, destination: destinationIdData, offers, type, isSaving, isDeleting } = pointData;

  const offersOfType = getOffersOfType(offersByType, type);

  const offersOfPointList = createOffersOfPointList(offersOfType, offers, type);

  const destinationInfo = getDestinationById(destinationsList, destinationIdData);


  return (`<li class="trip-events__item">
<form class="event event--edit" action="#" method="post" ${(isSaving || isDeleting ? 'disabled' : '')}>
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${createTypeOptionsList(typesMap, type)}


        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <select class="event__input  event__input--destination" id="event-destination-1" required name="event-destination" value="${destinationInfo}">
        ${destinationOptions(destinationsList, destinationInfo)}
        </select>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getEditableDateFromIso(dateFrom)} ${getTimeFromIso(dateFrom)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getEditableDateFromIso(dateTo)} ${getTimeFromIso(dateTo)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" required type="number" name="event-price" min="1" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset">

    ${isNew ? 'Cancel' : '' }${!isNew && isDeleting ? 'Deleting...' : ''}${!isNew && !isDeleting ? 'Delete' : ''}

    </button>

    ${isNew ? '' : `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`}


  </header>
  <section class="event__details">

      ${offersOfPointList ? '<section class="event__section  event__section--offers"><h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}

      <div class="event__available-offers">



        ${offersOfPointList}


        ${offersOfPointList ? '</section>' : ''}



      ${(destinationInfo.description) ? '<section class="event__section  event__section--destination"><h3 class="event__section-title  event__section-title--destination">Destination</h3><p class="event__destination-description">' : ''}
      ${destinationInfo.description}
      ${(destinationInfo.description) ? '</p> </section>' : ''}

    </section>
  </section>
</form>
</li>
`);
};

export default class EditPointView extends AbstractStatefulView {

  #datepickerFrom = null;
  #datepickerTo = null;
  #offers = null;
  #destinations = null;
  #isNew = null;
  #isDisabled = null;
  constructor(point, offers, destinations, isNew = false, isDisabled){
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#isDisabled = isDisabled;
    this.#isNew = isNew;

    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offers, this.#destinations, this.#isNew);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupButtonClickHandler(this._callback.rollupClick);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state, this.#offers, this.#destinations));
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();

    this._callback.formReset(EditPointView.parseStateToPoint(this._state, this.#offers, this.#destinations));

  };

  setRollupButtonClickHandler = (callback) =>{
    if (this.#isNew){
      return;
    }
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #typeInputHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({ type : evt.target.value, offers: []});
  };

  #offerChangeHandler = (evt) => {
    const newState = this._state.offers;
    if(newState.includes((evt.target.id))) {
      const index = newState.indexOf((evt.target.id));
      newState.splice(index,1);
    } else {
      newState.push((evt.target.id));
    }

    this._setState({
      point: {offers: newState},
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    //console.log('ndn', evt.target.value);
    this.updateElement({
      destination: newDestinationName
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('input', this.#typeInputHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
  };

  static parsePointToState = (point) => {

    const pointInState = ({...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
    return (pointInState);
  };

  static parseStateToPoint = (state) => {
    const editForm = {...state};
    delete editForm.isSaving;
    delete editForm.isDeleting;
    delete editForm.isDisabled;
    return editForm;
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #dateFromChangeHandler = ([date]) => {

    this.updateElement({
      dateFrom: date.toISOString(),
    });
  };

  #dateToChangeHandler = ([date]) => {

    this.updateElement({

      dateTo: date.toISOString(),
    });
  };

  #setDatepickerFrom = () => {

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        maxDate: this._state.dateTo,
        dateFormat: 'j/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );

  };

  #setDatepickerTo = () => {

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        minDate: this._state.dateFrom,
        dateFormat: 'j/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };


  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({

      basePrice: evt.target.value,
    });
  };

  static parse = (parced) => ({...parced});

}

