// src/App.tsx - ИСПРАВЛЕННЫЕ ИМПОРТЫ
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Context } from './context';
import {NavBar} from './components/navbar/Navbar.tsx'; 
import {Shop} from './pages/shop/Shop.tsx'; 
import {Auth} from './pages/auth/Auth.tsx'; 
import { 
  SHOP_ROUTE, 
  LOGIN_ROUTE, 
  REGISTRATION_ROUTE
} from './utils/consts';
import { Footer } from './components/footer/Footer.tsx';

function App() {
  const context = useContext(Context);
  
  if (!context) {
    return <div>Loading...</div>;
  }

  const { user } = context;

  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path={SHOP_ROUTE} element={<Shop />} />
          <Route path={LOGIN_ROUTE} element={<Auth />} />
          <Route path={REGISTRATION_ROUTE} element={<Auth />} />
          
          {/* Базовые маршруты */}
          <Route path="/" element={<Shop />} />
          <Route path="/about" element={<div>О нас</div>} />
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;