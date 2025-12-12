export interface UserStore {
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export interface TkanStore {
  tkans: any[];
  isLoading: boolean;
  error: string | null;
  fetchTkans: () => Promise<void>;
  fetchTypes: () => Promise<void>;
  fetchBrands: () => Promise<void>;
}

export interface WorksStore {
  works: any[];
}

export interface AppContextType {
  user: UserStore;
  tkans: TkanStore;
  works: WorksStore;
}