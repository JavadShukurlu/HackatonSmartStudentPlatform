import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';

/**
 * Auth API.
 * Real endpoints (suggested):
 *   POST /auth/login    body: { email, password } -> { token, user }
 *   POST /auth/logout
 *   GET  /auth/me       -> { user }
 */

export const authService = {
  async login({ email, password }) {
    if (USE_MOCK) {
      // Demo credentials — share with backend dev for parity until real API is wired.
      if (email === 'superadmin@example.com' && password === '123456') {
        return mockDelay({
          token: 'mock-jwt-token-superadmin',
          user: {
            id: 'u_superadmin',
            fullName: 'Super Admin',
            email,
            role: 'superadmin',
            avatarUrl: null,
          },
        });
      }
      if (email === 'admin@example.com' && password === '123456') {
        return mockDelay({
          token: 'mock-jwt-token',
          user: {
            id: 'u_admin',
            fullName: 'Admin User',
            email,
            role: 'admin',
            avatarUrl: null,
          },
        });
      }
      return mockDelay(null, 400).then(() => {
        throw new Error('Invalid email or password');
      });
    }
    return axiosClient.post('/auth/login', { email, password });
  },

  async register({ fullName, email, password }) {
    if (USE_MOCK) {
      if (!fullName || !email || !password) {
        return mockDelay(null, 200).then(() => {
          throw new Error('All fields are required');
        });
      }
      return mockDelay({
        token: 'mock-jwt-token',
        user: {
          id: `u_${Math.random().toString(36).slice(2, 9)}`,
          fullName,
          email,
          role: 'admin',
          avatarUrl: null,
        },
      });
    }
    return axiosClient.post('/auth/register', { fullName, email, password });
  },

  async logout() {
    if (USE_MOCK) return mockDelay({ ok: true }, 150);
    return axiosClient.post('/auth/logout');
  },

  async me() {
    if (USE_MOCK) return mockDelay({ ok: true }, 100);
    return axiosClient.get('/auth/me');
  },
};
