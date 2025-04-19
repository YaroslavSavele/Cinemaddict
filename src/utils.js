import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(dayjsRandom);
dayjs.extend(duration);
dayjs.extend(relativeTime);

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

const humanizeDate = (date) => {
  const timeDiff = dayjs(date).diff(dayjs());
  return dayjs.duration(timeDiff).humanize(true);
};

const formatStringToDate = (date) => dayjs(date).format('DD MMMM YYYY');

const formatStringToYear = (date) => dayjs(date).format('YYYY');

const formatMinutesToTime = (minutes) => dayjs.duration(minutes, 'minutes').format('H[h] mm[m]');

const getRandomDate = () => dayjs.between('1940-06-10T11:00:00+01:00', '2025-03-10T19:00:00+01:00').format();

const getWatchingDate = () => dayjs.between('2010-06-10T11:00:00+01:00', '2025-03-10T19:00:00+01:00').format();

export {
  getRandomInteger, getRandomArray, getRandomDate, getRandomValue, humanizeDate, formatStringToYear,
  formatMinutesToTime, formatStringToDate, getWatchingDate,
};
