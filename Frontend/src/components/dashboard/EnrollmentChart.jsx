import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';

const EnrollmentChart = ({ data = [] }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="enroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#dbb12f" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#dbb12f" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#c388c6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#c388c6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'rgba(15,23,42,0.95)', border: 'none', borderRadius: 12, color: '#e2e8f0', fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="enrollments" stroke="#dbb12f" strokeWidth={2.5} fill="url(#enroll)" />
        <Area type="monotone" dataKey="dropouts"    stroke="#c388c6" strokeWidth={2}   fill="url(#drop)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default EnrollmentChart;
