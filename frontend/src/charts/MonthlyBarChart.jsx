import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

/**
 * Last 6 months income vs expenses bar chart.
 * data: [{ month: '2024-07-01', income: 45000, expense: 32000 }, ...]
 */
export default function MonthlyBarChart({ data = [] }) {
  const formatted = data.map((d) => ({
    month:   new Date(d.month).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    Income:  d.transaction_type === 'income'  ? parseFloat(d.total) : 0,
    Expense: d.transaction_type === 'expense' ? parseFloat(d.total) : 0,
  }));

  // Merge by month
  const merged = formatted.reduce((acc, cur) => {
    const existing = acc.find((a) => a.month === cur.month);
    if (existing) {
      if (cur.Income)  existing.Income  = cur.Income;
      if (cur.Expense) existing.Expense = cur.Expense;
    } else {
      acc.push({ ...cur });
    }
    return acc;
  }, []);

  if (!merged.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">No data available.</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={merged} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickFormatter={(v) => `${getCurrencySymbol()}${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0' }}
          formatter={(value) => formatCurrency(value)}
        />
        <Legend />
        <Bar dataKey="Income"  fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
