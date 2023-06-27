import {render, RenderPosition, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import {SortType, UpdateType, UserAction, Reason, FilterType, DEFAULT_POINT_DATA} from '../const.js';
import { sortByDay, sortByPrice, sortByTime, filterPoints} from '../dayjs-custom.js';

export default class PointListPresenter {

  #pointListComponent = new PointListView();
  #pointListContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #currentSortType = SortType.DEFAULT;
  #pointPresenter = new Map();
  #loadingComponent = new NoPointsView(Reason.LOADING);
  #isLoading = true;
  #sortComponent = null;
  #noPointsView = null;
  #newPointPresenter = null;


  constructor(pointsModel, filterModel, onNewPointDestroy){

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    console.log('plp cons', onNewPointDestroy);
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });
  }

  #newPointData = (data) => {
    const newPoint = {
      ...data,
      'destination': this.#pointsModel.destinations[0].id,
      'type': this.#pointsModel.offers[0].type
    };
    return newPoint;
  };

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    const point = this.#newPointData(DEFAULT_POINT_DATA);
    this.#newPointPresenter.init(point,
      this.#pointsModel.offers,
      this.#pointsModel.destinations);
    this.#renderSort(this.#currentSortType);
  }


  get points() {
    let sortedPoints = [];
    switch (this.#currentSortType) {
      case SortType.DAY:
        sortedPoints = [...this.#pointsModel.points].sort(sortByDay);
        break;
      case SortType.TIME:
        sortedPoints = [...this.#pointsModel.points].sort(sortByTime);
        break;
      case SortType.PRICE:
        sortedPoints = [...this.#pointsModel.points].sort(sortByPrice);
        break;
    }
    return sortedPoints;
  }


  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };


  #clearPointsList = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#sortComponent);
    if (this.#noPointsView) {
      remove(this.#noPointsView);
      this.#noPointsView = null;
    }
  };


  #renderSort = (newSortType) => {
    if (this.#sortComponent){
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView(newSortType);
    this.#sortComponent.setSortChangeHandler(this.handleSortChange);

    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = () => {

    render(this.#pointListComponent, this.#pointListContainer);
  };
  //----------------------------------------------------------------------

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
      return;
    }
    this.#renderSort(this.#currentSortType);
    filteredPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointListComponent.element, RenderPosition.BEFOREEND);
  }

  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;

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
        this.#pointPresenter.get(data.id).init(data, this.#pointsModel.offers, this.#pointsModel.destinations);
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
        this.#renderSort(this.#currentSortType);
        this.#renderAllPoints();
        break;
    }
  };

  handleSortChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = (sortType);
    this.#clearPointsList();
    this.#renderAllPoints(this.points);
  };

}

