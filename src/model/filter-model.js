import { FilterType, UpdateType } from '../const';
import Observable from '../framework/observable';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setfilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(UpdateType, filter);
  };
}
