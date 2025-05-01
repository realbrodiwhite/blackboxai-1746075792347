import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    phone: '',
    website: '',
    email: '',
    description: '',
    categories: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCitations();
  }, [page, search]);

  const fetchCitations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/citations?page=${page}&search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCitations(data.citations);
        setPages(data.pages);
      } else {
        setError(data.message || 'Failed to fetch citations');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/citations/${editingId}` : '/api/citations';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          categories: form.categories.split(',').map(c => c.trim()),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setForm({
          businessName: '',
          address: '',
          phone: '',
          website: '',
          email: '',
          description: '',
          categories: '',
        });
        setEditingId(null);
        fetchCitations();
      } else {
        setError(data.message || 'Failed to save citation');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleEdit = (citation) => {
    setForm({
      businessName: citation.businessName,
      address: citation.address,
      phone: citation.phone || '',
      website: citation.website || '',
      email: citation.email || '',
      description: citation.description || '',
      categories: citation.categories.join(', '),
    });
    setEditingId(citation._id);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const response = await fetch(`/api/citations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        fetchCitations();
      } else {
        setError(data.message || 'Failed to delete citation');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleSync = async (id) => {
    setError('');
    try {
      const response = await fetch(`/api/sync/citation/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        fetchCitations();
      } else {
        setError(data.message || 'Failed to sync citation');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2>Business Citations</h2>
      <input
        type="text"
        placeholder="Search citations..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
      />
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="website" placeholder="Website" value={form.website} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="categories" placeholder="Categories (comma separated)" value={form.categories} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Citation</button>
        {editingId && <button type="button" onClick={() => { setForm({ businessName: '', address: '', phone: '', website: '', email: '', description: '', categories: '' }); setEditingId(null); }}>Cancel</button>}
      </form>
      {loading ? <p>Loading...</p> : (
        <>
          <ul>
            {citations.map(citation => (
              <li key={citation._id}>
                <strong>{citation.businessName}</strong> - {citation.address}
                <button onClick={() => handleEdit(citation)}>Edit</button>
                <button onClick={() => handleDelete(citation._id)}>Delete</button>
                <button onClick={() => handleSync(citation._id)}>Sync</button>
                <span style={{ marginLeft: '10px' }}>
                  Google: {citation.googleSyncStatus || 'N/A'} | 
                  Facebook: {citation.facebookSyncStatus || 'N/A'} | 
                  Foursquare: {citation.foursquareSyncStatus || 'N/A'}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setPage(page - 1)} disabled={page <= 1}>Previous</button>
            <span style={{ margin: '0 10px' }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page >= pages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
