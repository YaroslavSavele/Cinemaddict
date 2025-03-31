import { phrases, autors, emotions } from './const.js';
import {  getRandomDate, getRandomValue } from '../utils.js';

const generateComment = () => ({
  autor: getRandomValue(autors),
  comment: getRandomValue(phrases),
  date: getRandomDate(),
  emotion: getRandomValue( emotions)
});

const getCommentCount = (films) => films.reduce(
  (count, film) => count + film.comments.length, 0
);

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({ length: commentCount }, (_value, index) => {
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem,
    };
  });
};

export { generateComments };
