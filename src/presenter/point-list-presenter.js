import {render, RenderPosition, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

import PointPresenter from './point-presenter.js';
//import NewPointPresenter from './new-point-presenter.js';

import {SortType, UpdateType, UserAction, Reason} from '../const.js';
import { sortByDay, sortByPrice, sortByTime, filterPoints} from '../dayjs-custom.js';

export default class PointListPresenter {

  #pointListComponent = new PointListView();
  #pointListContainer = null;

  #pointsModel = null;
  #filterModel = null;
  #currentSortType = SortType.DEFAULT;
  #pointPresenter = new Map();

  #NewPointPresenter = null;

  #loadingComponent = new NoPointsView(Reason.LOADING);
  #isLoading = true;

  #sortComponent = null;

  #isButtonDisabled = false;
  constructor({pointsModel, filterModel}){
    //!!
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    switch (this.#currentSortType) {
      case SortType.DAY:

        return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }


  #handleModeChange = () => {

    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };


  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if (this.#noPointsView) {
      remove(this.#noPointsView);
      this.#noPointsView = null;
    }
  };


  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortChangeHandler(this.#handleSortChange);

    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = () => {

    render(this.#pointListComponent, this.#pointListContainer);
  };
  //----------------------------------------------------------------------


  #noPointsView = null;

  #renderNoPoints = (reason) => {
    this.#noPointsView = new NoPointsView(reason);
    remove(this.#loadingComponent);
    render(this.#noPointsView, this.#pointListComponent.element);

  };

  #renderAllPoints = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    const filteredPoints = filterPoints(this.#filterModel.filter, this.points);
    if (filteredPoints.length === 0){
      this.#renderNoPoints(this.#filterModel.filter);
    }
    filteredPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;

    this.#renderSort();

    this.#renderPointList();
    this.#renderAllPoints(this.points);


  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE:
        this.#pointsModel.deletePoint(updateType, update);
        break;

    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearPointsList();
        this.#renderAllPoints();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#currentSortType = (SortType.DEFAULT);
        this.#clearPointsList();
        this.#renderAllPoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderAllPoints();
        break;
    }
  };

  #handleSortChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = (sortType);
    this.#clearPointsList();
    this.#renderAllPoints(this.points);
  };

}

