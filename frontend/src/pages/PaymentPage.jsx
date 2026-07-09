import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/orders.api';
import { payOrder } from '../api/payments.api';
import { useFetch } from '../hooks/useFetch';
import { useLang } from '../i18n/LanguageContext';
import { formatPrice } from '../utils/format';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';

// Girdi maskeleri: kart numarası 4'lü gruplar, tarih AA/YY.
// Kart girişi bilinçli olarak 16 haneyle sınırlı: FakePay yalnızca 16 haneli
// test kartlarını kabul eder. Gerçek bir gateway'e geçişte bu sınır
// 13-19 haneye genişletilmelidir (backend validatörü bu aralığı zaten destekler).
const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function PaymentPage() {
  const { orderId } = useParams();
  const { t } = useLang();
  const [card, setCard] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);
  const [paidOrder, setPaidOrder] = useState(null);

  const { data, loading, error, refetch } = useFetch(() => getOrder(orderId), [orderId]);

  if (loading) return <Loader label={t.LOADING_ORDER} />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const order = paidOrder || data.order;
  const payable = ['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(order.status);

  // Ödeme tamamlandıysa başarı ekranı
  if (paidOrder) {
    return (
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 8 }}>{t.PAYMENT_SUCCESS_TITLE}</h1>
        <p className="muted" style={{ marginBottom: 16 }}>
          {t.PAYMENT_SUCCESS_DETAIL(paidOrder._id.slice(-8).toUpperCase())}
        </p>
        <StatusBadge status={paidOrder.status} />
        <div style={{ marginTop: 20 }}>
          <Link to="/orders" className="btn btn-primary">{t.BTN_GO_ORDERS}</Link>
        </div>
      </div>
    );
  }

  if (!payable) {
    return (
      <div className="card auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>{t.ORDER_NOT_PAYABLE_TITLE}</h1>
        <StatusBadge status={order.status} />
        <p className="muted" style={{ margin: '12px 0 20px' }}>{t.ORDER_NOT_PAYABLE_HINT}</p>
        <Link to="/orders" className="btn btn-outline">{t.BTN_BACK_ORDERS}</Link>
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
        setPayError(t.PAYMENT_FAILED_RETRY(res.message));
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
        <h1>{t.PAGE_PAYMENT}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="payment-layout">
        <div className="card">
          <div className="test-cards">
            <strong>{t.TEST_CARDS_TITLE}</strong> — {t.TEST_CARDS_SUCCESS}: <code>4242 4242 4242 4242</code> ·{' '}
            {t.TEST_CARDS_FAIL}: <code>4000 0000 0000 0000</code>
          </div>

          {payError && <div className="alert alert-error">{payError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="cardNumber">{t.FIELD_CARD_NUMBER}</label>
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
              <label htmlFor="cardHolder">{t.FIELD_CARD_HOLDER}</label>
              <input
                id="cardHolder"
                autoComplete="cc-name"
                placeholder={t.PH_CARD_HOLDER}
                value={card.cardHolder}
                onChange={(e) => setCard((p) => ({ ...p, cardHolder: e.target.value }))}
                required
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="expiry">{t.FIELD_EXPIRY}</label>
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
                <label htmlFor="cvv">{t.FIELD_CVV}</label>
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
              {paying ? t.BUSY_PAYING : t.BTN_PAY_AMOUNT(formatPrice(order.totalPrice))}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 10 }}>{t.ORDER_SUMMARY}</h3>
          {order.items.map((item, index) => (
            <div className="summary-row" key={index}>
              <span>{item.name} × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>{t.TOTAL_LABEL}</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
