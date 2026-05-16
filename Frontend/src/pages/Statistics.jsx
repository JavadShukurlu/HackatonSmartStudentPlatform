import Card, { CardHeader } from '../components/ui/Card';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { mockUserGrowth, mockPostStats, mockGpaDistribution, mockEnrollmentSeries } from '../api/mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'rgba(15,15,30,0.85)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '12px',
  },
};

/** Statistics page — full charts overview of users, posts, events and grades. */
const Statistics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Statistics</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Platform-wide analytics and growth metrics.</p>
    </div>

    {/* Row 1 */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* User growth */}
      <Card>
        <CardHeader title="User Growth" subtitle="Monthly registered users breakdown" />
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={mockUserGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="users"    name="Total Users"    stroke="#6366f1" fill="url(#gradUsers)"    strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="students" name="Students"        stroke="#10b981" fill="url(#gradStudents)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="teachers" name="Teachers"        stroke="#f59e0b" fill="none"              strokeWidth={2} dot={false} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Post activity */}
      <Card>
        <CardHeader title="Post Activity" subtitle="Monthly announcements, events, lost & found" />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockPostStats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="announcements" name="Announcements" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="events"        name="Events"         fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lostFound"     name="Lost & Found"   fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="teamFinder"    name="Team Finder"    fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Row 2 */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Grade distribution pie */}
      <Card>
        <CardHeader title="Grade Distribution" subtitle="Across all courses" />
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={mockGpaDistribution}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {mockGpaDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Enrollment line chart */}
      <Card className="xl:col-span-2">
        <CardHeader title="Enrollment Overview" subtitle="Monthly enrollments vs dropouts" />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={mockEnrollmentSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="enrollments" name="Enrollments" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="dropouts"    name="Dropouts"    stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="5 4" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Row 3 — summary bar */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Team Finder Activity" subtitle="Monthly new team posts" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockPostStats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="teamFinder" name="Team Posts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardHeader title="Active User Trend" subtitle="Monthly active user count" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mockUserGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="users" name="Active Users" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

export default Statistics;
