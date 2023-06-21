import {render} from '../render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType} from '../const.js';
import { replace } from '../framework/render.js';


export default class FilterPresenter {

  #filterContainer = null;
  #filterComponent = null;
  #currentFilterType = FilterType.EVERYTHING;

  #filterModel = null;
  #pointsModel = null;


  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  #handleModelPoint = () => {
    this.init();
  };


  init = () => {

    const prevFilterComponent = this.#filterComponent;


    this.#filterComponent = new FilterView(this.#filterModel.filter);
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
