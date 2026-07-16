import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ec4899',
  '#3b82f6', '#10b981', '#8b5cf6', '#ef4444',
];

/**
 * Category-wise spending pie chart with details & rates.
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
    color: d.category__color_hex || null
  }));

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Dynamic Pie Chart */}
      <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={chartData.length > 1 ? 3 : 0}
              dataKey="value"
            >
              {chartData.map((d, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={d.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
              formatter={(v) => formatCurrency(v)}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend & Rate Details Checklist */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {chartData.map((d, index) => {
          const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : '0.0';
          const color = d.color || COLORS[index % COLORS.length];
          return (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                bgcolor: '#0f172a66', 
                px: 2, 
                py: 1, 
                borderRadius: 2, 
                border: '1px solid #33415555' 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                <Typography variant="body2" color="white" fontWeight={600}>{d.name}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="white" fontWeight={700}>
                  {formatCurrency(d.value)}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {pct}% share
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
