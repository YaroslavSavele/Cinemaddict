import Observable from '../framework/observable.js';
import { generateComments } from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #filmsModel = null;
  #films = [];
  #comments = [];

  constructor(filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#comments = generateComments(this.#films);
  }

  get = (film) => {
    const filmComments = [];

    for (let i = 0; i < film.comments.length; i++) {
      const filmComment = this.#comments.find((comment) => comment.id === film.comments[i]);
      filmComments.push(filmComment);
    }

    return filmComments;
  };

  add = (updateType, update) => {
    this.#comments.push(update.createdComment);
    delete update.createdComment;
    this._notify(updateType, update);

    //delete update.scrollPosition;
  };

  delete = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.deletedComment.id);

    if (index === -1) {
      throw new Error('Cant\'t delete unexisting comment');
    }
    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    delete update.deletedComment;

    this._notify(updateType, update);
  };

}

