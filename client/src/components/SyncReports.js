import React, { useState, useEffect } from 'react';

function SyncReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/reporting/sync-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setReports(data.report);
      } else {
        setError(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Sync Reports</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {loading ? <p>Loading...</p> : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Site</th>
              <th>Status</th>
              <th>Last Synced</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              Object.entries(report.syncData).map(([site, data]) => (
                <tr key={`${report.id}-${site}`}>
                  <td>{report.businessName}</td>
                  <td>{site}</td>
                  <td>{data.status}</td>
                  <td>{data.lastSynced ? new Date(data.lastSynced).toLocaleString() : 'N/A'}</td>
                  <td>{data.errorMessage || ''}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SyncReports;
