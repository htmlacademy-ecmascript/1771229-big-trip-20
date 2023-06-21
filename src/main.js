//import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api-service.js';

const AUTHORIZATION = 'Basic uniqueandORIGINALAUTHKEY';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const pointListPresenter = new PointListPresenter({pointsModel, filterModel, pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
const filterPresenter = new FilterPresenter({filterContainer, filterModel, pointsModel});

pointListPresenter.init(pointListContainer);
filterPresenter.init(filterContainer);

