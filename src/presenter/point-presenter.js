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
  #pointListContainer = null;
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
    console.log('point presenter', pointListComponent, changeData, changeMode);

  }

  init = (point) => {
    this.#point = point;
    this.#offersList = [...this.#offersModel.offers];
    this.#destinationsList = [...this.#destinationsModel.destinations];

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;


    this.#pointComponent = new PointView(point, this.#offersList);
    this.#editPointComponent = new EditPointView(point, this.#offersList, this.#destinationsList);
    this.#pointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickStandard);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickEdit);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);


    //переиспользование
    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListComponent);
      return;
    }
    if (!this.#isInEditMode) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#isInEditMode) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);

    render(this.#pointComponent, this.#pointListComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#isInEditMode) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditWithStandard();
    }

  };

  #replaceStandardWithEdit = () => {
    this.#changeMode();
    replace(this.#editPointComponent, this.#pointComponent);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isInEditMode = true;
  };

  #replaceEditWithStandard = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#isInEditMode = false;
  };

  #onEscKeyDown =  (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleRollupButtonClickStandard = () => {
    this.#replaceStandardWithEdit();
  };

  #handleRollupButtonClickEdit = () => {
    this.#replaceEditWithStandard();
  };

  #handleFavoriteClick = () => {

    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#point, is_favorite: !this.#point.is_favorite},
    );

  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      point,
    );
    this.#replaceEditWithStandard();
  };

  #handleFormReset = () => {
    this.#replaceEditWithStandard();
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parse(point),
    );
  };

}
