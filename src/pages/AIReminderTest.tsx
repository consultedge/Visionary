import React, { useEffect } from 'react';

const AIReminderTest: React.FC = () => {
  // On mount, load the login page or client form depending on sessionStorage
  useEffect(() => {
    // Redirect React location to the static html
    window.location.replace('/ai-reminder-test/index.html');
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p>Loading AI Reminder (Test)…</p>
    </div>
  );
};

export default AIReminderTest;
