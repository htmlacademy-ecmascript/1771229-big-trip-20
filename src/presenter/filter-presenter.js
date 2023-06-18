import {render, RenderPosition} from '../render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType, UserAction} from '../const.js';
//import { filterPoints } from '../dayjs-custom.js';
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
    // перерендер фильтров
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    console.log('trouble',this.#filterModel);
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    // фильтрация
    //this.#clearPointsList({resetRenderedTaskCount: true});
    //this.#renderAllPoints(this.points);
  };
}
