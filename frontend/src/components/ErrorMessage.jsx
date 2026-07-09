export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error">
      <p>{message || 'Bir şeyler ters gitti.'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={onRetry}>
          Tekrar dene
        </button>
      )}
    </div>
  );
}
