import { humanizeDate } from '../utils.js';
import he from 'he';

const createFilmDetailsCommentsTemplate = (comments) => {
  let template = '';
  comments.forEach((comment) => {
    template += `<li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
                  </span>
                  <div>
                    <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${comment.autor}</span>
                      <span class="film-details__comment-day">${humanizeDate(comment.date)}</span>
                      <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
                    </p>
                  </div>
                </li>`;
  });
  return template;

};

export { createFilmDetailsCommentsTemplate };
