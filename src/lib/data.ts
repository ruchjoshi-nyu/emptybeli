import type { FoodOption } from './types';

export const foodOptions: FoodOption[] = [
  {
    id: '1',
    name: '99c Pizza Slice',
    price: 0.99,
    heavinessScore: 2,
    generosityIndex: 'Just the slice, what did you expect?',
    position: { top: '30%', left: '25%' },
    image: { id: 'pizza-slice', hint: 'pizza slice' },
  },
  {
    id: '2',
    name: 'Halal Cart',
    price: 7.0,
    heavinessScore: 5,
    generosityIndex:
      'Chicken over rice with white sauce, hot sauce, and a free can of soda.',
    position: { top: '50%', left: '70%' },
    image: { id: 'halal-food', hint: 'halal food' },
  },
  {
    id: '3',
    name: 'Fancy Burger',
    price: 18.0,
    heavinessScore: 4,
    generosityIndex: 'Served with a comically small portion of truffle fries.',
    position: { top: '75%', left: '30%' },
    image: { id: 'burger', hint: 'burger' },
  },
  {
    id: '4',
    name: "Joe's Pizza",
    price: 3.0,
    heavinessScore: 2,
    generosityIndex: 'A classic, foldable New York slice.',
    position: { top: '20%', left: '80%' },
    image: { id: 'pizza-slice-2', hint: 'pizza slice' },
  },
  {
    id: '5',
    name: 'Soup Dumplings (6pc)',
    price: 4.5,
    heavinessScore: 3,
    generosityIndex: 'Comes with a side of ginger and black vinegar.',
    position: { top: '60%', left: '50%' },
    image: { id: 'dumplings', hint: 'dumplings' },
  },
];
