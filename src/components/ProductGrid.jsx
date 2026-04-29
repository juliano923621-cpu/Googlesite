import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}