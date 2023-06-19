import {UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

import OffersModel from '../model/offers-model.js';

import DestinationsModel from '../model/destinations-model.js';
export default class PointPresenter {
  #pointListComponent = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  //#pointListContainer = null;
  #offersList = null;
  #offersModel = new OffersModel();
  #changeData = null;

  #changeMode = null;
  #isInEditMode = false;

  #destinationsList = null;
  #destinationsModel = new DestinationsModel();
  constructor(pointListComponent, changeData, changeMode){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;


  }

  init = (point) => {
    this.#point = point;
    this.#offersList = [...this.#offersModel.offers];
    this.#destinationsList = [...this.#destinationsModel.destinations];

    const prevEditPointComponent = this.#editPointComponent;


    this.#editPointComponent = new EditPointView(point, this.#offersList, this.#destinationsList, true);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);


    //переиспользование
    if (prevEditPointComponent === null) {
      render(this.#editPointComponent, this.#pointListComponent);
      return;
    }

    if (this.#isInEditMode) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#isInEditMode) {
      this.#editPointComponent.reset(this.#point);
    }

  };

  #replaceStandardWithEdit = () => {
    this.#changeMode();
    replace(this.#editPointComponent, this.#pointComponent);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isInEditMode = true;
  };


  #removeEditPoint = () => {
    remove(this.#pointComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      remove(this.#pointComponent);
    }
  };


  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MAJOR,
      point,
    );
    //this.#replaceEditWithStandard();
  };

  #handleFormReset = (point) => {
    this.#changeData(
      UserAction.DELETE,
      UpdateType.MAJOR,
      point,
    );
    //this.#replaceEditWithStandard();
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parse(point),
    );
  };

}
