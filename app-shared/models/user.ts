export interface IUserRequest {
  name: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string;
}
export interface IUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  last_login: string;
  role: string;
  token: string;
  active: number;
  suspend: number;
  delete: number;
  created_at: string;
  updated_at: string;
  image: string;
  code_expire?: Date;
  verify_code?: string;
}
