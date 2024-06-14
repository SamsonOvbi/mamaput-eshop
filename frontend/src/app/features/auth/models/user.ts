
export interface User {
  _id: string;
  username: string;
  // token: string;
  isAdmin: boolean;
}
export interface Credentials {
  email: string;
  password: string;
}

export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
export interface UserAuth {
  userInfo?: UserInfo;
  error: string;
}
