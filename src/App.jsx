import React, { useState } from 'react';

export default function App() {
  // --- AUTH STATE ---
  const [authMode, setAuthMode] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(true);

  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState('clients');
  
  // 1. Πελάτες
  const [clients, setClients] = useState([
    { id: '1', name: 'Γιάννης Παπαδόπουλος', phone: '6911111111', email: 'giannis@test.com', address: 'Κηφισίας 42, Αθήνα', category: 'Ιδιώτης', taxId: '123456789', taxOffice: 'Δ΄ Αθηνών' },
    { id: '2', name: 'Μαρία Δημητρίου', phone: '6922222222', email: 'maria@test.com', address: 'Ερμού 15, Αθήνα', category: 'Εταιρεία', taxId: '987654321', taxOffice: 'Α΄ Αθηνών' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '', category: 'Ιδιώτης', taxId: '', taxOffice: '' });

  // 2. Έργα & Προσφορές (με υποστήριξη unscheduled)
  const [jobs, setJobs] = useState([
    { id: '101', clientId: '1', title: 'Αντικατάσταση Ηλεκτρικού Πίνακα', address: 'Κηφισίας 42, Αθήνα', status: 'active', cost: 450, scope: 'Τοποθέτηση υλικών Hager & έλεγχος ΔΕΗ', isUnscheduled: false, isValid: true },
    { id: '102', clientId: '2', title: 'Εγκατάσταση Συναγερμού Ajax', address: 'Ερμού 15, Αθήνα', status: 'quote', cost: 780, scope: 'Hub 2, MotionCam, DoorProtect', isUnscheduled: false, isValid: true },
    { id: '103', clientId: '1', title: 'Έλεγχος Βλάβης Ρελέ (Επείγον)', address: 'Κηφισίας 42, Αθήνα', status: 'active', cost: 60, scope: 'Πέφτει το ρελέ διαρροής τυχαία', isUnscheduled: true, isValid: true }
  ]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({ clientId: '', title: '', address: '', status: 'quote', cost: '', scope: '', isUnscheduled: false, isValid: true });

  // 3. Ημερολόγιο / Ραντεβού
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 'e1', title: 'Αυτοψία Πίνακα - Γ. Παπαδόπουλος', date: '2026-06-10', time: '10:00', notes: 'Έλεγχος γείωσης και ασφαλειών' }
  ]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', notes: '' });

  // --- AUTH HANDLER ---
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

  // --- ADD CLIENT ---
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      alert('Συμπληρώστε Ονοματεπώνυμο και Τηλέφωνο!');
      return;
    }
    setClients([{ ...newClient, id: Date.now().toString() }, ...clients]);
    setNewClient({ name: '', phone: '', email: '', address: '', category: 'Ιδιώτης', taxId: '', taxOffice: '' });
    setShowAddClientModal(false);
  };

  // --- ADD JOB ---
  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.clientId) {
      alert('Συμπληρώστε Τίτλο και επιλέξτε Πελάτη!');
      return;
    }
    setJobs([{ ...newJob, id: Date.now().toString(), cost: Number(newJob.cost) || 0 }, ...jobs]);
    setNewJob({ clientId: '', title: '', address: '', status: 'quote', cost: '', scope: '', isUnscheduled: false, isValid: true });
    setShowAddJobModal(false);
  };

  // --- TOGGLE JOB STATUS ---
  const toggleJobStatus = (id) => {
    setJobs(jobs.map(j => {
      if (j.id === id) {
        const nextStatus = j.status === 'active' ? 'quote' : 'active';
        return { ...j, status: nextStatus };
      }
      return j;
    }));
  };

  // --- DELETE JOB ---
  const deleteJob = (id) => {
    if (window.confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτό το έργο;')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  // --- ADD EVENT ---
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      alert('Συμπληρώστε Τίτλο και Ημερομηνία!');
      return;
    }
    setCalendarEvents([{ ...newEvent, id: Date.now().toString() }, ...calendarEvents]);
    setNewEvent({ title: '', date: '', time: '', notes: '' });
    setShowAddEventModal(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const visibleJobs = jobs.filter(j => {
    if (authMode === 'decoy') return j.isValid === true;
    return true;
  });

  const unscheduledJobs = visibleJobs.filter(j => j.isUnscheduled);

  // --- PIN MODAL ---
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

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      {/* HEADER */}
      <header style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>KOUSTOU CRM</h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Λειτουργία: <strong>{authMode === 'master' ? 'Master Admin' : authMode === 'decoy' ? 'Fake Admin' : 'Τεχνικός'}</strong>
          </span>
        </div>
        <button onClick={() => setShowPinModal(true)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Αποσύνδεση
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <nav style={{ background: '#1e293b', padding: '0 24px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {[
          { id: 'clients', label: 'Πελατολόγιο' },
          { id: 'jobs', label: 'Έργα & Προσφορές' },
          { id: 'calendar', label: `Ημερολόγιο (${calendarEvents.length})` }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? '#0284c7' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '14px 20px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              borderBottom: activeTab === tab.id ? '3px solid #38bdf8' : '3px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TAB 1: CLIENTS */}
        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>Πελατολόγιο ({filteredClients.length})</h2>
              <button onClick={() => setShowAddClientModal(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Νέος Πελάτης
              </button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="🔍 Αναζήτηση πελάτη..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {filteredClients.map(c => (
                <div key={c.id} style={{ background: '#fff', padding: '18px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #0284c7' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{c.name}</h3>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>📞 <a href={`tel:${c.phone}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>{c.phone}</a></p>
                  {c.address && <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>📍 {c.address}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: JOBS & QUOTES */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>Έργα & Προσφορές ({visibleJobs.length})</h2>
              <button onClick={() => setShowAddJobModal(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Νέο Έργο / Προσφορά
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {visibleJobs.map(j => {
                const clientObj = clients.find(cl => cl.id === j.clientId);
                return (
                  <div key={j.id} style={{ background: '#fff', padding: '18px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: `5px solid ${j.isUnscheduled ? '#dc2626' : j.status === 'active' ? '#16a34a' : '#d97706'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ fontSize: '11px', background: j.status === 'active' ? '#dcfce7' : '#fef3c7', color: j.status === 'active' ? '#166534' : '#92400e', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {j.status === 'active' ? 'Ενεργό Έργο' : 'Προσφορά'}
                        </span>
                        {j.isUnscheduled && (
                          <span style={{ fontSize: '11px', background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            ⚠️ Απρογραμματισμένο / Επείγον
                          </span>
                        )}
                      </div>
                      <strong style={{ fontSize: '16px', color: '#0284c7' }}>{j.cost} €</strong>
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '17px' }}>{j.title}</h3>
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>👤 <strong>Πελάτης:</strong> {clientObj ? clientObj.name : 'Άγνωστος'}</p>
                    {j.scope && <p style={{ margin: '6px 0', fontSize: '13px', background: '#f8fafc', padding: '8px', borderRadius: '4px' }}>{j.scope}</p>}
                    
                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button 
                        onClick={() => toggleJobStatus(j.id)}
                        style={{ flex: 1, background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>
                        {j.status === 'active' ? '➡️ Μετατροπή σε Προσφορά' : '✔️ Έγκριση (Ενεργό)'}
                      </button>
                      <button 
                        onClick={() => deleteJob(j.id)}
                        style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR & UNSCHEDULED */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>Ημερολόγιο / Ραντεβού</h2>
              <button onClick={() => setShowAddEventModal(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Νέο Ραντεβού
              </button>
            </div>

            {/* UNSCHEDULED SECTION */}
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Απρογραμματισμένες Εργασίες & Βλάβες ({unscheduledJobs.length})
              </h3>
              {unscheduledJobs.length === 0 ? (
                <p style={{ margin: 0, fontSize: '13px', color: '#9f1239' }}>Δεν υπάρχουν εκκρεμή απρογραμματισμένα έργα.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {unscheduledJobs.map(uj => {
                    const cl = clients.find(c => c.id === uj.clientId);
                    return (
                      <div key={uj.id} style={{ background: '#fff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #e11d48', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{uj.title}</strong>
                        <span style={{ fontSize: '12px', color: '#475569' }}>👤 {cl ? cl.name : 'Πελάτης'} | 📞 {cl ? cl.phone : ''}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SCHEDULED EVENTS */}
            <h3 style={{ marginBottom: '12px' }}>Προγραμματισμένα Ραντεβού</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {calendarEvents.map(ev => (
                <div key={ev.id} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{ev.title}</h3>
                    {ev.notes && <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{ev.notes}</p>}
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: '#0284c7' }}>
                    📅 {ev.date} {ev.time ? `| ⏰ ${ev.time}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ΝΕΟΣ ΠΕΛΑΤΗΣ */}
      {showAddClientModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0 }}>Καταχώριση Νέου Πελάτη</h3>
            <form onSubmit={handleAddClient}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Ονοματεπώνυμο *</label>
              <input type="text" required value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Τηλέφωνο *</label>
              <input type="tel" required value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Διεύθυνση</label>
              <input type="text" value={newClient.address} onChange={e => setNewClient({ ...newClient, address: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddClientModal(false)} style={{ padding: '10px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ακύρωση</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Αποθήκευση</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ΝΕΟ ΕΡΓΟ / ΠΡΟΣΦΟΡΑ (με Checkbox Απρογραμματίστου) */}
      {showAddJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0 }}>Νέο Έργο / Προσφορά</h3>
            <form onSubmit={handleAddJob}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Πελάτης *</label>
              <select value={newJob.clientId} onChange={e => setNewJob({ ...newJob, clientId: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                <option value="">-- Επιλέξτε Πελάτη --</option>
                {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Τίτλος Εργασίας *</label>
              <input type="text" required value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Κατάσταση</label>
                  <select value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                    <option value="quote">Προσφορά</option>
                    <option value="active">Ενεργό Έργο</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Κόστος (€)</label>
                  <input type="number" value={newJob.cost} onChange={e => setNewJob({ ...newJob, cost: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: '#9f1239' }}>
                  <input 
                    type="checkbox" 
                    checked={newJob.isUnscheduled} 
                    onChange={e => setNewJob({ ...newJob, isUnscheduled: e.target.checked })} 
                  />
                  ⚠️ Απρογραμματισμένο / Βλάβη (Standby)
                </label>
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Περιγραφή Εργασιών</label>
              <textarea value={newJob.scope} onChange={e => setNewJob({ ...newJob, scope: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', height: '60px' }}></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddJobModal(false)} style={{ padding: '10px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ακύρωση</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Αποθήκευση</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ΝΕΟ ΡΑΝΤΕΒΟΥ */}
      {showAddEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0 }}>Προσθήκη Ραντεβού</h3>
            <form onSubmit={handleAddEvent}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Τίτλος Ραντεβού *</label>
              <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Ημερομηνία *</label>
                  <input type="date" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Ώρα</label>
                  <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Σημειώσεις</label>
              <textarea value={newEvent.notes} onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', height: '60px' }}></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddEventModal(false)} style={{ padding: '10px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ακύρωση</button>
                <button type="submit" style={{ padding: '10px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Αποθήκευση</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
