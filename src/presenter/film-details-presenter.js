import { render, replace, remove } from '../framework/render.js';
import FilmDetailsView from '../view/film-details-view.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class FilmDetailsPresenter {
  #container = null;
  #changeData = null;
  #closeBtnClickHandler = null;
  #filmDetailsComponent = null;
  #escKeyDownHandler = null;
  #ctrlEnterDownHandler = null;
  #film = null;
  #comments = null;
  #viewData = {};
  #commentsModel = null;

  constructor(container, changeData, closeBtnClickHandler, escKeyDownHandler, ctrlEnterDownHandler, commentsModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeBtnClickHandler = closeBtnClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
    this.#ctrlEnterDownHandler = ctrlEnterDownHandler;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  init = (film) => {
    this.#film = film;
    this.#comments = [...this.#commentsModel.get(this.#film)];

    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmDetailsComponent = new FilmDetailsView(this.#film, this.#comments);

    this.#filmDetailsComponent.setCloseBtnClickHandler(() => {
      this.#closeBtnClickHandler();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      document.removeEventListener('keydown', this.#ctrlEnterDownHandler);
    });

    this.#filmDetailsComponent.setWatchListClickHandler(this.#watchListBtnClickHandler);
    this.#filmDetailsComponent.setWatchedClickHandler(this.#watchedBtnClickHandler);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#favoriteBtnClickHandler);
    this.#filmDetailsComponent.setDeleteCommentClickHandler(this.#commentDeleteClickHandler);

    if (prevFilmDetailsComponent === null) {
      render(this.#filmDetailsComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevFilmDetailsComponent.element)) {

      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
      if (film.scrollPosition) {
        this.#filmDetailsComponent.element.scrollTo(0, film.scrollPosition);
      }
    }

    remove(prevFilmDetailsComponent);
  };

  destroy = () => {
    remove(this.#filmDetailsComponent);
  };

  #watchListBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
      });
  };

  #watchedBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        },
      });
  };

  #favoriteBtnClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        },
      });
  };

  #commentDeleteClickHandler = (commentId, scrollPosition) => {
    const filmCommentIdIndex = this.#film.comments.findIndex((filmCommentId) => filmCommentId === commentId);
    const deletedComment = this.#comments.find((comment) => comment.id === commentId);
    this.#film.comments = [
      ...this.#film.comments.slice(0, filmCommentIdIndex),
      ...this.#film.comments.slice(filmCommentIdIndex + 1)
    ];

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#film,
        //comments: [
        //  ...this.#film.comments.slice(0, filmCommentIdIndex),
        //  ...this.#film.comments.slice(filmCommentIdIndex + 1)
        //],
        deletedComment,
        scrollPosition
      },
    );
  };

  createComment = () => {
    this.#viewData = this.#filmDetailsComponent.setCommentData();

    const { emotion, comment, scrollPosition } = this.#viewData;

    if (emotion && comment) {
      const newCommentId = nanoid();

      const createdComment = {
        id: newCommentId,
        autor: 'Olof',
        date: new Date(),
        emotion,
        comment
      };

      this.#film.comments.push(newCommentId);
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          ...this.#film,
          //comments: [
          //  ...this.#film.comments,
          //  newCommentId
          //],
          createdComment,
          scrollPosition
        }
      );
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(data);
        break;
    }
  };
}
