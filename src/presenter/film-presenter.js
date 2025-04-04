import { render, replace, remove } from '../framework/render.js';
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

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setFilmClickHandler(() => this.#clickCardHandler(film));
    this.#filmCardComponent.setWatchListClickHandler(this.#watchListBtnClickHandler);
    this.#filmCardComponent.setWatchedClickHandler(this.#watchedBtnClickHandler);
    this.#filmCardComponent.setFavoriteClickHandler(this.#favoriteBtnClickHandler);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#container.element);
      return;
    }

    if (this.#container.element.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

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
