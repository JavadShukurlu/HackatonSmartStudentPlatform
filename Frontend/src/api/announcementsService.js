import { mockDelay } from './axiosClient';
import { mockAnnouncements } from './mockData';

/**
 * Announcements API.
 * Real endpoints (suggested):
 *   GET    /announcements          -> []
 *   PATCH  /announcements/:id      body: { status } -> updated item
 *   DELETE /announcements/:id
 */

let _items = [...mockAnnouncements];

export const announcementsService = {
  async list() {
    return mockDelay([..._items]);
  },
  async updateStatus(id, status) {
    _items = _items.map((a) => (a.id === id ? { ...a, status } : a));
    return mockDelay(_items.find((a) => a.id === id));
  },
  async remove(id) {
    _items = _items.filter((a) => a.id !== id);
    return mockDelay({ ok: true });
  },
};
