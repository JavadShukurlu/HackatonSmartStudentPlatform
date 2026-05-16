import axiosClient, { USE_MOCK, mockDelay } from './axiosClient';
import {
  computeStats,
  mockActivities,
  mockEnrollmentSeries,
  mockGpaDistribution,
  mockUsers,
} from './mockData';
import { ROLES } from '../utils/constants';

/**
 * Dashboard API.
 *   GET /dashboard/stats          -> stat tiles
 *   GET /dashboard/activities     -> recent activities
 *   GET /dashboard/enrollments    -> chart series
 *   GET /dashboard/gpa            -> chart series
 *   GET /dashboard/latest-students
 */

export const dashboardService = {
  async stats() {
    if (USE_MOCK) return mockDelay(computeStats());
    return axiosClient.get('/dashboard/stats');
  },
  async activities() {
    if (USE_MOCK) return mockDelay(mockActivities);
    return axiosClient.get('/dashboard/activities');
  },
  async enrollments() {
    if (USE_MOCK) return mockDelay(mockEnrollmentSeries);
    return axiosClient.get('/dashboard/enrollments');
  },
  async gpa() {
    if (USE_MOCK) return mockDelay(mockGpaDistribution);
    return axiosClient.get('/dashboard/gpa');
  },
  async latestStudents() {
    if (USE_MOCK) {
      const items = mockUsers
        .filter((u) => u.role === ROLES.STUDENT)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      return mockDelay(items);
    }
    return axiosClient.get('/dashboard/latest-students');
  },
};
