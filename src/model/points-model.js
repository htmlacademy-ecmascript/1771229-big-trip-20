import Observable from '../framework/observable.js';
import {
  generatePoints
} from '../mock/generate-point.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points);
    });
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map();
      console.log('initmodel', points, this.#points);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update inexisting point');
    }


    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = response;
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {


    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = response;
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }


    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete inexisting point');
    }

    try {

      await this.#pointsApiService.deleteTask(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch(err){
      throw new Error('Can\'t delete task');
    }
  }


}
