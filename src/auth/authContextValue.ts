import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);