import { render, RenderPosition } from '../framework/render.js';
import HeaderProfileView from '../view/header-profile-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListEpmtyView from '../view/film-list-empty-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import { updateItem } from '../utils/common.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import FooterStatisticsView from '../view/footer-statistics-view.js';
import { FILM_COUNT_PER_STEP } from '../mock/const.js';
import FilmPersenter from './film-presenter.js';

export default class FilmsPresenter {
  #headerProfileComponent = null;
  #filterComponent = null;
  #sortComponent = new SortView();
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = new FilmButtonMoreView();
  #footerStatisticsComponent = null;
  #header = null;
  #container = null;
  #footerStatistics = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];
  #filmDetailsComponent = null;
  #filmPresenter = new Map();

  #renderFilm(film, container) {
    const filmPresenter = new FilmPersenter(
      container,
      this.#filmCangeHandler,
      this.#filmClickHandler
    );

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #filmClickHandler = (film) => {
    this.#addFilmDetailsComponent(film);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #renderFilmDetails(film) {
    const comments = [...this.#commentsModel.get(film)];

    this.#filmDetailsComponent = new FilmDetailsView(film, comments);

    this.#filmDetailsComponent.setButtonCloseClickHandler(() => this.#closeButtonFilmDetailsClickHandler());

    render(this.#filmDetailsComponent, this.#container.parentElement);
  }

  #closeButtonFilmDetailsClickHandler = () => {
    this.#removeFilmDetailsComponent();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #addFilmDetailsComponent = (film) => {
    this.#renderFilmDetails(film);
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsComponent.element.remove();
    this.#filmDetailsComponent = null;
    document.body.classList.remove('hide-overflow');
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsComponent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #renderHeaderUserProfile() {
    this.#headerProfileComponent = new HeaderProfileView(this.#films);

    render(this.#headerProfileComponent, this.#header);
  }

  #renderFilter() {
    this.#filterComponent = new FilterView(this.#films);
    render(this.#filterComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderFooterStatistics() {
    this.#footerStatisticsComponent = new FooterStatisticsView(this.#films);

    render(this.#footerStatisticsComponent, this.#footerStatistics);
  }

  #renderFilmBoard() {
    if (this.#films.length === 0) {
      render(new FilmListEpmtyView(), this.#container);
      return;
    }
    render(this.#sortComponent, this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);


    this.#films
      .slice(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP))
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
      this.#filmButtonMoreComponent.setButtonClickHandler(() => this.#filmButtonMoreClickHandler());
    }
  }

  #filmButtonMoreClickHandler() {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
    }
  }

  init = (header, container, filmsModel, commentsModel, footerStatistics) => {
    this.#header = header;
    this.#container = container;
    this.#footerStatistics = footerStatistics;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = [...this.#filmsModel.films];
    //console.log(generateFilter(this.#films));
    this.#renderHeaderUserProfile();
    this.#renderFilter();
    this.#renderFilmBoard();
    this.#renderFooterStatistics();
  };

  #filmCangeHandler = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };
}
