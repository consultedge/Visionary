import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Phone from '@mui/icons-material/Phone';
import BarChart from '@mui/icons-material/BarChart';
import Settings from '@mui/icons-material/Settings';
// ✅ Added icon for AI Reminder
import Alarm from '@mui/icons-material/Alarm';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'File Upload', icon: <CloudUpload />, path: '/file-upload' },
    { text: 'Calls', icon: <Phone />, path: '/calls' },

    // ✅ New AI Reminder menu item
    { text: 'AI Reminder', icon: <Alarm />, path: '/ai-reminder' },

    { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '20px' }}>{children}</main>
    </div>
  );
};

export default Layout;
