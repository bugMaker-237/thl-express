export interface UserRequest {
  username: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  image: string;
  username: string;
  token?: string;
  name: string;
  email?: string;
}
