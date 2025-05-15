import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

//render(new HeaderProfileView(), siteHeaderElement);
//render(new FilterView, siteMainElement, RenderPosition.AFTERBEGIN);
//render(new FooterStatisticsView(), footerStatisticsElement);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filmsModel, filterModel);
const filmsPresenter = new FilmsPresenter(siteHeaderElement, siteMainElement, footerStatisticsElement, filmsModel, commentsModel, filterModel);

filterPresenter.init();
filmsPresenter.init();

//const films = generateFilms();
//const comments = generateComments(films);

//console.log(films);
//console.log(comments);
