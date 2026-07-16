import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  MenuItem, Alert, CircularProgress, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PageWrapper     from '../components/common/PageWrapper';
import { transactionAPI, categoryAPI } from '../api/transactionAPI';

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

export default function AddEditTransactionPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  const [form, setForm] = useState({
    transaction_type: 'expense', category: '', amount: '',
    description: '', date: new Date().toISOString().split('T')[0],
  });
  const [categories, setCategories] = useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryAPI.list().then(({ data }) => setCategories(data.results || data));

    if (isEdit) {
      transactionAPI.get(id).then(({ data }) => {
        setForm({
          transaction_type: data.transaction_type,
          category:         data.category || '',
          amount:           data.amount,
          description:      data.description,
          date:             data.date,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, category: form.category || null };
      isEdit
        ? await transactionAPI.update(id, payload)
        : await transactionAPI.create(payload);
      navigate('/transactions');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transactions')}
          sx={{ color: '#94a3b8', mb: 1.5 }}>
          Back to Transactions
        </Button>
        <Typography variant="h4" fontWeight={700} color="white">
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 600, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField select fullWidth required label="Type" name="transaction_type"
                value={form.transaction_type} onChange={handleChange} sx={darkInput}>
                <MenuItem value="income">💰 Income</MenuItem>
                <MenuItem value="expense">💸 Expense</MenuItem>
              </TextField>

              <TextField select fullWidth label="Category" name="category"
                value={form.category} onChange={handleChange} sx={darkInput}>
                <MenuItem value="">No Category</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField fullWidth required label="Amount (₹)" name="amount"
                type="number" inputProps={{ min: 0.01, step: 0.01 }}
                value={form.amount} onChange={handleChange} sx={darkInput} />

              <TextField fullWidth required label="Date" name="date"
                type="date" InputLabelProps={{ shrink: true }}
                value={form.date} onChange={handleChange} sx={darkInput} />

              <TextField fullWidth label="Description" name="description"
                multiline rows={3}
                value={form.description} onChange={handleChange} sx={darkInput} />

              <Button type="submit" fullWidth variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5, borderRadius: 2, fontWeight: 700,
                  background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                  '&:hover': { background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' },
                }}>
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : isEdit ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
