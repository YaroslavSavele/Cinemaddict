import { render, RenderPosition, replace } from '../framework/render.js';
import HeaderProfileView from '../view/header-profile-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListEpmtyView from '../view/film-list-empty-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import { updateItem } from '../utils/common.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import FooterStatisticsView from '../view/footer-statistics-view.js';
import { FILM_COUNT_PER_STEP } from '../mock/const.js';
import FilmPersenter from './film-presenter.js';
import { SortType } from '../const.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';

export default class FilmsPresenter {
  #headerProfileComponent = null;
  #filterComponent = null;

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
  #filmDetailsPresenter = null;
  #filmPresenter = new Map();
  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;
  #sourcedFilms = [];

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

  #renderFilmDetails() {
    const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#filmDetaisCangeHandler,
        this.#removeFilmDetailsComponent,
        this.#onEscKeyDown
      );
    }
    this.#filmDetailsPresenter.init(this.#selectedFilm, comments);
  }

  #closeButtonFilmDetailsClickHandler = () => {
    this.#removeFilmDetailsComponent();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #addFilmDetailsComponent = (film) => {
    this.#selectedFilm = film;
    this.#renderFilmDetails();
    document.body.classList.add('hide-overflow');
  };

  #removeFilmDetailsComponent = () => {
    this.#filmDetailsPresenter.destroy();
    this.#filmDetailsPresenter = null;
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
    this.#renderSort(this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);


    this.#renderFilmList();

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
      this.#filmButtonMoreComponent.setButtonClickHandler(() => this.#filmButtonMoreClickHandler());
    }
  }

  #renderFilmList = () => {
    this.#films
      .slice(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP))
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    if (!this.#filmButtonMoreComponent) {
      this.#filmButtonMoreComponent = new FilmButtonMoreView();

      render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
      this.#filmButtonMoreComponent.setButtonClickHandler(() => this.#filmButtonMoreClickHandler());

    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
  };

  #renderSort(container) {

    if (!this.#sortComponent) {

      this.#sortComponent = new SortView(this.#currentSortType);
      render(this.#sortComponent, container);
    } else {
      const updatedSortComponent = new SortView(this.#currentSortType);
      replace(updatedSortComponent, this.#sortComponent);
      this.#sortComponent = updatedSortComponent;
    }

    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
  }

  #filmButtonMoreClickHandler() {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
      this.#filmButtonMoreComponent = null;
    }
  }

  init = (header, container, filmsModel, commentsModel, footerStatistics) => {
    this.#header = header;
    this.#container = container;
    this.#footerStatistics = footerStatistics;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];

    this.#renderHeaderUserProfile();
    this.#renderFilter();
    this.#renderFilmBoard();
    this.#renderFooterStatistics();
  };

  #filmCangeHandler = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updateItem);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #filmDetaisCangeHandler = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updateItem);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    this.#removeFilmDetailsComponent();
    this.#addFilmDetailsComponent(updatedFilm);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmsByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderSort(this.#container);
    this.#renderFilmList();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
  };
}
