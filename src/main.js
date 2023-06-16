//import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const pointListPresenter = new PointListPresenter({pointsModel, filterModel});
const filterPresenter = new FilterPresenter({filtersContainer, filterModel, pointsModel});

pointListPresenter.init(pointListContainer);
filterPresenter.init(filtersContainer);

