import {render, RenderPosition} from '../render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType, UserAction} from '../const.js';
import { filterPoints } from '../dayjs-custom.js';


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


  init = (filterContainer) => {
    this.#filterContainer = filterContainer;
    this.#renderFilter();

    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    // новое
    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    // перерендер фильтров
  };


  #renderFilter = () => {
    console.log('renderfilter', this.#currentFilterType)
    this.#filterComponent = new FilterView(this.#currentFilterType);
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange);

    render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
  };

  #handleFilterChange = (filterType) => {
    console.log(this.#currentFilterType, filterType);
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    // фильтрация
    //this.#clearPointsList({resetRenderedTaskCount: true});
    //this.#renderAllPoints(this.points);
  };
}
