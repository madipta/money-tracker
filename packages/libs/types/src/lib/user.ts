type IAuthId = {
  email: string,
}

type IUserName = {
  name: string,
}

export type IUserLogin = IAuthId & {
  password: string,
};

export type IUserRegister = IUserLogin & {
  name: string,
}

export type IUser = IUserName;
