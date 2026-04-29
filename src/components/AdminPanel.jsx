import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';
import './AdminPanel.css';

export default function AdminPanel() {
  const { 
    products, 
    settings, 
    setSettings, 
    setIsAdmin,
    isAdmin,
    addProduct, 
    updateProduct, 
    deleteProduct,
    uploadImage
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'luminaria',
    description: '',
    image: '',
  });
  const [settingsForm, setSettingsForm] = useState(settings);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      window.location.hash = '#home';
    }
  }, [isAdmin]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const productData = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price) || 0,
      };

      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
      } else {
        addProduct(productData);
      }

      setFormData({
        name: '',
        price: '',
        category: 'luminaria',
        description: '',
        image: '',
      });
      setImagePreview('');
      setSelectedFile(null);
      setEditingProduct(null);
      alert('Produto salvo com sucesso!');
    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao salvar produto: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
    });
    setImagePreview(product.image);
    setSelectedFile(null);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
    }
  };

  const handleSaveSettings = () => {
    setSettings(settingsForm);
    alert('Configurações salvas!');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    window.location.hash = '#home';
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-panel" id="admin">
      <div className="admin-header">
        <h2>Painel Admin</h2>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Produtos
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          Configurações
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-content">
          <form className="product-form" onSubmit={handleSubmit}>
            <h3>{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</h3>
            
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Imagem</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={isUploading}>
                {isUploading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Adicionar')}
              </button>
              {editingProduct && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      price: '',
                      category: 'luminaria',
                      description: '',
                      image: '',
                    });
                    setImagePreview('');
                    setSelectedFile(null);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="products-list">
            <h3>Produtos Cadastrados ({products.length})</h3>
            <div className="products-table">
              {products.map(product => (
                <div key={product.id} className="product-row">
                  <img src={product.image} alt={product.name} className="product-thumb" />
                  <div className="product-details">
                    <strong>{product.name}</strong>
                    <span>R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="admin-content">
          <div className="settings-form">
            <h3>Configurações da Loja</h3>
            
            <div className="form-group">
              <label>Nome da Loja</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp (apenas números com DDI)</label>
              <input
                type="text"
                placeholder="5511999999999"
                value={settingsForm.whatsapp}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
              />
              <small>Exemplo: 5511999999999 (Brasil)</small>
            </div>

            <div className="form-group">
              <label>Instagram (@sem)</label>
              <input
                type="text"
                placeholder="seudonome"
                value={settingsForm.instagram}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
              />
            </div>

            <button className="btn-save" onClick={handleSaveSettings}>
              Salvar Configurações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}