import { render } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPersenter {
  #container = null;
  #changeData = null;
  #clickCardHandler = null;
  #escKeyDownHandler = null;
  #filmCardComponent = null;
  #film = null;

  constructor(container, changeData, clickCardHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#clickCardHandler = clickCardHandler;
  }

  init = (film) => {
    this.#film = film;
    this.#filmCardComponent = new FilmCardView(film);
    this.#filmCardComponent.setFilmClickHandler(() => this.#clickCardHandler(film));
    this.#filmCardComponent.setWatchListClickHandler(this.#watchListBtnClickHandler);

    render(this.#filmCardComponent, this.#container.element);
  };

  destroy = () => { };

  #watchListBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist
      },
    });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched
      },
    });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData({
      ...this.#film,
      userDetails: {
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite
      },
    });
  };
}
