import { generateFilter } from '../mock/filter.js';

const filterItemsTemplate = (films) => {
  const filters = generateFilter(films)
    .slice(1)
    .map((item) =>
      `<a href="#" class="main-navigation__item">${item.name} <span class="main-navigation__item-count">${item.count}</span></a>`
    );

  return filters.join('');

};

export { filterItemsTemplate };
