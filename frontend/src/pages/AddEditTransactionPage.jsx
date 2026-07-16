import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  MenuItem, Alert, CircularProgress, Stack, InputAdornment,
  IconButton, Popover, Switch, FormControlLabel, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ArrowBackIcon  from '@mui/icons-material/ArrowBack';
import CalculateIcon  from '@mui/icons-material/Calculate';
import CloseIcon      from '@mui/icons-material/Close';

import PageWrapper     from '../components/common/PageWrapper';
import { transactionAPI, categoryAPI } from '../api/transactionAPI';
import { getCurrencySymbol } from '../utils/formatters';

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

const CURATED_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Pink', hex: '#ec4899' },
];

const CURATED_EMOJIS = [
  { char: '🍔', label: 'Food & Dining' },
  { char: '🚗', label: 'Transportation' },
  { char: '🛍️', label: 'Shopping' },
  { char: '🎬', label: 'Entertainment' },
  { char: '🏥', label: 'Healthcare' },
  { char: '💡', label: 'Utilities' },
  { char: '🎁', label: 'Gifts' },
  { char: '✈️', label: 'Travel' },
  { char: '📚', label: 'Education' },
  { char: '💼', label: 'Work' },
  { char: '🎮', label: 'Gaming' },
  { char: '💰', label: 'Savings & Income' },
  { char: '📦', label: 'Others' },
];

