import { Box } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

/**
 * Wraps protected pages — renders the sidebar + main content area.
 */
export default function PageWrapper({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${DRAWER_WIDTH}px`,
          p: 3,
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
