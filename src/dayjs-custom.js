import dayjs from 'dayjs';
import { FilterType } from './const';
export const getTimeFromIso = (isoDate) => dayjs(isoDate).format('HH:mm');
export const getDateFromIso = (isoDate) => dayjs(isoDate).format('MMM DD');
export const getEditableDateFromIso = (isoDate) => dayjs(isoDate).format('DD/MM/YY');
const getComparableDateFromIso = (isoDate) => Number(dayjs(isoDate).format('YYYYMMDD'));
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
export const getDurationFromIso = (start, finish) => {
  const duration = {
    minutes:  (dayjs(finish).diff(dayjs(start), 'm')) % MINUTES_IN_HOUR + 1 ,
    hours:    (dayjs(finish).diff(dayjs(start), 'h')) % HOURS_IN_DAY,
    days:     (dayjs(finish).diff(dayjs(start), 'd'))
  };
  let humanizedDuration = `${duration.minutes}M`;
  if (duration.minutes < 10){
    humanizedDuration = `0${humanizedDuration}`;
  }

  if (duration.hours + duration.days > 0) {
    humanizedDuration = `${duration.hours}H ${humanizedDuration}`;
  }
  if ((duration.hours < 10) && (duration.hours > 0)){
    humanizedDuration = `0${humanizedDuration}`;
  }
  if (duration.days > 0) {
    humanizedDuration = `${duration.days}D ${humanizedDuration}`;
  }
  if ((duration.days < 10) && (duration.days > 0)){
    humanizedDuration = `0${humanizedDuration}`;
  }
  return (humanizedDuration);
};

const getDuration = (start, finish)=>dayjs(finish).diff(dayjs(start));


const getWeightForNull = (a, b) => {
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  return null;
};


export const sortByDay = (point1, point2) => {
  const date1 = point1.dateFrom;
  const date2 = point2.dateFrom;
  const weight = getWeightForNull(date1, date2);

  return weight ?? getDuration(date1, date2);
};

export const sortByTime = (point1, point2) => {
  const duration1 = getDuration(point1.dateFrom, point1.dateTo);
  const duration2 = getDuration(point2.dateFrom, point2.dateTo);
  const weight = getWeightForNull(duration1, duration2);

  return weight ?? (duration2 - duration1);
};

export const sortByPrice = (point1, point2) => {
  const price1 = point1.basePrice;
  const price2 = point2.basePrice;
  const weight = getWeightForNull(price1, price2);

  return weight ?? (price2 - price1);
};

const filterByDate = (filterType, dateFrom, dateTo, currentDate)=> {
  if (filterType === FilterType.EVERYTHING){
    return true;
  }
  if (filterType === FilterType.FUTURE &&
    getComparableDateFromIso(dateFrom) > getComparableDateFromIso(currentDate)){
    return true;
  }
  if (filterType === FilterType.PAST &&
    getComparableDateFromIso(dateTo) < getComparableDateFromIso(currentDate)){
    return true;
  }
  if (filterType === FilterType.PRESENT &&
    getComparableDateFromIso(dateFrom) <= getComparableDateFromIso(currentDate) &&
    getComparableDateFromIso(dateTo) >= getComparableDateFromIso(currentDate)){
    return true;
  }
  return false;
};

export const filterPoints = (filterType, points) =>{
  const currentDate = new Date().toISOString();
  const filteredPointsList = [];
  points.forEach((point) => {
    if (filterByDate(filterType, point.dateFrom, point.dateTo, currentDate)){
      filteredPointsList.push(point);
    }
  });
  return filteredPointsList;
};
