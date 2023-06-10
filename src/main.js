//import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');


const pointListPresenter = new PointListPresenter();
const filterPresenter = new FilterPresenter();

pointListPresenter.init(pointListContainer);
filterPresenter.init(filtersContainer);
