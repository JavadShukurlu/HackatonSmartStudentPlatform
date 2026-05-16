import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';
import { mockCourses } from './mockData';

/**
 * Courses API.
 *   GET    /courses
 *   POST   /courses
 *   PATCH  /courses/:id
 *   DELETE /courses/:id
 */

let cache = [...mockCourses];

export const coursesService = {
  async list() {
    if (USE_MOCK) return mockDelay([...cache]);
    return axiosClient.get('/courses');
  },
  async create(payload) {
    if (USE_MOCK) {
      const c = { id: `c_${Date.now()}`, enrolled: 0, status: 'available', ...payload };
      cache = [c, ...cache];
      return mockDelay(c);
    }
    return axiosClient.post('/courses', payload);
  },
};
