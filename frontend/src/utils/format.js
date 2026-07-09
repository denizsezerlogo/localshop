import { getCurrentLang } from '../i18n/LanguageContext';

const intlLocale = () => (getCurrentLang() === 'en' ? 'en-US' : 'tr-TR');

// Para birimi bir iş gerçeğidir (TRY), arayüz dilinden bağımsızdır;
// yalnızca sayı/tarih biçimi seçilen dile göre değişir.
export const formatPrice = (value) =>
  new Intl.NumberFormat(intlLocale(), { style: 'currency', currency: 'TRY' }).format(value ?? 0);

export const formatDate = (value) =>
  new Date(value).toLocaleDateString(intlLocale(), { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
