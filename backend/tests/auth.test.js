import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDb, disconnectTestDb } from './helpers/db.js';
import { api, registerUser } from './helpers/api.js';

beforeAll(connectTestDb);
afterAll(disconnectTestDb);

describe('Auth', () => {
  it('customer kaydı 201 döner, token verir ve response parola içermez', async () => {
    const { res, token, user } = await registerUser({ name: 'Müşteri Bir', email: 'c1@test.dev', role: 'customer' });
    expect(res.status).toBe(201);
    expect(token).toBeTypeOf('string');
    expect(user.role).toBe('customer');
    expect(user).not.toHaveProperty('password');
  });

  it('aynı email ile ikinci kayıt 409 döner', async () => {
    const { res } = await registerUser({ name: 'Tekrar', email: 'c1@test.dev' });
    expect(res.status).toBe(409);
  });

  it('geçersiz body 400 döner (email formatı + kısa parola)', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'X', email: 'gecersiz', password: '1' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rol gönderilmezse varsayılan customer olur', async () => {
    const { user } = await registerUser({ name: 'Rolsüz', email: 'rolsuz@test.dev' });
    expect(user.role).toBe('customer');
  });

  it('yanlış parolayla login 401 döner', async () => {
    const res = await api().post('/api/auth/login').send({ email: 'c1@test.dev', password: 'yanlis-parola' });
    expect(res.status).toBe(401);
  });

  it('doğru bilgilerle login 200 + token döner', async () => {
    const res = await api().post('/api/auth/login').send({ email: 'c1@test.dev', password: 'sifre123' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTypeOf('string');
  });

  it('/me token ile doğru kullanıcıyı döner, tokensız 401 döner', async () => {
    const login = await api().post('/api/auth/login').send({ email: 'c1@test.dev', password: 'sifre123' });
    const me = await api().get('/api/auth/me').set('Authorization', `Bearer ${login.body.data.token}`);
    expect(me.status).toBe(200);
    expect(me.body.data.user.email).toBe('c1@test.dev');

    const noToken = await api().get('/api/auth/me');
    expect(noToken.status).toBe(401);
  });

  it('bozuk token 401 döner', async () => {
    const res = await api().get('/api/auth/me').set('Authorization', 'Bearer gecersiz.token.degeri');
    expect(res.status).toBe(401);
  });
});
