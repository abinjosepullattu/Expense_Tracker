import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

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

export default function RegisterPage() {
  const { register }   = useAuth();
  const navigate       = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', currency: 'INR',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%', maxWidth: 520,
          bgcolor: '#1e293b', border: '1px solid #334155',
          borderRadius: 4, boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>💰</Typography>
            <Typography variant="h5" fontWeight={700} color="white">Create Account</Typography>
            <Typography variant="body2" color="text.secondary">
              Start tracking your finances today
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="First Name" name="first_name"
                  value={form.first_name} onChange={handleChange} sx={darkInput} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Last Name" name="last_name"
                  value={form.last_name} onChange={handleChange} sx={darkInput} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Username" name="username"
                  value={form.username} onChange={handleChange} sx={darkInput} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Email" name="email" type="email"
                  value={form.email} onChange={handleChange} sx={darkInput} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="Password" name="password"
                  type="password" value={form.password} onChange={handleChange} sx={darkInput} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth required label="Confirm Password" name="password2"
                  type="password" value={form.password2} onChange={handleChange} sx={darkInput} />
              </Grid>
            </Grid>

            <Button
              type="submit" fullWidth variant="contained"
              disabled={loading}
              sx={{
                mt: 3, py: 1.5, borderRadius: 2, fontWeight: 700,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                '&:hover': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, textAlign: 'center' }}>
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
