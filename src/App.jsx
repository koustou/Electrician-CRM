import React, { useState } from 'react';

export default function App() {
  // --- AUTH STATE ---
  const [authMode, setAuthMode] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(true);

  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([
    { id: '1', name: 'Γιάννης Παπαδόπουλος', phone: '6911111111', email: 'giannis@test.com', address: 'Κηφισίας 42, Αθήνα', category: 'Ιδιώτης', taxId: '123456789', taxOffice: 'Δ΄ Αθηνών' },
    { id: '2', name: 'Μαρία Δημητρίου', phone: '6922222222', email: 'maria@test.com', address: 'Ερμού 15, Αθήνα', category: 'Εταιρεία', taxId: '987654321', taxOffice: 'Α΄ Αθηνών' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', phone: '', email: '', address: '', category: 'Ιδιώτης', taxId: '', taxOffice: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '9999') {
      setAuthMode('master');
      setShowPinModal(false);
    } else if (pinInput === '8888') {
      setAuthMode('decoy');
      setShowPinModal(false);
    } else if (pinInput === '1234') {
      setAuthMode('standard');
      setShowPinModal(false);
    } else {
      alert('Λανθασμένος Κωδικός PIN!');
    }
    setPinInput('');
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      alert('Παρακαλώ συμπληρώστε Ονοματεπώνυμο και Τηλέφωνο!');
      return;
    }
    const created = { ...newClient, id: Date.now().toString() };
    setClients([created, ...clients]);
    setNewClient({ name: '', phone: '', email: '', address: '', category: 'Ιδιώτης', taxId: '', taxOffice: '' });
    setShowAddClientModal(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PIN MODAL SCREEN ---
  if (showPinModal) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', fontFamily: 'sans-serif', color: '#fff', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '90%', maxWidth: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '8px', color: '#38bdf8' }}>KOUSTOU CRM</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Field Service Suite</p>
          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', textAlign: 'left' }}>Εισάγετε PIN Πρόσβασης:</label>
            <input 
              type="password" 
              maxLength="6"
              value={pinInput} 
              onChange={(e) => setPinInput(e.target.value)} 
              placeholder="••••"
              style={{ width: '100%', padding: '12px', fontSize: '22px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', textAlign: 'center', marginBottom: '20px', letterSpacing: '6px', boxSizing: 'border-box' }}
              autoFocus
            />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Σύνδεση
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
            PINs: Master (<b>9999</b>) | Decoy (<b>8888</b>) | Tech (<b>1234</b>)
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP SCREEN ---
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <header style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>KOUSTOU CRM</h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Λειτουργία: <strong>{authMode === 'master' ? 'Master Admin' : authMode === 'decoy' ? 'Fake Admin' : 'Τεχνικός'}</strong>
          </span>
        </div>
        <button 
          onClick={() => setShowPinModal(true)} 
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Αποσύνδεση
        </button>
      </header>

      <nav style={{ background: '#1e293b', padding: '0 24px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('clients')}
          style={{
            background: activeTab === 'clients' ? '#0284c7' : 'transparent',
            color: '#fff',
            border: 'none',
            padding: '14px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            borderBottom: '3px solid #38bdf8'
          }}
        >
          Πελατολόγιο
        </button>
      </nav>

      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0 }}>Πελατολόγιο ({filteredClients.length})</h2>
            <button 
              onClick={() => setShowAddClientModal(true)}
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              + Νέος Πελάτης
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="🔍 Αναζήτηση με όνομα, τηλέφωνο ή διεύθυνση..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredClients.map(c => (
              <div key={c.id} style={{ background: '#fff', padding: '18px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #0284c7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{c.name}</h3>
                  <span style={{ fontSize: '11px', background: c.category === 'Εταιρεία' ? '#dbeafe' : '#f1f5f9', color: c.category === 'Εταιρεία' ? '#1e40af' : '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {c.category}
                  </span>
                </div>

                <p style={{ margin: '6px 0', fontSize: '14px', color: '#475569' }}>
                  📞 <strong>Τηλέφωνο:</strong> <a href={`tel:${c.phone}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>{c.phone}</a>
                </p>
                {c.email && <p style={{ margin: '6px 0', fontSize: '14px', color: '#475569' }}>✉️ <strong>Email:</strong> {c.email}</p>}
                {c.address && <p style={{ margin: '6px 0', fontSize: '14px', color: '#475569' }}>📍 <strong>Διεύθυνση:</strong> {c.address}</p>}

                {(c.taxId || c.taxOffice) && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                    <strong>ΑΦΜ:</strong> {c.taxId || '-'} | <strong>ΔΟΥ:</strong> {c.taxOffice || '-'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL ΝΕΟΥ ΠΕΛΑΤΗ */}
      {showAddClientModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Καταχώριση Νέου Πελά
