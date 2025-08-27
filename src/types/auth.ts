export interface IUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  userId: string;
  personId?: string;
  fullName?: string;
  responsibilities: string[];
  defaultOrgId?: string;
  defaultInvOrgName?: string;
  setOfBookId?: string;
  responsibilityId?: string;
}

export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  metadata: Array<{
    name: string;
    type: string;
  }>;
  data: Array<{
    STATUS: string;
    USER_NAME: string;
    USER_ID: string;
    TIMESTAMP?: string;
    TIMEZONE_OFFSET?: string;
    FULL_NAME: string;
    PERSON_ID: string;
    RESPONSIBILITY: string;
    SET_OF_BOOK_ID: string;
    DEFAULT_ORG_ID: string;
    DEFAULT_OU_NAME: string;
    DEFAULT_INV_ORG_ID: string;
    DEFAULT_INV_ORG_NAME: string;
    DEFAULT_INV_ORG_CODE: string;
    RESPONSIBILITY_ID: string;
    RESP_APPLICATION_ID: string;
    ERROR: string;
  }>;
}

export interface IAuthContext {
  user?: IUser | null;
  isAuthenticated?: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout?: () => void;
  responsibilities?: string[];
  defaultOrgId?: string | null;
}
