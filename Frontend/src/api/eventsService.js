import { mockDelay } from './axiosClient';
import { mockEvents } from './mockData';

/**
 * Events API.
 * Real endpoints (suggested):
 *   GET    /events          -> []
 *   PATCH  /events/:id      body: { title, description, date, status } -> updated item
 *   DELETE /events/:id
 */

let _items = [...mockEvents];

export const eventsService = {
  async list() {
    return mockDelay([..._items]);
  },
  async update(id, payload) {
    _items = _items.map((e) => (e.id === id ? { ...e, ...payload } : e));
    return mockDelay(_items.find((e) => e.id === id));
  },
  async remove(id) {
    _items = _items.filter((e) => e.id !== id);
    return mockDelay({ ok: true });
  },
};
