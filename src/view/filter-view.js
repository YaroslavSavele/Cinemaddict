import AbstractView from '../framework/view/abstract-view.js';
import { filterItemsTemplate } from './filter-items-template.js';
const createFilterTemplate = (films) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate(films)}
  </nav>`
);

export default class FilterView extends AbstractView {
  #films = [];

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilterTemplate(this.#films);
  }
}
