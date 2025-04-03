import { render, replace, remove } from '../framework/render.js';

export default class FilmLetailsPresenter {
  #container = null;
  #changeData = null;
  #closeBtnClickHandler = null;
  #filmDetailsComponent = null;
  #escKeyDownHandler = null;
  #film = null;
  #comments = null;

  constructor(container, changeData, closeBtnClickHandler, escKeyDownHandler) {
    this.#container = container;
    this.#changeData = changeData;
    this.#closeBtnClickHandler = closeBtnClickHandler;
    this.#escKeyDownHandler = escKeyDownHandler;
  }
}
