import {
  generateOffers
} from '../mock/generate-offers.js';

export default class OffersModel {
  #offers = generateOffers();
  get offers() { return this.#offers;}
}
