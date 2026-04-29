import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS, CATEGORIES } from '../data/initialData';
import { supabase } from '../supabase';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [category, setCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSettings({ ...DEFAULT_SETTINGS, ...data[0] });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      const savedSettings = localStorage.getItem('loja3d_settings');
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }
    }
  };

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(INITIAL_PRODUCTS);
        for (const product of INITIAL_PRODUCTS) {
          await supabase.from('produtos').insert([product]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      const savedProducts = localStorage.getItem('loja3d_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem('loja3d_products', JSON.stringify(products));
    }
  }, [products, loading]);

  const saveSettingsToDb = async (newSettings) => {
    try {
      const { data: existing } = await supabase
        .from('configuracoes')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from('configuracoes')
          .update(newSettings)
          .eq('id', existing[0].id);
      } else {
        await supabase
          .from('configuracoes')
          .insert([newSettings]);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      saveSettingsToDb(settings);
      localStorage.setItem('loja3d_settings', JSON.stringify(settings));
    }
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

  const uploadImage = async (file) => {
    try {
      const timestamp = Date.now();
      const cleanName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${timestamp}_${cleanName}`;
      const filePath = `produtos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('produtos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        console.error('Erro upload:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('produtos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const addProduct = async (product) => {
    const newProduct = { 
      ...product, 
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('produtos')
        .insert([newProduct]);

      if (error) throw error;

      setProducts([newProduct, ...products]);
      return newProduct;
    } catch (error) {
      console.error('Erro ao adicionar no banco:', error);
      setProducts([newProduct, ...products]);
      return newProduct;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const productToUpdate = { ...updatedProduct, id };

    try {
      const { error } = await supabase
        .from('produtos')
        .update(productToUpdate)
        .eq('id', id);

      if (error) throw error;

      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    } catch (error) {
      console.error('Erro ao atualizar no banco:', error);
      setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao deletar no banco:', error);
      setProducts(products.filter(p => p.id !== id));
    }
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
    uploadImage,
    loading,
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