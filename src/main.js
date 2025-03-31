import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
//import { generateFilms } from './mock/film.js';
//import { generateComments } from './mock/comment.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

//render(new HeaderProfileView(), siteHeaderElement);
//render(new FilterView, siteMainElement, RenderPosition.AFTERBEGIN);
//render(new FooterStatisticsView(), footerStatisticsElement);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel(filmsModel);

const filmsPresenter = new FilmsPresenter();

filmsPresenter.init(siteHeaderElement, siteMainElement, filmsModel, commentsModel, footerStatisticsElement);

//const films = generateFilms();
//const comments = generateComments(films);

//console.log(films);
//console.log(comments);
