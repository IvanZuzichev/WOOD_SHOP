import React, { createContext } from 'react';
import UserStore from '../store/UserStore';
import TkanStore from '../store/TkanStore';
import WorksStore from '../store/WorksStore';

// Типы для контекста
interface AppContextType {
  user: UserStore;
  tkans: TkanStore;
  works: WorksStore;
}

// Создаем контекст без значения по умолчанию
export const Context = createContext<AppContextType | null>(null);

// Создаем провайдер отдельно
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