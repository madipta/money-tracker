type IAuthId = {
  email: string;
};

type IUserName = {
  name: string;
};

export type IUserLogin = IAuthId & {
  password: string;
};

export type IUserRegister = IUserLogin & IUserName;

export type IUser = IUserName & {
  address: string;
  city: string;
  country: string;
  phone: string;
};
