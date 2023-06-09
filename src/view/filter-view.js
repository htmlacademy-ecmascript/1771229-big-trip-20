import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFiltersTemplate = (currentFilterType) => `
<form class="trip-filters" action="#" method="get">
<div class="trip-filters__filter">
  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${(currentFilterType === FilterType.EVERYTHING || currentFilterType === undefined) ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
</div>

<div class="trip-filters__filter">
  <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilterType === FilterType.FUTURE ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-future">Future</label>
</div>

<div class="trip-filters__filter">
<input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" ${currentFilterType === FilterType.PRESENT ? 'checked' : ''}>
<label class="trip-filters__filter-label" for="filter-present">Present</label>
</div>

<div class="trip-filters__filter">
  <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${currentFilterType === FilterType.PAST ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-past">Past</label>
</div>

<button class="visually-hidden" type="submit">Accept filter</button>
</form>
`;
export default class FilterView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();

    this.#currentFilterType = currentFilterType;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#currentFilterType);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterChange(evt.target.value);
  };

}
