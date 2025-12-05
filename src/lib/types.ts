export type FoodOption = {
  id: string;
  name: string;
  price: number;
  heavinessScore: number;
  generosityIndex: string;
  position: {
    top: string;
    left: string;
  };
  image: {
    id: string;
    hint: string;
  };
};
