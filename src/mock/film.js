import { getRandomInteger, getRandomArray, getRandomDate, getRandomValue, getWatchingDate } from '../utils.js';
import { FILM_COUNT, MAX_COMMENTS_ON_FILM, titles, phrases, posters, actors, ages, directors, writers, countries, genres } from './const.js';

const getRandomFloat = (base) => getRandomInteger(0, 100) / base;

const generateFilm = () => ({
  title: getRandomValue(titles),
  alternativeTitle: getRandomValue(titles),
  totalRating: getRandomFloat(10),
  poster: getRandomValue(posters),
  ageRating: getRandomValue(ages),
  director: getRandomValue(directors),
  writers: getRandomArray(writers, 3),
  actors: getRandomArray(actors, 10),
  release: {
    date: getRandomDate(),
    releaseCountry: getRandomValue(countries)
  },
  runtime: getRandomInteger(40, 150),
  genre: getRandomArray(genres, 3),
  description: getRandomArray(phrases, 5),
});

const generateFilms = () => {
  const films = Array.from({ length: FILM_COUNT }, generateFilm);

  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0, 1);

    const filmCommentsCount = (hasComments) ? getRandomInteger(1, MAX_COMMENTS_ON_FILM) : 0;

    totalCommentsCount += filmCommentsCount;

    const alreadyWatched = Boolean(getRandomInteger(0, 1));

    return {
      id: String(index + 1),
      comments: (hasComments) ? Array.from({ length: filmCommentsCount },
        (_value, commentIndex) => String(totalCommentsCount - commentIndex)) : [],
      filmInfo: film,
      userDetails: {
        watchlist: Boolean(getRandomInteger(0, 1)),
        alreadyWatched,
        watchingDate: (alreadyWatched) ? getWatchingDate() : null,
        favorite: Boolean(getRandomInteger(0, 1))
      }
    };
  });
};

export { generateFilms };
