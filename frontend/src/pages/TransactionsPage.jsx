import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, Paper, Chip, IconButton,
  TextField, MenuItem, Stack, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import PageWrapper      from '../components/common/PageWrapper';
import { transactionAPI } from '../api/transactionAPI';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewBillTxn, setViewBillTxn] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    transaction_type: '', search: '', date_from: '', date_to: '',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )};
      const { data } = await transactionAPI.list(params);
      setTransactions(data.results);
      setCount(Math.ceil(data.count / 10));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">Transactions</Typography>
          <Typography variant="body2" color="text.secondary">Manage your income and expenses</Typography>
        </Box>
        <Button
          variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/transactions/add')}
          sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search transactions…"
          size="small" value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ flex: 1, ...darkInput }}
        />
        <TextField
          select size="small" label="Type" value={filters.transaction_type}
          onChange={(e) => { setFilters({ ...filters, transaction_type: e.target.value }); setPage(1); }}
          sx={{ width: 140, ...darkInput }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField
          type="date" size="small" label="From" InputLabelProps={{ shrink: true }}
          value={filters.date_from}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          sx={{ width: 160, ...darkInput }}
        />
        <TextField
          type="date" size="small" label="To" InputLabelProps={{ shrink: true }}
          value={filters.date_to}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          sx={{ width: 160, ...darkInput }}
        />
      </Stack>

      {/* Table (Desktop only) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <TableContainer
        component={Paper}
        sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { borderColor: '#334155', color: '#94a3b8', fontWeight: 600 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress sx={{ color: '#6366f1' }} />
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((txn) => (
                <TableRow
                  key={txn.id}
                  sx={{
                    '& td': { borderColor: '#1e293b', color: '#e2e8f0' },
                    '&:hover': { bgcolor: '#0f172a' },
                  }}
                >
                  <TableCell>{formatDate(txn.date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${txn.category_detail?.icon || ''} ${txn.category_detail?.name || 'N/A'}`}
                      size="small"
                      sx={{
                        bgcolor: `${txn.category_detail?.color_hex || '#6366f1'}22`,
                        color:    txn.category_detail?.color_hex || '#6366f1',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {txn.description || '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={txn.transaction_type}
                      size="small"
                      sx={{
                        bgcolor: txn.transaction_type === 'income' ? '#16a34a22' : '#dc262622',
                        color:   txn.transaction_type === 'income' ? '#4ade80'   : '#f87171',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{
                    fontWeight: 700,
                    color: txn.transaction_type === 'income' ? '#4ade80' : '#f87171',
                  }}>
                    {txn.transaction_type === 'expense' ? '- ' : '+ '}
                    {formatCurrency(txn.amount)}
                  </TableCell>
                  <TableCell align="center">
                    {txn.is_bill && (
                      <IconButton size="small" onClick={() => setViewBillTxn(txn)}
                        sx={{ color: '#818cf8', mr: 0.5 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => navigate(`/transactions/${txn.id}/edit`)}
                      sx={{ color: '#6366f1', mr: 0.5 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(txn.id)}
                      sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* List (Mobile only) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#6366f1' }} />
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3, p: 4, textAlign: 'center', color: '#64748b' }}>
            <Typography variant="body1">No transactions found.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {transactions.map((txn) => (
              <Box
                key={txn.id}
                sx={{
                  bgcolor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      label={`${txn.category_detail?.icon || ''} ${txn.category_detail?.name || 'N/A'}`}
                      size="small"
                      sx={{
                        bgcolor: `${txn.category_detail?.color_hex || '#6366f1'}22`,
                        color:    txn.category_detail?.color_hex || '#6366f1',
                        fontWeight: 650,
                        fontSize: '0.65rem',
                      }}
                    />
                    <Chip
                      label={txn.transaction_type}
                      size="small"
                      sx={{
                        bgcolor: txn.transaction_type === 'income' ? '#16a34a22' : '#dc262622',
                        color:   txn.transaction_type === 'income' ? '#4ade80'   : '#f87171',
                        fontWeight: 650,
                        fontSize: '0.65rem',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                  <Typography variant="body1" fontWeight={600} color="white" sx={{ mb: 0.5 }}>
                    {txn.description || '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(txn.date)}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      color: txn.transaction_type === 'income' ? '#4ade80' : '#f87171',
                      mb: 1,
                    }}
                  >
                    {txn.transaction_type === 'expense' ? '- ' : '+ '}
                    {formatCurrency(txn.amount)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {txn.is_bill && (
                      <IconButton
                        size="small"
                        onClick={() => setViewBillTxn(txn)}
                        sx={{ color: '#818cf8', bgcolor: '#0f172a', p: 0.75 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/transactions/${txn.id}/edit`)}
                      sx={{ color: '#6366f1', bgcolor: '#0f172a', p: 0.75 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(txn.id)}
                      sx={{ color: '#ef4444', bgcolor: '#0f172a', p: 0.75 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Pagination */}
      {count > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={count} page={page} onChange={(_, v) => setPage(v)}
            sx={{ '& .MuiPaginationItem-root': { color: '#94a3b8' } }}
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to delete this transaction? This action cannot be undone.
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
                  await transactionAPI.remove(deleteId);
                  setDeleteId(null);
                  fetchTransactions();
                } catch (e) {
                  console.error(e);
                  alert('Failed to delete transaction. Please try again.');
                }
              }
            }}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Bill Details Dialog */}
      <Dialog
        open={Boolean(viewBillTxn)}
        onClose={() => setViewBillTxn(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, pb: 1 }}>
          🧾 Bill Payment / Invoice Details
        </DialogTitle>
        <DialogContent>
          {viewBillTxn && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', pb: 1.5 }}>
                <Typography color="text.secondary">Category</Typography>
                <Typography color="white" fontWeight={600}>
                  {viewBillTxn.category_detail?.icon} {viewBillTxn.category_detail?.name || 'No Category'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', pb: 1.5 }}>
                <Typography color="text.secondary">Amount</Typography>
                <Typography 
                  fontWeight={700} 
                  color={viewBillTxn.transaction_type === 'income' ? '#4ade80' : '#f87171'}
                >
                  {formatCurrency(viewBillTxn.amount)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', pb: 1.5 }}>
                <Typography color="text.secondary">Transaction Date</Typography>
                <Typography color="white">{formatDate(viewBillTxn.date)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', pb: 1.5 }}>
                <Typography color="text.secondary">Bill Due Date</Typography>
                <Typography color="#f59e0b" fontWeight={600}>
                  {formatDate(viewBillTxn.bill_due_date)}
                </Typography>
              </Box>

              <Box sx={{ borderBottom: '1px solid #334155', pb: 1.5 }}>
                <Typography color="text.secondary" sx={{ mb: 0.5 }}>Description</Typography>
                <Typography color="white" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {viewBillTxn.description || 'No description provided.'}
                </Typography>
              </Box>

              <Box>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>Bill / Receipt Image</Typography>
                {viewBillTxn.bill_image ? (
                  <Box 
                    sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      border: '1px solid #334155',
                      bgcolor: '#0f172a',
                      display: 'flex',
                      justifyContent: 'center',
                      p: 1
                    }}
                  >
                    <img 
                      src={viewBillTxn.bill_image} 
                      alt="Bill Receipt" 
                      style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'contain' }} 
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 1, fontStyle: 'italic' }}>
                    No receipt image uploaded.
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setViewBillTxn(null)} variant="contained" sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, px: 3, borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}

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
