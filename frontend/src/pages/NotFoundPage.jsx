import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { MSG } from '../constants/messages';

export default function NotFoundPage() {
  return (
    <EmptyState title={MSG.NOT_FOUND_TITLE} hint={MSG.NOT_FOUND_HINT}>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
        Ürünlere dön
      </Link>
    </EmptyState>
  );
}
