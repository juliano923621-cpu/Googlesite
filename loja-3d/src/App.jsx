import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Home from './pages/Home';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <div className="app">
        <Header />
        <Home />
        <AdminPanel />
        <Footer />
      </div>
    </StoreProvider>
  );
}

export default App;