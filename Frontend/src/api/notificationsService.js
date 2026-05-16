import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';
import { mockNotifications } from './mockData';

/**
 * Notifications API.
 *   GET    /notifications
 *   POST   /notifications              body: { title, message, type }
 *   PATCH  /notifications/:id/read
 */

let cache = [...mockNotifications];

export const notificationsService = {
  async list() {
    if (USE_MOCK) return mockDelay([...cache]);
    return axiosClient.get('/notifications');
  },
  async send(payload) {
    if (USE_MOCK) {
      const n = {
        id: `n_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'info',
        ...payload,
      };
      cache = [n, ...cache];
      return mockDelay(n);
    }
    return axiosClient.post('/notifications', payload);
  },
  async markRead(id) {
    if (USE_MOCK) {
      cache = cache.map((n) => (n.id === id ? { ...n, read: true } : n));
      return mockDelay({ ok: true });
    }
    return axiosClient.patch(`/notifications/${id}/read`);
  },
};
