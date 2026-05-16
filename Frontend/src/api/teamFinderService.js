import { mockDelay } from './axiosClient';
import { mockTeamFinder } from './mockData';

/**
 * Team Finder API.
 * Real endpoints (suggested):
 *   GET    /team-finder      -> []
 *   DELETE /team-finder/:id
 */

let _items = [...mockTeamFinder];

export const teamFinderService = {
  async list() {
    return mockDelay([..._items]);
  },
  async remove(id) {
    _items = _items.filter((i) => i.id !== id);
    return mockDelay({ ok: true });
  },
};
