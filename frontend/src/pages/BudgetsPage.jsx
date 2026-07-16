import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, IconButton, Stack,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import PageWrapper      from '../components/common/PageWrapper';
import BudgetCard       from '../components/budgets/BudgetCard';
import { budgetAPI }    from '../api/budgetAPI';
import { categoryAPI }  from '../api/transactionAPI';
import { currentPeriod } from '../utils/formatters';

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

const DEFAULT_FORM = { category: '', amount: '', month: '', year: '' };

export default function BudgetsPage() {
  const { month, year } = currentPeriod();
  const [budgets,     setBudgets]    = useState([]);
  const [categories,  setCategories] = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [open,        setOpen]       = useState(false);
  const [editId,      setEditId]     = useState(null);
  const [form,        setForm]       = useState({ ...DEFAULT_FORM, month, year });
  const [error,       setError]      = useState('');
  const [saving,      setSaving]     = useState(false);
  const [deleteId,    setDeleteId]   = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await budgetAPI.list({ month, year });
      setBudgets(data.results || data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => {
    fetchBudgets();
    categoryAPI.list().then(({ data }) => setCategories(data.results || data));
  }, [fetchBudgets]);

  const openCreate = () => { setEditId(null); setForm({ ...DEFAULT_FORM, month, year }); setError(''); setOpen(true); };
  const openEdit   = (b)  => {
    setEditId(b.id);
    setForm({ category: b.category, amount: b.amount, month: b.month, year: b.year });
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      editId
        ? await budgetAPI.update(editId, form)
        : await budgetAPI.create(form);
      setOpen(false);
      fetchBudgets();
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(' ') : 'Failed to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <PageWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">Budgets</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
          sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}>
          Add Budget
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : budgets.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8, color: '#64748b' }}>
          <Typography variant="h6">No budgets set for this month.</Typography>
          <Typography variant="body2">Click "Add Budget" to set spending limits.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {budgets.map((b) => (
            <Grid item xs={12} sm={6} md={4} key={b.id}>
              <Box sx={{ position: 'relative' }}>
                <BudgetCard budget={b} />
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => openEdit(b)}
                    sx={{ color: '#6366f1', bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(b.id)}
                    sx={{ color: '#ef4444', bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          {editId ? 'Edit Budget' : 'Add Budget'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField select fullWidth required label="Category"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} sx={darkInput}>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.icon} {c.name}</MenuItem>
              ))}
            </TextField>
            <TextField fullWidth required label="Budget Amount (₹)" type="number"
              value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} sx={darkInput} />
            <Stack direction="row" spacing={2}>
              <TextField select fullWidth required label="Month" value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })} sx={darkInput}>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth required label="Year" type="number"
                value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} sx={darkInput} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to delete this budget limit? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (deleteId) {
                try {
                  await budgetAPI.remove(deleteId);
                  setDeleteId(null);
                  fetchBudgets();
                } catch (e) {
                  console.error(e);
                  alert('Failed to delete budget. Please try again.');
                }
              }
            }}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
