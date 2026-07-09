import { describe, it, expect } from 'vitest';
import { tr } from '../src/constants/locales/tr.js';
import { en } from '../src/constants/locales/en.js';
import { t } from '../src/i18n/i18n.js';
import { api } from './helpers/api.js';

// Bu dosya veritabanı gerektirmez: katalog bütünlüğü ve dil çözümü test edilir.

describe('i18n katalogları', () => {
  it('tr ve en katalogları birebir aynı anahtarlara sahiptir', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(tr).sort());
  });

  it('parametreli mesajlar iki katalogda da aynı tipte (fonksiyon) tanımlıdır', () => {
    for (const key of Object.keys(tr)) {
      expect(typeof en[key], `'${key}' anahtarının tipi uyuşmuyor`).toBe(typeof tr[key]);
    }
  });

  it('t() bilinen anahtarı çevirir, bilinmeyen anahtarda anahtarın kendisine düşer', () => {
    expect(t('en', 'PRODUCT_NOT_FOUND')).toBe('Product not found');
    expect(t('tr', 'PRODUCT_NOT_FOUND')).toBe('Ürün bulunamadı');
    expect(t('tr', 'OLMAYAN_ANAHTAR')).toBe('OLMAYAN_ANAHTAR');
  });

  it('parametreli mesajlar argümanları işler', () => {
    expect(t('en', 'ORDER_STOCK_LEFT', 'Honey', 3)).toContain('Honey');
    expect(t('tr', 'ORDER_BAD_TRANSITION', 'PAID', 'DELIVERED')).toContain('PAID');
  });
});

describe('Accept-Language ile istek dili', () => {
  it('Accept-Language: en → hata mesajı İngilizce döner', async () => {
    const res = await api().get('/api/auth/me').set('Accept-Language', 'en');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('You need to sign in');
  });

  it('başlık yoksa varsayılan Türkçe döner', async () => {
    const res = await api().get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Giriş yapmanız gerekiyor');
  });

  it('en-US gibi bölgeli değerler de İngilizceye çözülür', async () => {
    const res = await api().get('/api/nope').set('Accept-Language', 'en-US,en;q=0.9');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Not found:');
  });
});
