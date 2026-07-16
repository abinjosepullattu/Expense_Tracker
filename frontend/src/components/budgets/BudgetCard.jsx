import {
  Box, LinearProgress, Typography, Chip, Card, CardContent,
} from '@mui/material';
import { formatCurrency } from '../../utils/formatters';

const STATUS_COLORS = {
  'Safe':        { bar: '#22c55e', chip: '#16a34a22', text: '#4ade80' },
  'Warning':     { bar: '#f59e0b', chip: '#d9770622', text: '#fbbf24' },
  'Over Budget': { bar: '#ef4444', chip: '#dc262622', text: '#f87171' },
};

export default function BudgetCard({ budget }) {
  const colors = STATUS_COLORS[budget.status] || STATUS_COLORS['Safe'];
  const pct    = Math.min(budget.utilization_pct, 100);

  return (
    <Card
      sx={{
        bgcolor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 3,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="span">
              {budget.category_detail?.icon}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {budget.category_detail?.name}
            </Typography>
          </Box>
          <Chip
            label={budget.status}
            size="small"
            sx={{
              bgcolor: colors.chip,
              color:   colors.text,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#0f172a',
            mb: 1.5,
            '& .MuiLinearProgress-bar': {
              bgcolor: colors.bar,
              borderRadius: 4,
            },
          }}
        />

        {/* Amounts */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Spent</Typography>
            <Typography variant="body2" fontWeight={600} color={colors.text}>
              {formatCurrency(budget.spent)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {budget.utilization_pct.toFixed(1)}%
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">Budget</Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {formatCurrency(budget.amount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
