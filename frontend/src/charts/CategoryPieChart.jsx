import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ec4899',
  '#3b82f6', '#10b981', '#8b5cf6', '#ef4444',
];

/**
 * Category-wise spending pie chart.
 * data: [{ category__name: 'Food & Dining', total: 8500 }, ...]
 */
export default function CategoryPieChart({ data = [] }) {
  if (!data.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">No expense data.</Typography>
      </Box>
    );
  }

  const chartData = data.map((d) => ({
    name:  d.category__name || 'Other',
    value: parseFloat(d.total),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
          formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
