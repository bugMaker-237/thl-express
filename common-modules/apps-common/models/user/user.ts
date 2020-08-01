import { IUser } from './i.user';

export class User implements IUser {
  public image: string;
  public username: string;
  public token?: string;
  public name: string;
  public email?: string;
}
