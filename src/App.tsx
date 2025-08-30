// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsConfig from './config/aws-config';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard/Dashboard';
import Customers from './pages/Customers/Customers';
import Calls from './pages/Calls/Calls';
import Analytics from './pages/Analytics/Analytics';
import FileUpload from './pages/FileUpload/FileUpload';
import Settings from './pages/Settings/Settings';
import AIReminderTest from './pages/AIReminderTest';
import Login from './pages/Login';

// Configure Amplify
Amplify.configure(awsConfig);

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: 8 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 6 },
      },
    },
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Authenticator.Provider>
        {({ signOut, user }) =>
          user ? (
            <Layout user={user} signOut={signOut}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/calls" element={<Calls />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/settings" element={<Settings />} />
                {/* NEW: AI Reminder (Test) */}
                <Route
                  path="/ai-reminder-test"
                  element={
                    <ProtectedRoute>
                      <AIReminderTest />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Login />
          )
        }
      </Authenticator.Provider>
    </Router>
  </ThemeProvider>
);

export default App;
