import React, { useState, useEffect } from 'react';

function SchedulingSettings() {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [message, setMessage] = useState('');

  // In a real app, fetch and save these settings from/to backend or local storage

  const handleSave = () => {
    // Save settings logic here
    setMessage('Settings saved successfully.');
  };

  return (
    <div>
      <h2>Scheduling Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoSyncEnabled}
            onChange={(e) => setAutoSyncEnabled(e.target.checked)}
          />
          Enable Auto Sync
        </label>
      </div>
      <div>
        <label>
          Sync Frequency:
          <select
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value)}
            disabled={!autoSyncEnabled}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>
      <button onClick={handleSave}>Save Settings</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SchedulingSettings;
