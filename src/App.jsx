import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// --- FIREBASE CONFIG (electrician-crm-babf3) ---
const firebaseConfig = {
  apiKey: "AIzaSyAenf809OtoTQ9rPUoti8Wc6ca_44fnTmQ",
  authDomain: "electrician-crm-babf3.firebaseapp.com",
  projectId: "electrician-crm-babf3",
  storageBucket: "electrician-crm-babf3.firebasestorage.app",
  messagingSenderId: "1007281364911",
  appId: "1:1007281364911:web:53a0b094f03af72d71195a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  // --- AUTH & ROLES STATES ---
  const [authMode, setAuthMode] = useState(null); // 'master', 'decoy', 'standard'
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(true);
  const [masterPin] = useState('9999');
  const [decoyPin] = useState('8888');

  // --- NAVIGATION & TABS ---
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- APP DATA STATES ---
  const [clients, setClients] = useState([
    { id: '1', name: 'Γιάννης Παπαδόπουλος', phone: '6911111111', email: 'giannis@test.com', address: 'Κηφισίας 42, Αθήνα' },
    { id: '2', name: 'Μαρία Δημητρίου', phone: '6922222222', email: 'maria@test.com', address: 'Ακαδημίας 15, Αθήνα' }
  ]);
  
  const [jobs, setJobs] = useState([
    { 
      id: '101', 
      clientId: '1', 
      title: 'Αυτοψία & Προσφορά Πίνακα', 
      address: 'Κηφισίας 42, Αθήνα', 
      status: 'quote',
      isQuote: true,
      quoteStatus: 'pending', 
      cost: 450,
      scope: 'Αντικατάσταση παλιού πίνακα με νέο Hager & ασφάλειες RCD',
      isValid: true
    },
    { 
      id: '102', 
      clientId: '2', 
      title: 'Εγκατάσταση Θυροτηλεόρασης', 
      address: 'Ακαδημίας 15, Αθήνα', 
      status: 'unscheduled',
      isQuote: false,
      quoteStatus: 'accepted', 
      cost: 280,
      scope: 'Τοποθέτηση νέας μπουτονιέρας 2 διαμερισμάτων',
      isValid: true
    }
  ]);

  const [technicians] = useState([
    { id: 't1', name: 'Αλέξης Κουστουμπάρδης', pin: '1234', role: 'Master / Admin', active: true },
    { id: 't2', name: 'Νικηφόρος', pin: '1122', role: 'Τεχνικός Πεδίου', active: true }
  ]);

  const [smsTemplates] = useState([
    { id: '1', title: 'Υπενθύμιση Ραντεβού', text: 'Γεια σας! Σας υπενθυμίζουμε το προγραμματισμένο ραντεβού μας για ηλεκτρολογικές εργασίες.' },
    { id: '2', title: 'Είμαι καθοδόν', text: 'Γεια σας! Ο τεχνικός βρίσκεται καθοδόν για τον χώρο σας.' }
  ]);

  // --- MODALS ---
  const [showJobModal, setShowJobModal] = useState(false);
  const [currentJob, setCurrentJob] = useState({ title: '', clientId: '1', address: '', cost: '', scope: '', isQuote: true, isValid: true, status: 'quote', quoteStatus: 'pending' });

  // --- AUTH HANDLER ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === masterPin) {
      setAuthMode('master');
      setShowPinModal(false);
    } else if (pinInput === decoyPin) {
      setAuthMode('decoy');
      setShowPinModal(false);
    } else if (pinInput === '1234' || pinInput === '1122') {
      setAuthMode('standard');
      setShowPinModal(false);
    } else {
      alert('Λανθασμένος Κωδικός PIN!');
    }
    setPinInput('');
  };

  // --- FILTERED JOBS BASED ON ACCESS MODE ---
  const visibleJobs = jobs.filter(j => {
    if (authMode === 'standard' || authMode === 'decoy') {
      return j.isValid === true; // Αποκλεισμός άκυρων/παραποιημένων εγγραφών
    }
    return true; // Master βλέπει τα πάντα
  });

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
      {/* HEADER NAVBAR */}
      <header style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>KOUSTOU CRM & Field Service</h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Λειτουργία: <strong>{authMode === 'master' ? 'Master Admin' : authMode === 'decoy' ? 'Fake Admin' : 'Standard / Τεχνικός'}</strong>
          </span>
        </div>
        <button 
          onClick={() => setShowPinModal(true)} 
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Αποσύνδεση
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <nav style={{ background: '#1e293b', padding: '0 24px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'clients', label: '👥 Πελάτες' },
          { id: 'jobs', label: '📋 Έργα & Προσφορές' },
          { id: 'calendar', label: '📅 Ημερολόγιο Queue' },
          { id: 'sms', label: '💬 SMS Πρότυπα' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? '#0284c7' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '14px 18px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              borderBottom: activeTab === tab.id ? '3px solid #38bdf8' : '3px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
        {authMode === 'master' && (
          <button 
            onClick={() => setActiveTab('settings')}
            style={{
              background: activeTab === 'settings' ? '#0284c7' : 'transparent',
              color: '#facc15',
              border: 'none',
              padding: '14px 18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              borderBottom: activeTab === 'settings' ? '3px solid #facc15' : '3px solid transparent'
            }}
          >
            ⚙️ Ρυθμίσεις Master
          </button>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h2>Επισκόπηση Επιχείρησης KOUSTOU</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Ενεργά Έργα & Προσφορές</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#0284c7' }}>{visibleJobs.length}</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Συνολική Αξία Έργων</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#16a34a' }}>
                  {authMode === 'standard' ? '•••• €' : `${visibleJobs.reduce((acc, j) => acc + (Number(j.cost) || 0), 0)} €`}
                </p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Καταχωρημένοι Πελάτες</h4>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#9333ea' }}>{clients.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Πελατολόγιο</h2>
              <button 
                onClick={() => alert('Σύνδεση με Google Contacts API')}
                style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                🔄 Εισαγωγή από Google Contacts
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '12px' }}>Ονοματεπώνυμο</th>
                    <th style={{ padding: '12px' }}>Τηλέφωνο</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Διεύθυνση</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.name}</td>
                      <td style={{ padding: '12px' }}>
                        <a href={`tel:${c.phone}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>{c.phone}</a>
                      </td>
                      <td style={{ padding: '12px' }}>{c.email}</td>
                      <td style={{ padding: '12px' }}>{c.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JOBS & QUOTES TAB */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Διαχείριση Έργων & Προσφορών</h2>
              <button 
                onClick={() => setShowJobModal(true)}
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Νέο Έργο / Προσφορά
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {visibleJobs.map(job => {
                const client = clients.find(c => c.id === job.clientId);
                return (
                  <div key={job.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: `6px solid ${job.isValid ? '#16a34a' : '#ef4444'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 8px 0' }}>{job.title}</h3>
                      <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: job.isValid ? '#dcfce7' : '#fee2e2', color: job.isValid ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                        {job.isValid ? 'Έγκυρο' : 'Άκυρο'}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0', color: '#475569', fontSize: '14px' }}><strong>Πελάτης:</strong> {client?.name || 'Άγνωστος'}</p>
                    <p style={{ margin: '4px 0', color: '#475569', fontSize: '14px' }}><strong>Διεύθυνση:</strong> {job.address}</p>
                    
                    {job.isQuote && (
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginTop: '10px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                        <div><strong>Προϋπολογισμός:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{job.cost} €</span></div>
                        <div><strong>Περιγραφή:</strong> {job.scope}</div>
                        <div style={{ marginTop: '6px' }}>
                          <strong>Κατάσταση Προσφοράς:</strong> <span style={{ color: job.quoteStatus === 'accepted' ? '#16a34a' : job.quoteStatus === 'rejected' ? '#dc2626' : '#d97706', fontWeight: 'bold' }}>{job.quoteStatus.toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CALENDAR & PENDING QUEUE */}
        {activeTab === 'calendar' && (
          <div>
            <h2>Ημερολόγιο & Unscheduled Queue</h2>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '20px' }}>
              <h3>⏳ Ραντεβού Προς Προγραμματισμό (Εκκρεμότητες)</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Έργα που έχουν συμφωνηθεί αλλά δεν έχουν οριστεί ακόμη σε συγκεκριμένη ώρα:</p>
              {jobs.filter(j => j.status === 'unscheduled').map(j => (
                <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '6px', marginTop: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong>{j.title}</strong> - {j.address}
                  </div>
                  <button 
                    onClick={() => alert('Ορισμός ημερομηνίας στο ημερολόγιο')}
                    style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    📅 Ορισμός Ημερομηνίας
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SMS TEMPLATES TAB */}
        {activeTab === 'sms' && (
          <div>
            <h2>Έτοιμα Πρότυπα SMS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {smsTemplates.map(tmpl => (
                <div key={tmpl.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h4>{tmpl.title}</h4>
                  <p style={{ color: '#475569', fontSize: '14px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{tmpl.text}</p>
                  <button 
                    onClick={() => alert(`Αποστολή SMS: "${tmpl.text}"`)}
                    style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                    💬 Αποστολή σε Πελάτη
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS (MASTER ONLY) */}
        {activeTab === 'settings' && authMode === 'master' && (
          <div>
            <h2>Ρυθμίσεις Συστήματος & Χρηστών (Master Access)</h2>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '20px' }}>
              <h3>Διαχείριση Τεχνικών / PINs</h3>
              {technicians.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span><strong>{t.name}</strong> (PIN: <code>{t.pin}</code>) - {t.role}</span>
                  <span style={{ color: t.active ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{t.active ? 'Ενεργός' : 'Ανενεργός'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL ΝΕΟΥ ΕΡΓΟΥ / ΠΡΟΣΦΟΡΑΣ */}
      {showJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0 }}>Νέο Έργο / Προσφορά</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              setJobs([...jobs, { ...currentJob, id: Date.now().toString() }]);
              setShowJobModal(false);
            }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Τίτλος Εργασίας:</label>
              <input 
                type="text" 
                required
                value={currentJob.title} 
                onChange={e => setCurrentJob({...currentJob, title: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />

              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Προϋπολογισμός / Κόστος (€):</label>
              <input 
                type="number" 
                required
                value={currentJob.cost} 
                onChange={e => setCurrentJob({...currentJob, cost: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #cbd5e
