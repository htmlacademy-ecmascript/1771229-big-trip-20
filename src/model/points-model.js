import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #offersByType = [];
  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }


  async init() {
    try {
      this.#points = await this.#pointsApiService.points;
      this.#offersByType = await this.#pointsApiService.offers;
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#points = [];
      throw new Error('Failed initialization');
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update inexisting point');
    }

    console.log('updatePoint', updateType, update);
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      console.log('response', response)
      const updatedPoint = response;
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      console.log()
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

      this._notify(updateType, update);
    } catch(err){
      //console.log(updateType, update);
      throw new Error('Can\'t delete point');
    }
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offersByType;
  }

  get destinations() {
    return this.#destinations;
  }


}
