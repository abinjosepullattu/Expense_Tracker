import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon     from '@mui/icons-material/Visibility';
import VisibilityOffIcon  from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login }      = useAuth();
  const navigate       = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
               || err.response?.data?.detail
               || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              💰
            </Typography>
            <Typography variant="h5" fontWeight={700} color="white">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Finance Tracker
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              required autoFocus
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your email"
              sx={{ mb: 2, ...darkInput }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              placeholder="Enter your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" sx={{ color: '#64748b' }}>
                      {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, ...darkInput }}
            />

            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              sx={{
                py: 1.5, borderRadius: 2, fontWeight: 700,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                '&:hover': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <RouterLink to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Register
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Shared dark‑theme input styles
const darkInput = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366f1' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
  '& .MuiInputLabel-root': { color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
};
