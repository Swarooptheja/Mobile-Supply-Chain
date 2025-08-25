export interface IUser {
  id: string;
  email: string;
  name: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => void;
}
