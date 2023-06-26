export const SortType = {
  DAY : 'day',
  TIME: 'time',
  PRICE: 'price',
  DEFAULT : 'day',
};

export const UserAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const NoPointsExplanation = {
  DEFAULT : 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
  LOADING: 'Loading...'
};

export const Reason = {
  LOADING : 'loading',
};

export const DEFAULT_POINT_DATA = {

  'basePrice': 0,
  'dateFrom': new Date().toISOString(),
  'dateTo': new Date().toISOString(),
  //'destination': destinations(0).id,
  'isFavorite' : false,
  'offers' : [],
  //'type': offers(0).type
};
