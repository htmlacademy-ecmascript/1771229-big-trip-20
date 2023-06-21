import { nanoid } from 'nanoid';

const currentDate = new Date().toISOString();
const points =
 [
   {
     'base_price': 2000,
     'date_from': '2019-07-12T03:55:56.845Z',
     'date_to': '2019-07-12T04:22:13.375Z',
     'destination':
      {
        'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
        'name': 'Mytischi',
        'pictures': [
          {
            'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
            'description': 'Chamonix parliament building'
          }
        ]
      },
     'id': nanoid(),
     'is_favorite': false,
     'offers': [1,2],
     'type': 'ship'
   },
   {
     'base_price': 3000,
     'date_from': '2019-07-10T22:55:56.845Z',
     'date_to': '2019-08-11T11:20:13.375Z',
     'destination':
      {
        'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
        'name': 'Podolsk',
        'pictures': [
          {
            'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
            'description': 'Chamonix parliament building'
          }
        ]
      },
     'id': nanoid(),
     'is_favorite': false,
     'offers': [1,2],
     'type': 'taxi'
   },
   {
     'base_price': 1100,
     'date_from': '2019-07-10T22:55:56.845Z',
     'date_to': '2019-07-11T11:22:13.375Z',
     'destination':
      {
        'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
        'name': 'Lobnya',
        'pictures': [
          {
            'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
            'description': 'Chamonix parliament building'
          }
        ]
      },
     'id': nanoid(),
     'is_favorite': false,
     'offers': [1,2],
     'type': 'bus'
   }
 ];

//console.log(points);

export const generatePoints = () => points;

export const NEW_POINT_DATA =
{
  'base_price': '',
  'date_from': '',
  'date_to': '',
  'destination':
     {
       'description': '',
       'name': '',
       'pictures': []
     },
  'id': nanoid(),
  'is_favorite': false,
  'offers': [],
  'type': 'train'
};
