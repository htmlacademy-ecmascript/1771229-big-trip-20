import {render} from '../render.js';
import FiltersView from '../view/filters-view.js';

export default class FiltersPresenter {
  init = (filtersContainer) => {
    this.filtersContainer = filtersContainer;
    render(new FiltersView(), this.filtersContainer);
  };
}
