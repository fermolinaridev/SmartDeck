import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = ['#10b981', '#264fea', '#cbd5e1'];

export function ProgressChart({ stats }) {
  const novos = Math.max(0, stats.total - stats.seen);
  const data = [
    { name: 'Dominados', value: stats.mastered },
    { name: 'Em progresso', value: Math.max(0, stats.seen - stats.mastered) },
    { name: 'Novos', value: novos },
  ].filter((d) => d.value > 0);

  if (data.length === 0) data.push({ name: 'Novos', value: stats.total });

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
