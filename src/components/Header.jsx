import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import './Header.css';

export default function Header() {
  const { settings, isAdmin, setIsAdmin, login, loginError, setIsAdmin: setAdmin } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setAdmin(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="#home">
            <img src="/logo.png" alt="3D Prestes" />
          </a>
        </div>
        
        <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${showMenu ? 'open' : ''}`}>
          <a href="#home" onClick={() => setShowMenu(false)}>Início</a>
          <a href="#produtos" onClick={() => setShowMenu(false)}>Produtos</a>
          <a href="#contato" onClick={() => setShowMenu(false)}>Contato</a>
          {isAdmin ? (
            <>
              <a href="#admin" onClick={() => setShowMenu(false)}>Painel Admin</a>
              <button className="btn-admin" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <button className="btn-admin" onClick={() => setShowLoginModal(true)}>
              Login Admin
            </button>
          )}
        </nav>
      </div>

      {showLoginModal && (
        <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <h2>Login Admin</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Usuário:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite o usuário"
                  required
                />
              </div>
              <div className="form-group">
                <label>Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </div>
              {loginError && <p className="login-error">{loginError}</p>}
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowLoginModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-login">
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}