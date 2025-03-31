import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';

dayjs.extend(dayjsRandom);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

const getRandomArray = (array, maxCount) => {
  const count = getRandomInteger(1, maxCount);
  const outputArray = [];

  while (outputArray.length < count) {
    const item = array[getRandomInteger(0, array.length - 1)];
    if (outputArray.includes(item)) {
      continue;
    }
    outputArray.push(item);
  }
  return outputArray;
};

const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');
const formatStringToYear = (date) => dayjs(date).format('YYYY');
const formatMinutesToTime = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;

  return (hours > 0) ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getRandomDate = () => dayjs.between('1940-06-10T11:00:00+01:00', '2025-03-10T19:00:00+01:00').format();
const getWatchingDate = () => dayjs.between('2010-06-10T11:00:00+01:00', '2025-03-10T19:00:00+01:00').format();

const formatStringToDate = (date) => {
  const year = formatStringToYear(date);
  const month = dayjs(date).format('MM');
  const day = dayjs(date).format('DD');
  const hour = dayjs(date).format('HH');
  const minute = dayjs(date).format('mm');

  return `${year}/${month}/${day} ${hour}:${minute}`;
};

export {
  getRandomInteger, getRandomArray, getRandomDate, getRandomValue, humanizeDate, formatStringToYear,
  formatMinutesToTime, formatStringToDate, getWatchingDate,
};
