import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiSliders } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Shop.css';

export default function Shop() {
  const [viewMode, setViewMode] = useState('grid');
  const [showCount, setShowCount] = useState(20);
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search')?.toLowerCase() || '';

  const filteredProducts = products.filter(p => {
    if (searchQ) {
      return p.name.toLowerCase().includes(searchQ) || p.category.toLowerCase().includes(searchQ) || p.tags.some(t => t.toLowerCase().includes(searchQ));
    }
    return true;
  });

  return (
    <main className="shop-page" id="shop-page">
      <PageBanner title="Product" breadcrumbs={['Home', 'Product']} />

      <section className="shop section">
        <div className="container">
          <div className="shop__toolbar">
            <p className="shop__count">{filteredProducts.length} Item(s) On List {searchQ && `matching "${searchQ}"`}</p>
            <div className="shop__toolbar-right">
              <button 
                className={`shop__filter-btn ${showFilter ? 'active' : ''}`} 
                id="filter-toggle"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FiSliders /> FILTER
              </button>
              <select
                className="shop__select"
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                id="show-count-select"
              >
                <option value={10}>Show 10</option>
                <option value={20}>Show 20</option>
                <option value={50}>Show 50</option>
              </select>
              <div className="shop__view-toggle">
                <button
                  className={`shop__view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  className={`shop__view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {showFilter && (
            <div className="shop__filter-panel" style={{ padding: '20px', background: '#f9f9f9', marginBottom: '30px', borderRadius: '4px' }}>
              <h4>Filter Options</h4>
              <p style={{ marginTop: '10px', color: '#666' }}>Additional filter options like Category, Price, and Brand will be implemented here.</p>
            </div>
          )}

          <div className={`shop__products ${viewMode === 'list' ? 'shop__products--list' : ''}`}>
            {filteredProducts.slice(0, showCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
