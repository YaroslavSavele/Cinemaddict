import { generateComments } from '../mock/comment.js';

export default class CommentsModel {
  #filmsModel = null;
  #films = [];
  #comments = [];

  constructor(filmsModel) {
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
}
