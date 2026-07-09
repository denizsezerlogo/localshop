export default function Loader({ label = 'Yükleniyor…' }) {
  return (
    <div className="loader-wrap" role="status">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
