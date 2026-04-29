import { useStore } from '../context/StoreContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { settings } = useStore();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Quero comprar ${product.name} - R$ ${product.price.toFixed(2).replace('.', ',')}`);
    const url = settings.whatsapp 
      ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <p className="price">R$ {product.price.toFixed(2).replace('.', ',')}</p>
        <button className="btn-buy" onClick={handleWhatsApp}>
          Comprar WhatsApp
        </button>
      </div>
    </div>
  );
}