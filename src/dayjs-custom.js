import dayjs from 'dayjs';
import { FilterType } from './const';
export const getTimeFromIso = (isoDate) => dayjs(isoDate).format('HH:mm');
export const getDateFromIso = (isoDate) => dayjs(isoDate).format('MMM DD');
export const getEditableDateFromIso = (isoDate) => dayjs(isoDate).format('DD/MM/YY');
const getComparableDateFromIso = (isoDate) => Number(dayjs(isoDate).format('YYYYMMDD'));

export const getDurationFromIso = (start, finish) => {
  // if ((dayjs(finish).diff(dayjs(start), 'm')) < 0){
  //   throw 'Finish date is before start!';
  // }
  const duration = {
    minutes:  (dayjs(finish).diff(dayjs(start), 'm')) % 60 + 1 ,
    hours:    (dayjs(finish).diff(dayjs(start), 'h')) % 24,
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


export const sortByDay = (a, b) => {
  a = a.dateFrom;
  b = b.dateFrom;
  const weight = getWeightForNull(a, b);

  return weight ?? getDuration(a, b);
};

export const sortByTime = (a, b) => {
  a = getDuration(a.dateFrom, a.dateTo);
  b = getDuration(b.dateFrom, b.dateTo);
  const weight = getWeightForNull(a, b);

  return weight ?? (b - a);
};

export const sortByPrice = (a, b) => {
  a = a.basePrice;
  b = b.basePrice;
  const weight = getWeightForNull(a, b);

  return weight ?? (b - a);
};

//export const filter
const filterByDate = (filterType, dateFrom, dateTo, currentDate)=> {
  //console.log(dateFrom);
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
  //currentDate = currentDate.iso;
  const filteredPointsList = [];
  points.forEach((point) => {
    //console.log('\npoint',point, filterType, point.date_from, point.date_to, currentDate);
    if (filterByDate(filterType, point.dateFrom, point.dateTo, currentDate)){
      filteredPointsList.push(point);
    }
  });
  return filteredPointsList;
};
