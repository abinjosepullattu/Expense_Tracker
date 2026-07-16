import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Grid, TextField, MenuItem, Stack, CircularProgress, Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import PageWrapper         from '../components/common/PageWrapper';
import CategoryPieChart    from '../charts/CategoryPieChart';
import { reportAPI, downloadBlob } from '../api/reportAPI';
import { formatCurrency, currentPeriod } from '../utils/formatters';

const darkInput = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366f1' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
  '& .MuiInputLabel-root': { color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
  '& .MuiSelect-icon': { color: '#64748b' },
};

export default function ReportsPage() {
  const { month: curMonth, year: curYear } = currentPeriod();
  const [month,   setMonth]   = useState(curMonth);
  const [year,    setYear]    = useState(curYear);
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [dlLoading, setDlLoading] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await reportAPI.monthly({ month, year });
      setReport(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, []); // eslint-disable-line

  const handleExport = async (type) => {
    setDlLoading(type);
    try {
      let res, filename;
      if (type === 'pdf') {
        res = await reportAPI.exportPDF({ month, year });
        filename = `report_${month}_${year}.pdf`;
      } else if (type === 'csv') {
        res = await reportAPI.exportCSV({ month, year });
        filename = `transactions_${month}_${year}.csv`;
      } else {
        res = await reportAPI.exportExcel({ month, year });
        filename = `transactions_${month}_${year}.xlsx`;
      }
      downloadBlob(res.data, filename);
    } catch (e) { console.error(e); }
    finally { setDlLoading(''); }
  };

  return (
    <PageWrapper>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="white">Reports</Typography>
        <Typography variant="body2" color="text.secondary">Financial analytics and export</Typography>
      </Box>

      {/* Filter bar */}
      <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField select size="small" label="Month" value={month}
              onChange={(e) => setMonth(e.target.value)} sx={{ width: 160, ...darkInput }}>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
            <TextField size="small" label="Year" type="number" value={year}
              onChange={(e) => setYear(Number(e.target.value))} sx={{ width: 120, ...darkInput }} />
            <Button variant="contained" onClick={fetchReport}
              sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}>
              Generate
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#334155' }} />
            <Stack direction="row" spacing={1}>
              {['pdf', 'csv', 'excel'].map((t) => (
                <Button key={t} size="small" variant="outlined" startIcon={<DownloadIcon />}
                  disabled={dlLoading === t} onClick={() => handleExport(t)}
                  sx={{ borderColor: '#334155', color: '#94a3b8', borderRadius: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {dlLoading === t ? <CircularProgress size={14} /> : t}
                </Button>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : report && (
        <Grid container spacing={3}>
          {/* Summary */}
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} color="white" sx={{ mb: 2 }}>
                  📊 Summary
                </Typography>
                <Stack spacing={2}>
                  {[
                    { label: 'Total Income',   value: report.total_income,   color: '#4ade80', icon: <TrendingUpIcon sx={{ color: '#4ade80' }} />, bg: '#22c55e11' },
                    { label: 'Total Expenses', value: report.total_expenses, color: '#f87171', icon: <TrendingDownIcon sx={{ color: '#f87171' }} />, bg: '#ef444411' },
                    { label: 'Net Savings',    value: report.savings,        color: '#818cf8', icon: <AccountBalanceWalletIcon sx={{ color: '#818cf8' }} />, bg: '#6366f111' },
                  ].map((item) => (
                    <Box 
                      key={item.label} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        borderRadius: 2.5, 
                        bgcolor: item.bg, 
                        border: '1px solid #33415566',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          borderColor: '#6366f133'
                        }
                      }}
                    >
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#0f172a88', display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={750} color={item.color} sx={{ lineHeight: 1.2, mt: 0.5 }}>
                          {formatCurrency(item.value)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie chart */}
          <Grid item xs={12} md={7}>
            <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} color="white" sx={{ mb: 2 }}>
                  🍕 Spending by Category
                </Typography>
                <CategoryPieChart data={report.category_breakdown} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </PageWrapper>
  );
}
