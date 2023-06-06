import dayjs from 'dayjs';
export const getTimeFromIso = (isoDate) => dayjs(isoDate).format('HH:mm');
export const getDateFromIso = (isoDate) => dayjs(isoDate).format('MMM DD');
export const getEditableDateFromIso = (isoDate) => dayjs(isoDate).format('DD/MM/YY');

export const getDurationFromIso = (start, finish) => {
  if ((dayjs(finish).diff(dayjs(start), 'm')) < 0){throw 'Finish date is before start!';}
  const duration = {
    minutes:  (dayjs(finish).diff(dayjs(start), 'm')) % 60 + 1 ,
    hours:    (dayjs(finish).diff(dayjs(start), 'h')) % 24,
    days:     (dayjs(finish).diff(dayjs(start), 'd'))
  };
  let humanizedDuration = `${duration.minutes}M`;
  if (duration.minutes < 10){humanizedDuration = `0${humanizedDuration}`;}

  if (duration.hours + duration.days > 0) {
    humanizedDuration = `${duration.hours}H ${humanizedDuration}`;
  }
  if ((duration.hours < 10)&&(duration.hours > 0)){humanizedDuration = `0${humanizedDuration}`;}
  if (duration.days > 0) {
    humanizedDuration = `${duration.days}D ${humanizedDuration}`;
  }
  if ((duration.days < 10)&&(duration.days > 0)){humanizedDuration = `0${humanizedDuration}`;}
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
  a = a.date_from;
  b = b.date_from;
  const weight = getWeightForNull(a, b);

  return weight ?? getDuration(a, b);
};

export const sortByTime = (a, b) => {
  a = getDuration(a.date_from, a.date_to);
  b = getDuration(b.date_from, b.date_to);
  const weight = getWeightForNull(a, b);

  return weight ?? (b - a);
};

export const sortByPrice = (a, b) => {
  a = a.base_price;
  b = b.base_price;
  const weight = getWeightForNull(a, b);

  return weight ?? (b - a);
};
