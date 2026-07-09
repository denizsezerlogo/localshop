import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/orders.api';
import { payOrder } from '../api/payments.api';
import { useFetch } from '../hooks/useFetch';
import { formatPrice } from '../utils/format';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

// Girdi maskeleri: kart numarası 4'lü gruplar, tarih AA/YY
const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function PaymentPage() {
  const { orderId } = useParams();
  const [card, setCard] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);
  const [paidOrder, setPaidOrder] = useState(null);

  const { data, loading, error, refetch } = useFetch(() => getOrder(orderId), [orderId]);

  if (loading) return <Loader label="Sipariş yükleniyor…" />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const order = paidOrder || data.order;
  const payable = ['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(order.status);

  // Ödeme tamamlandıysa başarı ekranı
  if (paidOrder) {
    return (
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 8 }}>Ödeme Başarılı 🎉</h1>
        <p className="muted" style={{ marginBottom: 16 }}>
          Sipariş #{paidOrder._id.slice(-8).toUpperCase()} için ödemeniz alındı.
        </p>
        <StatusBadge status={paidOrder.status} />
        <div style={{ marginTop: 20 }}>
          <Link to="/orders" className="btn btn-primary">Siparişlerime Git</Link>
        </div>
      </div>
    );
  }

  if (!payable) {
    return (
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>Bu sipariş ödenemez</h1>
        <StatusBadge status={order.status} />
        <p className="muted" style={{ margin: '12px 0 20px' }}>Sipariş ödemeye uygun durumda değil.</p>
        <Link to="/orders" className="btn btn-outline">Siparişlerime dön</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPayError('');
    setPaying(true);
    try {
      const res = await payOrder({
        orderId,
        cardNumber: card.cardNumber.replace(/\s/g, ''),
        cardHolder: card.cardHolder.trim(),
        expiry: card.expiry,
        cvv: card.cvv,
      });
      if (res.data.paymentSuccess) {
        setPaidOrder(res.data.order);
      } else {
        setPayError(`${res.message} — kartınızı kontrol edip tekrar deneyebilirsiniz.`);
        refetch(); // sipariş durumu PAYMENT_FAILED oldu, güncel hali çek
      }
    } catch (err) {
      setPayError(err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Ödeme</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="payment-layout">
        <div className="card">
          <div className="test-cards">
            <strong>Test kartları:</strong> başarılı ödeme için <code>4242 4242 4242 4242</code>, başarısız
            ödeme için <code>4000 0000 0000 0000</code> kullanın.
          </div>

          {payError && <div className="alert alert-error">{payError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="cardNumber">Kart Numarası</label>
              <input
                id="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={card.cardNumber}
                onChange={(e) => setCard((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="cardHolder">Kart Sahibi</label>
              <input
                id="cardHolder"
                autoComplete="cc-name"
                placeholder="Ad Soyad"
                value={card.cardHolder}
                onChange={(e) => setCard((p) => ({ ...p, cardHolder: e.target.value }))}
                required
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="expiry">Son Kullanma (AA/YY)</label>
                <input
                  id="expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="12/28"
                  value={card.expiry}
                  onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={card.cvv}
                  onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={paying}>
              {paying ? 'Ödeme işleniyor…' : `${formatPrice(order.totalPrice)} Öde`}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 10 }}>Sipariş Özeti</h3>
          {order.items.map((item, index) => (
            <div className="summary-row" key={index}>
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Toplam</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
