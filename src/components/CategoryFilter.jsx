import { useStore } from '../context/StoreContext';
import './CategoryFilter.css';

export default function CategoryFilter() {
  const { category, setCategory, categories } = useStore();

  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-btn ${category === cat.id ? 'active' : ''}`}
          onClick={() => setCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}