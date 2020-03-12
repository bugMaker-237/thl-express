export interface IPressingListItem {
  id: any;
  date: Date;
  price: number;
  cloths: {
    type: string;
    price: number;
    quantity: number;
  }[];
  validated: boolean;
}
export interface ICloth {
  id: any;
  name: string;
  unitPrice: number;
}
