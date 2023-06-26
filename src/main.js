import { render, RenderPosition } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

import NewButtonView from './view/new-button-view.js';
const buttonContainer = document.querySelector('.trip-main');
document.querySelector('.trip-main');
const AUTHORIZATION = 'Basic shmasikORIGINALA';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({pointsApiService});
const filterModel = new FilterModel();

pointsModel.init();

const pointListPresenter = new PointListPresenter({pointsModel, filterModel, handleNewPointFormClose});


pointListPresenter.init(pointListContainer);
const filterPresenter = new FilterPresenter({filterContainer, filterModel, pointsModel, pointListPresenter});
filterPresenter.init(filterContainer);


const newButtonComponent = new NewButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  pointListPresenter.createPoint();
  newButtonComponent.element.disabled = true;
}

render(newButtonComponent, buttonContainer, RenderPosition.BEFOREEND);
