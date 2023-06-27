import {UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class PointPresenter {
  #pointListComponent = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #offersList = null;
  #changeData = null;
  #changeMode = null;
  #isInEditMode = false;

  #destinationsList = null;

  constructor(pointListComponent, changeData, changeMode){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;


  }

  init = (point, offers, destinations) => {
    this.#point = point;

    this.#offersList = [...offers];
    this.#destinationsList = [...destinations];

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;


    this.#pointComponent = new PointView(point, this.#offersList, this.#destinationsList);
    this.#pointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickStandard);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editPointComponent = new EditPointView(point, this.#offersList, this.#destinationsList);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickEdit);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);


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
    this.#editPointComponent.reset(this.#point);
    this.#replaceEditWithStandard();
  };

  #handleFavoriteClick = () => {
    const update = {...this.#point, isFavorite: !this.#point.isFavorite};
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      update,
    );

  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormReset = (point) => {
    this.#changeData(
      UserAction.DELETE,
      UpdateType.MINOR,
      point,
    );

  };

  reset = (point) => {
    this.updateElement(
      EditPointView.parse(point),
    );
  };

  setSaving() {
    if (this.#isInEditMode) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#isInEditMode) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (!this.#isInEditMode) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }
}
