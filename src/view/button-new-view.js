import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createButtonTemplate = (isDisabled) =>
  `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;

export default class ButtonView extends AbstractStatefulView {
  isDisabled = false;


  //#buttonClickHandler = null;

  constructor(isDisabled) {
    super();
    this.#buttonClickHandler = buttonClickHandler;
    this.#setButtonClickHandler();
  }

  get template() {
    return createAddButtonTemplate(this.#isDisabled);
  }


  #setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
    this._callback.buttonClick(evt.target.value);
  };
}
