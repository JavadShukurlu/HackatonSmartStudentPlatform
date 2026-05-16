import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';
import { mockGrades } from './mockData';

/**
 * Grades API.
 *   GET    /grades
 *   POST   /grades              body: { studentId, courseId, score }
 *   DELETE /grades/:id
 */

let cache = [...mockGrades];

export const gradesService = {
  async list() {
    if (USE_MOCK) return mockDelay([...cache]);
    return axiosClient.get('/grades');
  },

  async create(payload) {
    if (USE_MOCK) {
      const grade = {
        id: `g_${Date.now()}`,
        date: new Date().toISOString(),
        ...payload,
      };
      cache = [grade, ...cache];
      return mockDelay(grade);
    }
    return axiosClient.post('/grades', payload);
  },

  async remove(id) {
    if (USE_MOCK) {
      cache = cache.filter((g) => g.id !== id);
      return mockDelay({ ok: true });
    }
    return axiosClient.delete(`/grades/${id}`);
  },
};
