import {UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

import PointsModel from '../model/points-model.js';

//import DestinationsModel from '../model/destinations-model.js';
export default class PointPresenter {
  #pointListComponent = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  //#pointListContainer = null;
  #offersList = null;
  //#offersModel = new OffersModel();
  //#destinationsModel = new DestinationsModel();
  #pointsModel = new PointsModel;
  #changeData = null;

  #changeMode = null;
  #isInEditMode = false;
  //#isNew = null;
  #destinationsList = null;

  constructor(pointListComponent, changeData, changeMode){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    //this.#isNew = isNew;
    //console.log('point presenter', pointListComponent, changeData, changeMode);

  }

  init = (point) => {
    this.#point = point;
    this.#offersList = [...this.#pointsModel.offers];
    this.#destinationsList = [...this.#pointsModel.destinations];

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;


    this.#pointComponent = new PointView(point, this.#offersList, this.#destinationsList);
    console.log ('pointcomponent in point view', point, this.#offersList, this.#destinationsList);

    this.#editPointComponent = new EditPointView(point, this.#offersList, this.#destinationsList);
    this.#pointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickStandard);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickEdit);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);

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

    //remove(prevPointComponent);
    //remove(prevEditPointComponent);

    //render(this.#pointComponent, this.#pointListComponent);
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
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#isInEditMode = true;
  };

  #replaceEditWithStandard = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#isInEditMode = false;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#replaceEditWithStandard();
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
      // eslint-disable-next-line camelcase
      {...this.#point, is_favorite: !this.#point.is_favorite},
    );

  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MAJOR,
      point,
    );
    this.#replaceEditWithStandard();
  };

  #handleFormReset = (point) => {
    this.#changeData(
      UserAction.DELETE,
      UpdateType.MAJOR,
      point,
    );
    this.#replaceEditWithStandard();
  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parse(point),
    );
  };

}
