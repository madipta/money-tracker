export type IUser = {
  email: string,
  name: string,
  password: string,
};

export type IUserLogin = Omit<IUser, 'name'>;
