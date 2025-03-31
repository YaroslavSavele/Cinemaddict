import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticTemplate = (films) => `<p>${films.length} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView{
  #films = [];

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterStatisticTemplate(this.#films);
  }
}
