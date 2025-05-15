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

  //static parseStateToFilm = (state) => {
  //  const film = { ...state };

  //};

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

  setDeleteCommentClickHandler = (callbak) => {
    this._callback.commentDeleteClick = callbak;
    const buttonsDelete = this.element.querySelectorAll('.film-details__comment-delete');
    buttonsDelete.forEach((button) => button.addEventListener('click', this.#commentDeleteClickHandler));
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const deletedCommentId = evt.target.dataset.commentId;
    const scrollPosition = this.element.scrollTop;

    this._callback.commentDeleteClick(deletedCommentId, scrollPosition);

  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-label')
      .forEach((element) => {
        element.addEventListener('click', this.#emotionClickHandler);
      });

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
  };

  #commentInputChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({ comment: evt.target.value });
  };

  setCommentData = () => {

    const viewData = {
      emotion: this._state.checkedEmotion,
      comment: this._state.comment,
      scrollPosition: this.element.scrollTop
    };

    return viewData;

  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseBtnClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentClickHandler(this._callback.commentDeleteClick);
    this.setCommentData();
  };

}
