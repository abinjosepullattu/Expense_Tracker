import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider }           from './context/AuthContext';
import ProtectedRoute             from './components/common/ProtectedRoute';
import LoginPage                  from './pages/LoginPage';
import RegisterPage               from './pages/RegisterPage';
import DashboardPage              from './pages/DashboardPage';
import TransactionsPage           from './pages/TransactionsPage';
import AddEditTransactionPage     from './pages/AddEditTransactionPage';
import BudgetsPage                from './pages/BudgetsPage';
import ReportsPage                from './pages/ReportsPage';
import ProfilePage                from './pages/ProfilePage';

// ── Dark Theme ────────────────────────────────────────────────────────────────
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#6366f1' },
    secondary:  { main: '#8b5cf6' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text:       { primary: '#e2e8f0', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes — require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/"                      element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"             element={<DashboardPage />} />
              <Route path="/transactions"          element={<TransactionsPage />} />
              <Route path="/transactions/add"      element={<AddEditTransactionPage />} />
              <Route path="/transactions/:id/edit" element={<AddEditTransactionPage />} />
              <Route path="/budgets"               element={<BudgetsPage />} />
              <Route path="/reports"               element={<ReportsPage />} />
              <Route path="/profile"               element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
