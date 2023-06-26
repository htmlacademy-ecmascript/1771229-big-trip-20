import FilterPresenter from './presenter/filter-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api-service.js';

const AUTHORIZATION = 'Basic shmasikORIGINALA';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({pointsApiService});
const filterModel = new FilterModel();

pointsModel.init();

const pointListPresenter = new PointListPresenter({pointsModel, filterModel});

pointListPresenter.init(pointListContainer);
const filterPresenter = new FilterPresenter({filterContainer, filterModel, pointsModel, pointListPresenter});
filterPresenter.init(filterContainer);


