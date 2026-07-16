import { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, CircularProgress,
} from '@mui/material';
import TrendingUpIcon   from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon      from '@mui/icons-material/Savings';
import PercentIcon      from '@mui/icons-material/Percent';

import PageWrapper               from '../components/common/PageWrapper';
import SummaryCard               from '../components/dashboard/SummaryCard';
import MonthlyBarChart           from '../charts/MonthlyBarChart';
import CategoryPieChart          from '../charts/CategoryPieChart';
import { transactionAPI }        from '../api/transactionAPI';
import { reportAPI }             from '../api/reportAPI';
import { currentPeriod }         from '../utils/formatters';

export default function DashboardPage() {
  const { month, year } = currentPeriod();
  const [summary,    setSummary]    = useState(null);
  const [trend,      setTrend]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sumRes, trendRes, catRes] = await Promise.all([
          transactionAPI.summary(),
          transactionAPI.monthlyTrend(),
          reportAPI.monthly({ month, year }),
        ]);
        setSummary(sumRes.data);
        setTrend(trendRes.data);
        setCategories(catRes.data.category_breakdown || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [month, year]);

  const savingsPct = summary
    ? summary.total_income > 0
      ? ((summary.savings / summary.total_income) * 100)
      : 0
    : 0;

  return (
    <PageWrapper>
      {/* Header */}
      <Box sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h4" fontWeight={700} color="white">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your financial overview for {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Total Income"
                value={summary?.total_income || 0}
                icon={<TrendingUpIcon />}
                color="#22c55e"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Total Expenses"
                value={summary?.total_expenses || 0}
                icon={<TrendingDownIcon />}
                color="#ef4444"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Net Savings"
                value={summary?.savings || 0}
                icon={<SavingsIcon />}
                color="#6366f1"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                label="Savings Rate"
                value={savingsPct}
                icon={<PercentIcon />}
                color="#f59e0b"
                isPercent
              />
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} color="white" sx={{ mb: 2 }}>
                    📈 Income vs Expenses (6 Months)
                  </Typography>
                  <MonthlyBarChart data={trend} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} color="white" sx={{ mb: 2 }}>
                    🍕 Spending by Category
                  </Typography>
                  <CategoryPieChart data={categories} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </PageWrapper>
  );
}
