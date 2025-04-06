import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (activeSortType) => (
  `<ul class="sort">
    <li>
      <a
        href="#"
        class="sort__button ${(activeSortType === SortType.DEFAULT) ? 'sort__button--active' : ''}"
        data-sotr-type="${SortType.DEFAULT}"
      >
        Sort by default
      </a>
    </li>
    <li>
      <a
        href="#"
        class="sort__button ${(activeSortType === SortType.DATE) ? 'sort__button--active' : ''}"
        data-sotr-type="${SortType.DATE}"
      >
        Sort by date
      </a>
    </li>
    <li>
      <a
        href="#"
        class="sort__button ${(activeSortType === SortType.RATING) ? 'sort__button--active' : ''}"
        data-sotr-type="${SortType.RATING}"
      >
        Sort by rating
      </a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }
}
