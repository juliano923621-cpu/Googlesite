import { useStore } from '../context/StoreContext';
import './Footer.css';

export default function Footer() {
  const { settings } = useStore();

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de fazer um pedido.');
    const url = settings.whatsapp 
      ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const handleInstagram = () => {
    if (settings.instagram) {
      window.open(`https://instagram.com/${settings.instagram}`, '_blank');
    }
  };

  return (
    <footer className="footer" id="contato">
      <div className="footer-container">
        <div className="footer-info">
          <h3>{settings.storeName || 'Loja 3D'}</h3>
          <p>Impressões 3D personalizadas sob demanda</p>
        </div>
        
        <div className="footer-social">
          <h4>Comprar pelo:</h4>
          <div className="social-links">
            <button className="btn-social whatsapp" onClick={handleWhatsApp}>
              WhatsApp
            </button>
            <button className="btn-social instagram" onClick={handleInstagram}>
              Instagram
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 {settings.storeName || 'Loja 3D'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}