import { mockDelay } from './axiosClient';
import { mockLostFound } from './mockData';

/**
 * Lost & Found API.
 * Real endpoints (suggested):
 *   GET    /lost-found       -> []
 *   DELETE /lost-found/:id
 */

let _items = [...mockLostFound];

export const lostFoundService = {
  async list() {
    return mockDelay([..._items]);
  },
  async remove(id) {
    _items = _items.filter((i) => i.id !== id);
    return mockDelay({ ok: true });
  },
};
