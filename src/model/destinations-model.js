import {
  getDestinations
} from '../mock/destinations.js';

export default class DestinationsModel {

  #destinations = getDestinations();
  get destinations() {
    return this.#destinations;}
}
