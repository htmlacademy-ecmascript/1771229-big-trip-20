const offers =
  [
    (
      {
        'type': 'taxi',
        'offers': [
          {
            'id': 1,
            'title': 'Offer 1',
            'price': 123
          },
          {
            'id': 2,
            'title': 'Offer 2',
            'price': 120
          },
          {
            'id': 3,
            'title': 'Offer 3',
            'price': 120
          },
          {
            'id': 4,
            'title': 'Offer 4',
            'price': 123
          },
        ]
      }),
    (
      {
        'type':'bus',
        'offers': [
          {
            'id': 5,
            'title': 'Offer 5',
            'price': 123
          },
          {
            'id': 6,
            'title': 'Offer 6',
            'price': 120
          },
          {
            'id': 7,
            'title': 'Offer 7',
            'price': 120
          },
          {
            'id': 8,
            'title': 'Offer 8',
            'price': 120
          },
        ]
      }),
    (
      {
        'type': 'train',
        'offers': [
          {
            'id': 10,
            'title': 'Offer 10',
            'price': 120
          },
          {
            'id': 20,
            'title': 'Offer 20',
            'price': 120
          },
          {
            'id': 30,
            'title': 'Offer 30',
            'price': 120
          },
          {
            'id': 40,
            'title': 'Offer 40',
            'price': 120
          },
        ]
      }),
    (
      {
        'type': 'ship',
        'offers': [
          {
            'id': 11,
            'title': 'Offer 11',
            'price': 120
          },
          {
            'id': 21,
            'title': 'Offer 21',
            'price': 120
          },
          {
            'id': 31,
            'title': 'Offer 31',
            'price': 120
          },
          {
            'id': 41,
            'title': 'Offer 41',
            'price': 120
          },
        ]
      }),

  ];

export const generateOffers = () => offers;
