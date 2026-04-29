import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS, CATEGORIES } from '../data/initialData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [category, setCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('loja3d_products');
    const savedSettings = localStorage.getItem('loja3d_settings');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('loja3d_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('loja3d_settings', JSON.stringify(DEFAULT_SETTINGS));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('loja3d_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('loja3d_settings', JSON.stringify(settings));
  }, [settings]);

  const login = (username, password) => {
    if (username === 'juliano' && password === '92369236') {
      setIsAdmin(true);
      setLoginError('');
      return true;
    } else {
      setLoginError('Usuário ou senha incorretos');
      return false;
    }
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  const value = {
    products,
    filteredProducts,
    settings,
    category,
    categories: CATEGORIES,
    isAdmin,
    loginError,
    login,
    setCategory,
    setSettings,
    setIsAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}