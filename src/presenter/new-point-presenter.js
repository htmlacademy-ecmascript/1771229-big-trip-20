import {UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';

import OffersModel from '../model/offers-model.js';

import DestinationsModel from '../model/destinations-model.js';
export default class PointPresenter {
  #pointListComponent = null;
  //#pointComponent = null;
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

    //const prevEditPointComponent = this.#editPointComponent;


    this.#editPointComponent = new EditPointView(point, this.#offersList, this.#destinationsList, true);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);


    //переиспользование
    /*if (prevEditPointComponent === null) {
      render(this.#editPointComponent, this.#pointListComponent);
      return;
    }*/

    render(this.#editPointComponent,this.#pointListComponent);

    if (this.#isInEditMode) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }
  };

  destroy = () => {
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#isInEditMode) {
      this.#editPointComponent.reset(this.#point);
    }

  };


  #removeEditPoint = () => {
    remove(this.#editPointComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      remove(this.#editPointComponent);
    }
  };


  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD,
      UpdateType.MAJOR,
      point,
    );
    //this.#replaceEditWithStandard();
    remove(this.#editPointComponent);
  };

  #handleFormReset = (point) => {
    console.log('reset');
    //this.#replaceEditWithStandard();
    remove(this.#editPointComponent);
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parse(point),
    );
  };

}
