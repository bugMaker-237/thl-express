export interface UserRequest {
  username: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  username: string;
  email: string;
  phone: string;
}
