import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState title="Sayfa bulunamadı" hint="Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.">
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
        Ürünlere dön
      </Link>
    </EmptyState>
  );
}
