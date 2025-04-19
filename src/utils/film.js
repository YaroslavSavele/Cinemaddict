import dayjs from 'dayjs';

const sortFilmsByDate = (filmA, filmB) =>
  dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortFilmsByRating = (filmA, filmB) =>
  filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export { sortFilmsByDate, sortFilmsByRating };
