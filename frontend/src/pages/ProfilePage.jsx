import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress, Stack, Divider, Avatar, MenuItem,
} from '@mui/material';
import { useAuth }  from '../context/AuthContext';
import { authAPI }  from '../api/authAPI';
import PageWrapper  from '../components/common/PageWrapper';

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

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ first_name: '', last_name: '', phone: '', currency: 'INR' });
  const [pwdForm, setPwdForm] = useState({ old_password: '', new_password: '' });
  const [msg,     setMsg]     = useState('');
  const [err,     setErr]     = useState('');
  const [saving,  setSaving]  = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg,  setPwdMsg]  = useState('');
  const [pwdErr,  setPwdErr]  = useState('');

  useEffect(() => {
    authAPI.getProfile().then(({ data }) => {
      setProfile({
        first_name: data.first_name || '',
        last_name:  data.last_name  || '',
        phone:      data.phone      || '',
        currency:   data.currency   || 'INR',
      });
    });
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMsg(''); setErr(''); setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profile);
      updateUser(data);
      setMsg('Profile updated successfully!');
    } catch (error) {
      setErr('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg(''); setPwdErr(''); setPwdSaving(true);
    try {
      await authAPI.changePassword(pwdForm);
      setPwdMsg('Password changed successfully!');
      setPwdForm({ old_password: '', new_password: '' });
    } catch (error) {
      const d = error.response?.data;
      setPwdErr(d ? Object.values(d).flat().join(' ') : 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <PageWrapper>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="white">Profile</Typography>
        <Typography variant="body2" color="text.secondary">Manage your account settings</Typography>
      </Box>

      <Stack spacing={3} sx={{ maxWidth: 560 }}>
        {/* Profile Card */}
        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#6366f1', width: 56, height: 56, fontSize: '1.4rem' }}>
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" color="white" fontWeight={600}>
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#334155', mb: 3 }} />

            {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{msg}</Alert>}
            {err && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{err}</Alert>}

            <Box component="form" onSubmit={handleProfileSave}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="First Name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    sx={darkInput} />
                  <TextField fullWidth label="Last Name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    sx={darkInput} />
                </Stack>
                <TextField fullWidth label="Phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  sx={darkInput} />
                <TextField
                  select
                  fullWidth
                  label="Currency"
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                  sx={darkInput}
                >
                  <MenuItem value="INR">₹ INR (Indian Rupee)</MenuItem>
                  <MenuItem value="USD">$ USD (US Dollar)</MenuItem>
                  <MenuItem value="EUR">€ EUR (Euro)</MenuItem>
                  <MenuItem value="GBP">£ GBP (British Pound)</MenuItem>
                  <MenuItem value="CAD">$ CAD (Canadian Dollar)</MenuItem>
                  <MenuItem value="AUD">$ AUD (Australian Dollar)</MenuItem>
                  <MenuItem value="JPY">¥ JPY (Japanese Yen)</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" disabled={saving}
                  sx={{ borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', fontWeight: 600 }}>
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Profile'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card sx={{ bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="white" sx={{ mb: 3 }}>
              🔒 Change Password
            </Typography>

            {pwdMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{pwdMsg}</Alert>}
            {pwdErr && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{pwdErr}</Alert>}

            <Box component="form" onSubmit={handlePasswordChange}>
              <Stack spacing={2}>
                <TextField fullWidth required label="Current Password" type="password"
                  value={pwdForm.old_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, old_password: e.target.value })}
                  sx={darkInput} />
                <TextField fullWidth required label="New Password" type="password"
                  value={pwdForm.new_password}
                  onChange={(e) => setPwdForm({ ...pwdForm, new_password: e.target.value })}
                  sx={darkInput} />
                <Button type="submit" variant="outlined" disabled={pwdSaving}
                  sx={{ borderRadius: 2, borderColor: '#6366f1', color: '#6366f1', fontWeight: 600,
                    '&:hover': { borderColor: '#8b5cf6', bgcolor: '#6366f111' } }}>
                  {pwdSaving ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </PageWrapper>
  );
}
