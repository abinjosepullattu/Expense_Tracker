import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Avatar, Chip,
} from '@mui/material';
import DashboardIcon    from '@mui/icons-material/Dashboard';
import ReceiptLongIcon  from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon   from '@mui/icons-material/Assessment';
import PersonIcon       from '@mui/icons-material/Person';
import LogoutIcon       from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

export const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard',    icon: <DashboardIcon />,    path: '/dashboard' },
  { label: 'Transactions', icon: <ReceiptLongIcon />,  path: '/transactions' },
  { label: 'Budgets',      icon: <AccountBalanceWalletIcon />, path: '/budgets' },
  { label: 'Reports',      icon: <AssessmentIcon />,   path: '/reports' },
  { label: 'Profile',      icon: <PersonIcon />,       path: '/profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} color="#a5b4fc">
          💰 FinTracker
        </Typography>
        <Typography variant="caption" color="#6366f1">
          Personal Finance
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* User info */}
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#6366f1', width: 36, height: 36, fontSize: '0.9rem' }}>
          {user?.first_name?.[0] || user?.username?.[0] || 'U'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {user?.first_name || user?.username}
          </Typography>
          <Typography variant="caption" color="#a5b4fc" noWrap>
            {user?.currency || 'INR'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  backgroundColor: active ? 'rgba(99,102,241,0.3)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(99,102,241,0.2)' },
                  transition: 'background 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: active ? '#a5b4fc' : '#94a3b8', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? '#e0e7ff' : '#cbd5e1',
                  }}
                />
                {active && (
                  <Box sx={{
                    width: 3, height: 24, borderRadius: 2,
                    bgcolor: '#6366f1', ml: 1,
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Logout */}
      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(239,68,68,0.15)' },
            }}
          >
            <ListItemIcon sx={{ color: '#f87171', minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.875rem', color: '#fca5a5' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
