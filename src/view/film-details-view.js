import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { createFilmDetailsFormTemplate } from './film-details-form-template.js';

const createFilmDetailsTemplate = ({ filmInfo, userDetails, comments, isWatchlist, isAlreadyWatched, isFavorite, checkedEmotion, comment }) => (
  `<section class="film-details">
  ${createFilmDetailsFormTemplate(filmInfo, userDetails, comments, isWatchlist, isAlreadyWatched, isFavorite, checkedEmotion, comment)}
  </section>`
);

export default class FilmDetailsView extends AbstractStatefulView {
  #film = null;
  #comments = [];

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
    this._state = FilmDetailsView.parseFilmToState(film, comments);

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  static parseFilmToState = (
    film,
    comments,
    isWatchlist = film.userDetails.watchlist,
    isAlreadyWatched = film.userDetails.alreadyWatched,
    isFavorite = film.userDetails.favorite,
    comment = null,
    checkedEmotion = null,
    scrollPosition = 0
  ) => ({
    ...film,
    comments,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
    checkedEmotion,
    comment,
    scrollPosition
  });


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
    this.updateElement({
      isWatchlist: !this._state.isWatchlist,
      scrollPosition: this.element.scrollTop
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
    this.updateElement({
      isAlreadyWatched: !this._state.isAlreadyWatched,
      scrollPosition: this.element.scrollTop
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    this.updateElement({
      isFavorite: !this._state.isFavorite,
      scrollPosition: this.element.scrollTop
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-label')
      .forEach((element) => {
        element.addEventListener('click', this.#emotionClickHandler);
      });
    //this.element
    //  .querySelectorAll('.film-details__emoji-item')
    //  .forEach((element) => {
    //    element.addEventListener('click', (evt) => {
    //      console.log('hello');
    //    } );
    //  });
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputChangeHandler);
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedEmotion: evt.currentTarget.dataset.emotionType,
      scrollPosition: this.element.scrollTop
    });
    this.element.scrollTo(0, this._state.scrollPosition);
    //console.log(this._state.checkedEmotion)
  };

  #commentInputChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({ comment: evt.target.value });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

}
