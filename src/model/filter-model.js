import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (uptateType, filter) => {
    this.#filter = filter;
    this._notify(uptateType, filter);
  };
}
