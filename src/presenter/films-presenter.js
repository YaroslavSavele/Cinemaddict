import { remove, render } from '../framework/render.js';
import HeaderProfileView from '../view/header-profile-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmListEpmtyView from '../view/film-list-empty-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmButtonMoreView from '../view/film-button-more-view.js';
import FilmDetailsPresenter from './film-details-presenter.js';
import FooterStatisticsView from '../view/footer-statistics-view.js';
import { FILM_COUNT_PER_STEP } from '../mock/const.js';
import FilmPersenter from './film-presenter.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';

export default class FilmsPresenter {
  #headerProfileComponent = null;
  #filterComponent = null;
  #filterPresenter = null;
  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #filmButtonMoreComponent = null;
  #footerStatisticsComponent = null;
  #header = null;
  #container = null;
  #footerStatistics = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #noFilmsComponent = null;
  #filmDetailsPresenter = null;
  #filmPresenter = new Map();
  #selectedFilm = null;
  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(header, container, footeStatistics, filmsModel, commentsModel, filterModel) {
    this.#header = header;
    this.#container = container;
    this.#footerStatistics = footeStatistics;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);
  }

  #renderFilm(film, container) {
    const filmPresenter = new FilmPersenter(
      container,
      this.#viewActionHandler,
      this.#filmClickHandler
    );

    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));
  };

  #filmClickHandler = (film) => {
    this.#addFilmDetailsComponent(film);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#onCtrlEnterDown);
  };

  #renderFilmDetails() {
    //const comments = [...this.#commentsModel.get(this.#selectedFilm)];

    if (!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(
        this.#container.parentNode,
        this.#viewActionHandler,
        this.#closeButtonFilmDetailsClickHandler,
        this.#onEscKeyDown,
        this.#onCtrlEnterDown,
        this.#commentsModel
      );
    }
    this.#filmDetailsPresenter.init(this.#selectedFilm);
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
      document.removeEventListener('keydown', this.#onCtrlEnterDown);
    }
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this.#filmDetailsPresenter.createComment();
    }
  };

  #renderHeaderUserProfile() {
    this.#headerProfileComponent = new HeaderProfileView(this.films);

    render(this.#headerProfileComponent, this.#header);
  }

  #renderNoFilms() {
    this.#noFilmsComponent = FilmListEpmtyView();
    render(this.#noFilmsComponent, this.#container);
  }

  #renderFilmButtonMoreComponent() {
    this.#filmButtonMoreComponent = new FilmButtonMoreView();
    render(this.#filmButtonMoreComponent, this.#filmListComponent.element);
    this.#filmButtonMoreComponent.setButtonClickHandler(() => this.#filmButtonMoreClickHandler());
  }

  #renderFooterStatistics() {
    this.#footerStatisticsComponent = new FooterStatisticsView(this.films);

    render(this.#footerStatisticsComponent, this.#footerStatistics);
  }

  #clearFilmBoard = ({ resetRenderedFilmCount = false, resetSortType = false } = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noFilmsComponent);
    remove(this.#filmButtonMoreComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmBoard() {
    const films = this.films;
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSort(this.#container);
    render(this.#filmsComponent, this.#container);
    render(this.#filmListComponent, this.#filmsComponent.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderFilmButtonMoreComponent();
    }
  }

  #renderSort(container) {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
    render(this.#sortComponent, container);
  }

  #filmButtonMoreClickHandler() {
    this.films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainerComponent));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      this.#filmButtonMoreComponent.element.remove();
      this.#filmButtonMoreComponent.removeElement();
      this.#filmButtonMoreComponent = null;
    }
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filtredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortFilmsByRating);
    }

    return filtredFilms;
  }

  init = () => {
    this.#renderHeaderUserProfile();
    this.#renderFilmBoard();
    this.#renderFooterStatistics();
  };

  #filmCangeHandler = (updatedFilm) => {
    if (this.#filmPresenter.get(updatedFilm.id)) {
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  };

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.update(updateType,update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.delete(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.add(updateType, update);
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this.#renderFilmBoard();
        break;
    }
  };

  //#filmDetaisCangeHandler = (updatedFilm) => {
  //  this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  //};

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard({resetRenderedFilmCount: true});
    this.#renderFilmBoard();
  };
}
