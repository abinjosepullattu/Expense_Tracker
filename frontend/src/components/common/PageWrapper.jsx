import { useState } from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography, Avatar, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

import DashboardIcon            from '@mui/icons-material/Dashboard';
import ReceiptLongIcon          from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon           from '@mui/icons-material/Assessment';
import PersonIcon               from '@mui/icons-material/Person';

const navItems = [
  { label: 'Dash',   icon: <DashboardIcon />,    path: '/dashboard' },
  { label: 'Txns',   icon: <ReceiptLongIcon />,  path: '/transactions' },
  { label: 'Budget', icon: <AccountBalanceWalletIcon />, path: '/budgets' },
  { label: 'Report', icon: <AssessmentIcon />,   path: '/reports' },
  { label: 'User',   icon: <PersonIcon />,       path: '/profile' },
];

export default function PageWrapper({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Find active nav index
  const activeIndex = navItems.findIndex(item => pathname.startsWith(item.path));
  const navValue = activeIndex !== -1 ? activeIndex : 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      
      {/* ── Desktop Sidebar (hidden on mobile) ────────────────────────── */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar />
      </Box>

      {/* ── Mobile Top AppBar (hidden on desktop) ────────────────────── */}
      <AppBar 
        position="fixed" 
        sx={{ 
          display: { xs: 'block', md: 'none' },
          bgcolor: '#1e293b', 
          borderBottom: '1px solid #334155',
          boxShadow: 'none',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
          <Typography variant="h6" fontWeight={700} color="#a5b4fc" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💰 FinTracker
          </Typography>
          <IconButton onClick={() => navigate('/profile')} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#6366f1', width: 34, height: 34, fontSize: '0.85rem' }}>
              {user?.first_name?.[0] || user?.username?.[0] || 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ── Main content area ────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          mt: { xs: 7, md: 0 }, // Offset content for top appbar on mobile
          mb: { xs: 7, md: 0 }, // Offset content for bottom navigation on mobile
          p: { xs: 2.5, md: 3 },
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* ── Mobile Bottom Navigation (hidden on desktop) ─────────────── */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          display: { xs: 'block', md: 'none' },
          borderTop: '1px solid #334155',
          zIndex: 1100,
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(10px)'
        }} 
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            navigate(navItems[newValue].path);
          }}
          sx={{
            bgcolor: 'transparent',
            height: 60,
            '& .MuiBottomNavigationAction-root': {
              color: '#94a3b8',
              py: 0.5,
              minWidth: 'auto',
              '&.Mui-selected': {
                color: '#818cf8',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.15)',
                  color: '#6366f1',
                }
              }
            }
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction 
              key={item.path} 
              label={item.label} 
              icon={item.icon} 
            />
          ))}
        </BottomNavigation>
      </Paper>

    </Box>
  );
}
