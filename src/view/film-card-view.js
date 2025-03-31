import AbstractView from '../framework/view/abstract-view.js';
import { filmCardControlsTemplate } from './film-card-controls-template.js';
import { filmCardInfoTemplate } from './film-card-info-template.js';

const createFilmCardTemplate = (film) => {
  const { comments, filmInfo, userDetails } = film;

  return (
    `<article class="film-card">
    ${filmCardInfoTemplate(filmInfo, comments.length)}
    ${filmCardControlsTemplate(userDetails)}
    </article>`);
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setFilmClickHandler = (callback) => {
    this._callback.click = callback;
    const link = this.element.querySelector('a');
    link.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
