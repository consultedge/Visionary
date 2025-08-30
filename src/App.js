import AiReminder from './pages/AiReminder';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && <Navbar />}
      <Routes>
        {/* ...existing routes... */}

        <Route
          path="/ai-reminder"
          element={
            <ProtectedRoute>
              <AiReminder />
            </ProtectedRoute>
          }
        />

        {/* ...catch all etc... */}
      </Routes>
    </>
  );
}