export default function AddEditTransactionPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);

  // Forms
  const [form, setForm] = useState({
    transaction_type: 'expense', category: '', amount: '',
    description: '', date: new Date().toISOString().split('T')[0],
    is_bill: false, bill_due_date: '', bill_image: null,
  });
  const [categories, setCategories] = useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Category Dialog Builder
  const [catOpen, setCatOpen]     = useState(false);
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError]   = useState('');
  const [newCat, setNewCat]       = useState({ name: '', icon: '📦', color: '#6366f1' });

  // Floating Calculator Pad
  const [calcAnchor, setCalcAnchor] = useState(null);
  const [calcExpr, setCalcExpr]     = useState('');
  const [calcResult, setCalcResult] = useState('');

  const fetchCats = async () => {
    try {
      const { data } = await categoryAPI.list();
      setCategories(data.results || data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCats();

    if (isEdit) {
      transactionAPI.get(id).then(({ data }) => {
        setForm({
          transaction_type: data.transaction_type,
          category:         data.category || '',
          amount:           data.amount,
          description:      data.description,
          date:             data.date,
          is_bill:          data.is_bill || false,
          bill_due_date:    data.bill_due_date || '',
          bill_image:       data.bill_image || null,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) => {
    if (e.target.value === 'NEW_CAT') {
      setCatOpen(true);
    } else {
      setForm({ ...form, category: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, bill_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { 
        ...form, 
        category: form.category || null,
        bill_due_date: form.is_bill ? (form.bill_due_date || null) : null,
        bill_image: form.is_bill ? form.bill_image : null
      };
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

  // Inline Category Creator
  const handleCreateCategory = async () => {
    if (!newCat.name.trim()) return setCatError('Name is required.');
    setCatSaving(true);
    setCatError('');
    try {
      const { data } = await categoryAPI.create({
        name: newCat.name.trim(),
        icon: newCat.icon,
        color_hex: newCat.color
      });
      await fetchCats();
      setForm((prev) => ({ ...prev, category: data.id }));
      setCatOpen(false);
      setNewCat({ name: '', icon: '📦', color: '#6366f1' });
    } catch (err) {
      setCatError('Failed to create category.');
    } finally {
      setCatSaving(false);
    }
  };

  // Calculator Logic
  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcExpr('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        if (!calcExpr) return;
        if (!/^[0-9.+\-*/\(\)\s]+$/.test(calcExpr)) {
          setCalcResult('Error');
          return;
        }
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return ${calcExpr}`);
        const res = fn();
        setCalcResult(isFinite(res) ? String(Number(res).toFixed(2)) : 'Error');
      } catch (e) {
        setCalcResult('Error');
      }
    } else if (val === '⌫') {
      setCalcExpr((prev) => prev.slice(0, -1));
    } else {
      setCalcExpr((prev) => prev + val);
    }
  };

  const handleCalcUse = () => {
    const finalAmount = calcResult && calcResult !== 'Error' ? calcResult : calcExpr;
    if (finalAmount && !isNaN(finalAmount)) {
      setForm((prev) => ({ ...prev, amount: parseFloat(finalAmount).toFixed(2) }));
    }
    setCalcAnchor(null);
  };

  return (
    <PageWrapper>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transactions')}
          sx={{ color: '#94a3b8', mb: 1.5 }}>
          Back
        </Button>
        <Typography variant="h4" fontWeight={700} color="white">
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 600, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField select fullWidth required label="Type" name="transaction_type"
                value={form.transaction_type} onChange={handleChange} sx={darkInput}>
                <MenuItem value="income">💰 Income</MenuItem>
                <MenuItem value="expense">💸 Expense</MenuItem>
              </TextField>

              {/* Category Widget */}
              <TextField select fullWidth label="Category" name="category"
                value={form.category} onChange={handleCategoryChange} sx={darkInput}>
                <MenuItem value="">No Category</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </MenuItem>
                ))}
                <MenuItem value="NEW_CAT" sx={{ color: '#818cf8', fontWeight: 600, borderTop: '1px solid #334155', mt: 1 }}>
                  ＋ Add Custom Category...
                </MenuItem>
              </TextField>

              {/* Amount with Popover Calculator Adornment */}
              <TextField 
                fullWidth 
                required 
                label={`Amount (${getCurrencySymbol()})`} 
                name="amount"
                type="number" 
                inputProps={{ min: 0.01, step: 0.01 }}
                value={form.amount} 
                onChange={handleChange} 
                sx={darkInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span style={{ color: '#94a3b8' }}>{getCurrencySymbol()}</span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={(e) => setCalcAnchor(e.currentTarget)} 
                        sx={{ color: '#818cf8' }}
                      >
                        <CalculateIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Calculator Popover */}
              <Popover
                open={Boolean(calcAnchor)}
                anchorEl={calcAnchor}
                onClose={() => setCalcAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: { 
                    p: 2.5, 
                    width: 260, 
                    bgcolor: '#1e293b', 
                    border: '1px solid #334155', 
                    borderRadius: 3,
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <Stack spacing={1.5}>
                  <Box sx={{ bgcolor: '#0f172a', p: 1.5, borderRadius: 2, textAlign: 'right', minHeight: 46 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all' }}>
                      {calcExpr || '0'}
                    </Typography>
                    {calcResult && (
                      <Typography variant="body1" fontWeight={700} color="#4ade80">
                        = {calcResult}
                      </Typography>
                    )}
                  </Box>
                  <Grid container spacing={1}>
                    {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+'].map((char) => (
                      <Grid item xs={3} key={char}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          onClick={() => handleCalcClick(char)}
                          sx={{ 
                            height: 40, 
                            minWidth: 0, 
                            color: isNaN(char) && char !== '.' ? '#f59e0b' : 'white',
                            borderColor: '#334155',
                            '&:hover': { bgcolor: '#334155', borderColor: '#4f46e5' }
                          }}
                        >
                          {char}
                        </Button>
                      </Grid>
                    ))}
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" onClick={() => handleCalcClick('⌫')} 
                        sx={{ height: 40, borderColor: '#334155', color: '#f87171' }}>
                        ⌫
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button fullWidth variant="outlined" onClick={() => handleCalcClick('=')} 
                        sx={{ height: 40, borderColor: '#22c55e', color: '#4ade80' }}>
                        =
                      </Button>
                    </Grid>
                  </Grid>
                  <Button fullWidth variant="contained" onClick={handleCalcUse}
                    sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }}}>
                    Insert Amount
                  </Button>
                </Stack>
              </Popover>

              <TextField fullWidth required label="Date" name="date"
                type="date" InputLabelProps={{ shrink: true }}
                value={form.date} onChange={handleChange} sx={darkInput} />

              {/* Bill Details Slide Switch */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={form.is_bill} 
                      onChange={(e) => setForm({ ...form, is_bill: e.target.checked })} 
                      color="primary" 
                    />
                  }
                  label={
                    <Typography color="white" fontWeight={500} fontSize="0.95rem">
                      Mark as Bill Payment / Invoice
                    </Typography>
                  }
                />
              </Box>

              {form.is_bill && (
                <Stack spacing={2} sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 2.5, border: '1px solid #1e293b' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    📅 Bill Details
                  </Typography>
                  <TextField 
                    fullWidth 
                    required={form.is_bill} 
                    label="Due Date" 
                    name="bill_due_date"
                    type="date" 
                    InputLabelProps={{ shrink: true }}
                    value={form.bill_due_date} 
                    onChange={handleChange} 
                    sx={darkInput} 
                  />
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderColor: '#4f46e5',
                        color: '#818cf8',
                        borderRadius: 2,
                        '&:hover': { borderColor: '#818cf8', bgcolor: '#6366f111' }
                      }}
                    >
                      📁 Upload Bill / Receipt
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    {form.bill_image && (
                      <Box sx={{ mt: 2, position: 'relative', width: 'fit-content', mx: 'auto' }}>
                        <img 
                          src={form.bill_image} 
                          alt="Bill Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 180, 
                            borderRadius: 8, 
                            border: '1px solid #334155',
                            display: 'block'
                          }} 
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => setForm((prev) => ({ ...prev, bill_image: '' }))} 
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            bgcolor: '#ef4444', 
                            color: 'white', 
                            '&:hover': { bgcolor: '#dc2626' },
                            boxShadow: 2
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Stack>
              )}

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
                  : isEdit ? 'Update Transaction' : 'Save Transaction'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Category Creation Modal Dialog */}
      <Dialog open={catOpen} onClose={() => setCatOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Custom Category
          <IconButton size="small" onClick={() => setCatOpen(false)} sx={{ color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {catError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{catError}</Alert>}
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              fullWidth 
              required 
              label="Category Name" 
              placeholder="e.g. Health & Gym"
              value={newCat.name} 
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} 
              sx={darkInput} 
            />
            
            <TextField 
              select 
              fullWidth 
              label="Icon Emoji"
              value={newCat.icon} 
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} 
              sx={darkInput}
            >
              {CURATED_EMOJIS.map((e) => (
                <MenuItem key={e.char} value={e.char}>{e.char} {e.label}</MenuItem>
              ))}
            </TextField>

            <TextField 
              select 
              fullWidth 
              label="Color Theme"
              value={newCat.color} 
              onChange={(e) => setNewCat({ ...newCat, color: e.target.value })} 
              sx={darkInput}
            >
              {CURATED_COLORS.map((c) => (
                <MenuItem key={c.hex} value={c.hex}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: c.hex }} />
                    <Typography fontSize="0.9rem" color="inherit">{c.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setCatOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateCategory} 
            disabled={catSaving}
            sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}
          >
            {catSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
