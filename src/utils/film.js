const sortFilmsByDate = (filmA, filmB) =>
  new Date(filmB.filmInfo.release.date) - new Date(filmA.filmInfo.release.date);

const sortFilmsByRating = (filmA, filmB) =>
  filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export { sortFilmsByDate, sortFilmsByRating };
