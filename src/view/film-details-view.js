import AbstractView from '../framework/view/abstract-view.js';
import { createFilmDetailsFormTemplate } from './film-details-form-template.js';

const createFilmDetailsTemplate = (film, comments) => (
  `<section class="film-details">
  ${createFilmDetailsFormTemplate(film, comments)}
  </section>`
);

export default class FilmDetailsView extends AbstractView {
  #film = null;
  #comments = [];

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film, this.#comments);
  }

  setButtonCloseClickHandler = (callback) => {
    this._callback.click = callback;
    const closeButton = this.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
