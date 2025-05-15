//import { generateFilter } from '../mock/filter.js';

const filterItemsTemplate = (filters, currentFilter) => {
  //const { type, name, count } = filters;

  const items = filters
    .slice(1)
    .map((item) =>
      `<a href="#" class="main-navigation__item ${item.type === currentFilter ? 'main-navigation__item--active' : ''}" data-filter-type="${item.type}">${item.name}<span class="main-navigation__item-count">${item.count}</span></a>`
    );

  return items.join('');

};

export { filterItemsTemplate };
