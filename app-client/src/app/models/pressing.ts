export interface IPressingListItem {
  id: any;
  date: Date;
  price: number;
  status: string;
  cloths: {
    id: any;
    type: string;
    price: number;
    commandId: any;
    details: string;
    isValidated: number;
    quantity: number;
  }[];
  validated: boolean;
}

export interface ICloth {
  id: any;
  name: string;
  price: number;
}
