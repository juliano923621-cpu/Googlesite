import { useStore } from '../context/StoreContext';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import './Home.css';

export default function Home() {
  const { filteredProducts, settings } = useStore();

  return (
    <main className="home" id="home">
      <section className="hero">
        <div className="hero-content">
          <h2>Bem-vindo à 3D Prestes</h2>
          <p>Impressões 3D personalizadas sob demanda</p>
          <a href="#produtos" className="btn-hero">Ver Produtos</a>
        </div>
      </section>

      <section className="products-section" id="produtos">
        <div className="section-container">
          <h2>Nossos Produtos</h2>
          <CategoryFilter />
          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </main>
  );
}