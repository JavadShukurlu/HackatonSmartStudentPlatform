import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';
import { mockUsers } from './mockData';

/**
 * Users API.
 *   GET    /users                -> User[]
 *   POST   /users                -> User
 *   PATCH  /users/:id            -> User
 *   DELETE /users/:id            -> { ok: true }
 */

let cache = [...mockUsers];

export const usersService = {
  async list() {
    if (USE_MOCK) return mockDelay([...cache]);
    return axiosClient.get('/users');
  },

  async create(payload) {
    if (USE_MOCK) {
      const user = { id: `u_${Date.now()}`, createdAt: new Date().toISOString(), status: 'active', ...payload };
      cache = [user, ...cache];
      return mockDelay(user);
    }
    return axiosClient.post('/users', payload);
  },

  async update(id, payload) {
    if (USE_MOCK) {
      cache = cache.map((u) => (u.id === id ? { ...u, ...payload } : u));
      return mockDelay(cache.find((u) => u.id === id));
    }
    return axiosClient.patch(`/users/${id}`, payload);
  },

  async remove(id) {
    if (USE_MOCK) {
      cache = cache.filter((u) => u.id !== id);
      return mockDelay({ ok: true });
    }
    return axiosClient.delete(`/users/${id}`);
  },
};
