import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsExplanation, FilterType, Reason } from '../const.js';


const createNoPointsTemplate = (explanation) => `<p class="trip-events__msg">${explanation} </p>`;


export default class NoPointsView extends AbstractView {

  getExpanationForReason(reason){
    switch (reason){
      case FilterType.PAST :
        return NoPointsExplanation.PAST;
      case FilterType.PRESENT :
        return NoPointsExplanation.PRESENT;
      case FilterType.FUTURE :
        return NoPointsExplanation.FUTURE;
      case Reason.LOADING :
        return NoPointsExplanation.LOADING;
      default:
        return NoPointsExplanation.DEFAULT;
    }
    //console.log('out of case');
  }

  #reason = null;

  constructor(reason){
    super();
    this.#reason = reason;
  }

  get template() {
    //console.log('reason', this.getExpanationForReason(this.#reason));
    return createNoPointsTemplate(this.getExpanationForReason(this.#reason));
  }
}
