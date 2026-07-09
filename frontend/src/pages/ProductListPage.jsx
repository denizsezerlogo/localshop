import { useEffect, useState } from 'react';
import { listProducts, listCategories } from '../api/products.api';
import { useFetch } from '../hooks/useFetch';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { MSG } from '../constants/messages';

export default function ProductListPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);

  // Arama kutusunda her tuşta istek atmamak için debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    listCategories()
      .then((res) => setCategories(res.data.categories))
      // Bilinçli graceful degradation: kategori listesi alınamazsa filtre
      // "Tüm kategoriler" seçeneğiyle sınırlı kalır; ürün listesi etkilenmez.
      .catch(() => {});
  }, []);

  const { data, loading, error, refetch } = useFetch(
    () =>
      listProducts({
        search: debouncedSearch || undefined,
        category: category || undefined,
        page,
      }),
    [debouncedSearch, category, page]
  );

  return (
    <>
      <div className="page-header">
        <h1>Ürünler</h1>
        {data?.pagination && <span className="muted">{data.pagination.total} ürün</span>}
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Ürün ara… (örn. bal)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Ürün ara"
        />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Kategori filtresi">
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <Loader label={MSG.LOADING_PRODUCTS} />}
      {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && data?.items?.length === 0 && (
        <EmptyState title={MSG.EMPTY_PRODUCTS_TITLE} hint={MSG.EMPTY_PRODUCTS_HINT} />
      )}
      {!loading && !error && data?.items?.length > 0 && (
        <>
          <div className="product-grid">
            {data.items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}
