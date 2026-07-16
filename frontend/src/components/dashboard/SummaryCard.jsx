import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import TrendingUpIcon   from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency } from '../../utils/formatters';

/**
 * Summary card for the dashboard.
 * Props: label, value (number), icon (node), color (hex), trend (optional)
 */
export default function SummaryCard({ label, value, icon, color, trend, isPercent }) {
  const isPositive = trend >= 0;

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        border:     `1px solid ${color}33`,
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform:  'translateY(-4px)',
          boxShadow: `0 8px 30px ${color}33`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Box
            sx={{
              width: 40, height: 40,
              borderRadius: 2,
              bgcolor: `${color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: color,
              fontSize: '1.2rem',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
          {isPercent ? `${value.toFixed(1)}%` : formatCurrency(value)}
        </Typography>

        {trend !== undefined && (
          <Chip
            icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${isPositive ? '+' : ''}${trend?.toFixed(1)}%`}
            size="small"
            sx={{
              bgcolor: isPositive ? '#16a34a22' : '#dc262622',
              color:   isPositive ? '#4ade80'   : '#f87171',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
