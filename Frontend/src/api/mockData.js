// Centralized mock data for development. Replace with real API responses
// once the backend is ready. Service files consume this data only when
// VITE_USE_MOCK=true so swapping to real endpoints does not affect UI.

import { ROLES } from '../utils/constants';

const firstNames = ['Aisha', 'Liam', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mia', 'Lucas', 'Zara', 'Yusuf', 'Sara', 'Omar', 'Lina', 'Adam', 'Maya', 'Idris', 'Hana', 'Karim', 'Nora', 'Bilal'];
const lastNames = ['Khan', 'Smith', 'Garcia', 'Hassan', 'Patel', 'Nguyen', 'Brown', 'Martin', 'Ali', 'Lopez', 'Wilson', 'Davis', 'Yilmaz', 'Park', 'Singh', 'Costa', 'Ibrahim'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (daysBack = 365) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
};

const fixedUsers = [
  {
    id: 'u_superadmin',
    fullName: 'Super Admin',
    email: 'superadmin@example.com',
    role: ROLES.SUPER_ADMIN,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    avatarUrl: null,
  },
  {
    id: 'u_admin',
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: ROLES.ADMIN,
    status: 'active',
    createdAt: '2024-01-02T00:00:00.000Z',
    avatarUrl: null,
  },
];

export const mockUsers = [
  ...fixedUsers,
  ...Array.from({ length: 30 }).map((_, i) => {
    const fullName = `${pick(firstNames)} ${pick(lastNames)}`;
    const role = i < 7 ? ROLES.TEACHER : ROLES.STUDENT;
    return {
      id: `u_${i + 1}`,
      fullName,
      email: `${fullName.toLowerCase().replace(/\s/g, '.')}@campus.edu`,
      role,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      createdAt: randomDate(420),
      avatarUrl: null,
    };
  }),
];

export const mockCourses = [
  { id: 'c_1', name: 'Intro to Computer Science', teacher: 'Dr. Aisha Khan', credits: 3, capacity: 60, enrolled: 58 },
  { id: 'c_2', name: 'Linear Algebra',           teacher: 'Prof. Liam Smith', credits: 4, capacity: 40, enrolled: 40 },
  { id: 'c_3', name: 'Data Structures',          teacher: 'Dr. Omar Hassan',  credits: 3, capacity: 50, enrolled: 47 },
  { id: 'c_4', name: 'Operating Systems',        teacher: 'Prof. Mia Garcia', credits: 4, capacity: 45, enrolled: 30 },
  { id: 'c_5', name: 'Databases',                teacher: 'Dr. Sara Ali',     credits: 3, capacity: 55, enrolled: 55 },
  { id: 'c_6', name: 'Machine Learning',         teacher: 'Prof. Noah Park',  credits: 4, capacity: 35, enrolled: 22 },
  { id: 'c_7', name: 'Web Engineering',          teacher: 'Dr. Lina Costa',   credits: 3, capacity: 50, enrolled: 38 },
  { id: 'c_8', name: 'Computer Networks',        teacher: 'Prof. Karim Patel',credits: 3, capacity: 45, enrolled: 41 },
].map((c) => ({
  ...c,
  status: c.enrolled >= c.capacity ? 'full' : 'available',
}));

const studentUsers = mockUsers.filter((u) => u.role === ROLES.STUDENT);

export const mockGrades = Array.from({ length: 24 }).map((_, i) => {
  const student = studentUsers[i % studentUsers.length];
  const course = mockCourses[i % mockCourses.length];
  const score = Math.floor(50 + Math.random() * 50);
  return {
    id: `g_${i + 1}`,
    studentId: student.id,
    studentName: student.fullName,
    courseId: course.id,
    courseName: course.name,
    score,
    date: randomDate(180),
  };
});

export const mockNotifications = Array.from({ length: 14 }).map((_, i) => ({
  id: `n_${i + 1}`,
  title: [
    'System maintenance scheduled',
    'New course published',
    'Grades submitted',
    'Enrollment window opens',
    'Policy update',
  ][i % 5],
  message: 'Tap to view details about this notification and the action it requires.',
  read: Math.random() > 0.4,
  createdAt: randomDate(45),
  type: ['info', 'success', 'warning'][i % 3],
}));

export const mockActivities = Array.from({ length: 8 }).map((_, i) => ({
  id: `a_${i + 1}`,
  user: pick(mockUsers).fullName,
  action: ['enrolled in', 'submitted assignment for', 'received grade in', 'dropped'][i % 4],
  target: pick(mockCourses).name,
  at: randomDate(10),
}));

export const mockEnrollmentSeries = [
  { month: 'Jan', enrollments: 120, dropouts: 8 },
  { month: 'Feb', enrollments: 180, dropouts: 12 },
  { month: 'Mar', enrollments: 220, dropouts: 9 },
  { month: 'Apr', enrollments: 260, dropouts: 14 },
  { month: 'May', enrollments: 310, dropouts: 11 },
  { month: 'Jun', enrollments: 280, dropouts: 18 },
  { month: 'Jul', enrollments: 340, dropouts: 7 },
  { month: 'Aug', enrollments: 410, dropouts: 10 },
];

export const mockGpaDistribution = [
  { name: 'A', value: 120 },
  { name: 'B', value: 240 },
  { name: 'C', value: 180 },
  { name: 'D', value: 60 },
  { name: 'F', value: 20 },
];

export const mockAnnouncements = Array.from({ length: 20 }).map((_, i) => ({
  id: `ann_${i + 1}`,
  title: [
    'Final Exam Schedule Released',
    'Campus Library Extended Hours',
    'Scholarship Application Open',
    'New Course Registration Period',
    'Annual Sports Day',
    'Cultural Festival 2024',
    'Wi-Fi Maintenance Notice',
    'Health Checkup Campaign',
    'Career Fair Registration',
    'Research Grant Opportunity',
  ][i % 10],
  category: ['Academic', 'Administrative', 'Events', 'Sports', 'Cultural', 'General'][i % 6],
  createdAt: randomDate(60),
  status: ['pending', 'approved', 'rejected'][i % 3],
  author: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
}));

export const mockEvents = Array.from({ length: 15 }).map((_, i) => ({
  id: `evt_${i + 1}`,
  title: [
    'Annual Science Fair',
    'Programming Hackathon',
    'Cultural Night 2024',
    'Sports Championship',
    'Career Expo',
    'Workshop: AI & ML Basics',
    'Student Council Elections',
    'Alumni Meetup',
    'Debate Competition',
    'Art Exhibition',
  ][i % 10],
  description: 'Open to all students and faculty. Pre-registration required via the student portal.',
  date: randomDate(120),
  status: ['upcoming', 'ongoing', 'completed', 'cancelled'][i % 4],
}));

export const mockLostFound = Array.from({ length: 12 }).map((_, i) => ({
  id: `lf_${i + 1}`,
  title: ['Black Laptop Bag', 'Student ID Card', 'Key Bundle', 'Scientific Calculator', 'Water Bottle', 'Notebook', 'Reading Glasses', 'Umbrella'][i % 8],
  contact: `${firstNames[i % firstNames.length].toLowerCase()}@example.com`,
  status: i % 2 === 0 ? 'lost' : 'found',
  date: randomDate(30),
  image: null,
  description: 'Please contact if found/available. Can arrange pickup on campus.',
}));

export const mockTeamFinder = Array.from({ length: 10 }).map((_, i) => ({
  id: `tf_${i + 1}`,
  title: ['Hackathon Team', 'ML Research Project', 'Mobile App Dev', 'AI Chatbot', 'E-commerce Platform', 'Game Dev Team'][i % 6],
  skills: [
    ['React', 'Node.js', 'MongoDB'],
    ['Python', 'TensorFlow', 'Data Analysis'],
    ['Flutter', 'Firebase', 'UI/UX'],
    ['Python', 'NLP', 'FastAPI'],
    ['Vue.js', 'Laravel', 'MySQL'],
    ['Unity', 'C#', 'Blender'],
  ][i % 6],
  createdAt: randomDate(45),
  membersNeeded: 2 + (i % 4),
  membersCount: 1 + (i % 3),
  creator: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
}));

const convUsers = [
  { id: 'cu_1', fullName: 'Aisha Khan',    email: 'aisha.khan@example.com',    role: ROLES.STUDENT, avatarUrl: null },
  { id: 'cu_2', fullName: 'Liam Smith',    email: 'liam.smith@example.com',    role: ROLES.TEACHER, avatarUrl: null },
  { id: 'cu_3', fullName: 'Omar Hassan',   email: 'omar.hassan@example.com',   role: ROLES.STUDENT, avatarUrl: null },
  { id: 'cu_4', fullName: 'Sara Ali',      email: 'sara.ali@example.com',      role: ROLES.TEACHER, avatarUrl: null },
  { id: 'cu_5', fullName: 'Noah Park',     email: 'noah.park@example.com',     role: ROLES.STUDENT, avatarUrl: null },
  { id: 'cu_6', fullName: 'Maya Singh',    email: 'maya.singh@example.com',    role: ROLES.STUDENT, avatarUrl: null },
];

const msgSamples = [
  ['Hello! I have a question about the exam schedule.', 'Sure, how can I help you?', 'When exactly is the CS final exam?'],
  ['I submitted my assignment, please review it.', 'Thank you, I will check it shortly.', 'Let me know if there are any issues.'],
  ['Is the library open on weekends?', 'Yes, from 9am to 6pm on weekends.', 'Perfect, thank you so much!'],
  ['Can I reschedule my presentation?', 'Yes, please email me the details.', 'I will send it right away!'],
];

export const mockConversations = convUsers.map((u, i) => ({
  id: `conv_${i + 1}`,
  user: u,
  lastMessage: msgSamples[i % msgSamples.length][2],
  lastAt: randomDate(3),
  unread: i < 2,
  messages: [
    { id: `msg_${i}_1`, from: 'them', text: msgSamples[i % msgSamples.length][0], at: randomDate(3) },
    { id: `msg_${i}_2`, from: 'me',   text: msgSamples[i % msgSamples.length][1], at: randomDate(2) },
    { id: `msg_${i}_3`, from: 'them', text: msgSamples[i % msgSamples.length][2], at: randomDate(1) },
  ],
}));

export const mockUserGrowth = [
  { month: 'Jan', users: 45,  students: 32, teachers: 8 },
  { month: 'Feb', users: 78,  students: 58, teachers: 11 },
  { month: 'Mar', users: 110, students: 82, teachers: 14 },
  { month: 'Apr', users: 143, students: 108, teachers: 16 },
  { month: 'May', users: 182, students: 138, teachers: 18 },
  { month: 'Jun', users: 210, students: 160, teachers: 20 },
  { month: 'Jul', users: 248, students: 190, teachers: 22 },
  { month: 'Aug', users: 295, students: 228, teachers: 24 },
];

export const mockPostStats = [
  { month: 'Jan', announcements: 12, events: 5, lostFound: 8, teamFinder: 3 },
  { month: 'Feb', announcements: 18, events: 8, lostFound: 11, teamFinder: 6 },
  { month: 'Mar', announcements: 24, events: 12, lostFound: 9, teamFinder: 8 },
  { month: 'Apr', announcements: 20, events: 10, lostFound: 14, teamFinder: 5 },
  { month: 'May', announcements: 30, events: 15, lostFound: 18, teamFinder: 10 },
  { month: 'Jun', announcements: 26, events: 11, lostFound: 12, teamFinder: 7 },
  { month: 'Jul', announcements: 35, events: 18, lostFound: 20, teamFinder: 12 },
  { month: 'Aug', announcements: 40, events: 22, lostFound: 16, teamFinder: 15 },
];

export const computeStats = () => {
  const totalUsers = mockUsers.length;
  const totalStudents = mockUsers.filter((u) => u.role === ROLES.STUDENT).length;
  const totalTeachers = mockUsers.filter((u) => u.role === ROLES.TEACHER).length;
  const totalCourses = mockCourses.length;
  const avg = mockGrades.reduce((s, g) => s + g.score, 0) / Math.max(mockGrades.length, 1);
  const averageGpa = +(avg / 25).toFixed(2);
  const totalEnrollments = mockCourses.reduce((s, c) => s + c.enrolled, 0);
  const totalAnnouncements = mockAnnouncements.length;
  const totalEvents = mockEvents.length;
  const totalLostFound = mockLostFound.length;
  const totalTeamFinder = mockTeamFinder.length;
  return {
    totalUsers, totalStudents, totalTeachers, totalCourses,
    averageGpa, totalEnrollments,
    totalAnnouncements, totalEvents, totalLostFound, totalTeamFinder,
  };
};
