import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createButtonTemplate = (isDisabled) =>
  `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" ${isDisabled === true ? 'disabled' : ''}>New event</button>`;

export default class ButtonNewView extends AbstractStatefulView {
  isDisabled = false;


  #buttonNewClickHandler = null;

  constructor(buttonNewClickHandler) {
    super();
    this.#buttonNewClickHandler = buttonNewClickHandler;
    this.#addListeners();
  }

  get template() {
    return createAddButtonTemplate(this._state);
  }

  _restoreHandlers() {
    this.#addListeners();
  }

  #setButtonNewClickHandler() {
    this.element.addEventListener('click', this.#buttonNewClickHandler);
  }

  #buttonNewClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAddClick();
  };
}
