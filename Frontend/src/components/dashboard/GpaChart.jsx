import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

const COLORS = ['#dbb12f', '#c388c6', '#e6a36b', '#a892d8', '#8c7a3a'];

const GpaChart = ({ data = [] }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'rgba(15,23,42,0.95)', border: 'none', borderRadius: 12, color: '#e2e8f0', fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[10, 10, 4, 4]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default GpaChart;
