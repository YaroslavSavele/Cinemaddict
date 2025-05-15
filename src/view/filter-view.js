import AbstractView from '../framework/view/abstract-view.js';
import { filterItemsTemplate } from './filter-items-template.js';
const createFilterTemplate = (filters, currentFilter) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${currentFilter === 'All' ? 'main-navigation__item--active' : ''}" data-filter-type="All">All movies</a>
    ${filterItemsTemplate(filters, currentFilter)}
  </nav>`
);

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    //console.log(evt.target.dataset.filterType)
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
