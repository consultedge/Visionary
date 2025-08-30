// src/pages/AIReminderTest.js

import React, { useEffect } from 'react';

const AIReminderTest = () => {
  useEffect(() => {
    window.location.replace('/ai-reminder-test/index.html');
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p>Loading AI Reminder (Test)…</p>
    </div>
  );
};

export default AIReminderTest;
