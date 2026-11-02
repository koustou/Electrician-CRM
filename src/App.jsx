import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

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
  const [authMode, setAuthMode] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [clients] = useState([
    { id: '1', name: 'Γιάννης Παπαδόπουλος', phone: '6911111111', email: 'giannis@test.com', address: 'Κηφισίας 42, Αθήνα' }
  ]);
  
  const [jobs] = useState([
    { id: '101', clientId: '1', title: 'Αυτοψία & Προσφορά Πίνακα', address: 'Κηφισίας 42, Αθήνα', cost: 450, isValid: true }
  ]);

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
      <header style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#38bdf8' }}>KOUSTOU CRM</h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Λειτουργία: <strong>{authMode}</strong></span>
        </div>
        <button onClick={() => setShowPinModal(true)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Αποσύνδεση
        </button>
      </header>
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Καλωσόρισες στο KOUSTOU CRM! Η εφαρμογή λειτουργεί κανονικά.</h2>
      </main>
    </div>
  );
}
