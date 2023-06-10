import {render} from '../render.js';
import FilterView from '../view/filter-view.js';
import {FilterType, UpdateType, UserAction} from '../const.js';
export default class FiltersPresenter {

  #filterContainer = null;
  #filterComponent = null;
  #currentFilterType = FilterType.DEFAULT;

  init = (filterContainer) => {
    this.#filterContainer = filterContainer;
    render(new FilterView(), this.#filterContainer);
  };


  #renderFilter = () => {
    this.#filterComponent = new FilterView(this.#currentFilterType);
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange);

    render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
  };

  #handleFilterChange = (filterType) => {
    console.log(this.#currentFilterType, filterType);
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#currentFilterType = (filterType);
    //this.#clearPointsList({resetRenderedTaskCount: true});
    //this.#renderAllPoints(this.points);
  };
}
