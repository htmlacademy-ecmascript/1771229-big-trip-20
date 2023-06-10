import AbstractView from '../framework/view/abstract-view.js';

const createNoPointsTemplate = (explanation) => `<p class="trip-events__msg">' ${explanation}, '</p>`;

export default class NoPointsView extends AbstractView {

  get template() {
    return createNoPointsTemplate();
  }
}
