import React, { createContext } from 'react';

// Временные заглушки для TypeScript
class UserStore {
  isAuth = false;
  isLoading = false;
  error: string | null = null;
  login = async () => ({ success: false });
}

class TkanStore {
  tkans: any[] = [];
  isLoading = false;
  error: string | null = null;
  fetchTkans = () => {};
  fetchTypes = () => {};
  fetchBrands = () => {};
}

class WorksStore {
  works: any[] = [];
}

interface AppContextType {
  user: UserStore;
  tkans: TkanStore;
  works: WorksStore;
}

// Создаем контекст
export const Context = createContext<AppContextType | null>(null);

// Провайдер
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stores = {
    user: new UserStore(),
    tkans: new TkanStore(),
    works: new WorksStore(),
  };

  return (
    <Context.Provider value={stores}>
      {children}
    </Context.Provider>
  );
};