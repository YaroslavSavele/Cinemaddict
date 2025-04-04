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

  setCloseBtnClickHandler = (callback) => {
    this._callback.click = callback;
    const closeButton = this.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
