import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const [toast, setToast] = useState({ show: false, title: '', message: '', type: '', link: null });

  const showToast = (title, message, type = 'info', link = null) => {
    setToast({ show: true, title, message, type, link });

    if (!link) {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        } catch (e) { console.error(e); }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        
        showToast("Connected!", "Dompet berhasil terhubung.", "success");

      } catch (error) {
        showToast("Gagal Konek", "User menolak atau error sistem.", "error");
      }
    } else {
      showToast("MetaMask Hilang", "Tolong install MetaMask dulu ya.", "error");
    }
  };

  const fetchHistory = () => {
    axios.get('http://localhost:5000/api/history')
      .then(res => setHistory(res.data.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => setCampaigns(res.data.data))
      .catch(err => console.log(err));
    fetchHistory();
  }, []);

  const handleDonate = async (id, title) => {
    if (!account) {
      showToast("Akses Ditolak", "Silakan Connect Wallet terlebih dahulu.", "error");
      return;
    }

    setLoadingId(id);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: account, 
        value: ethers.parseEther("0.0000001"), 
        gasLimit: 21000 
      });

      showToast("Transaksi Dikirim", "Menunggu konfirmasi blockchain...", "info");

      await tx.wait(); 

      setLoadingId(null); 

      try {
        const newHistory = {
          title: title,
          hash: tx.hash,
          amount: "0.0000001 ETH",
          date: new Date().toLocaleString()
        };
        await axios.post('http://localhost:5000/api/history', newHistory);
        fetchHistory(); 
      } catch (backendError) {
        console.warn("Gagal simpan history:", backendError);
      }

      showToast(
        "Donasi Berhasil! 🎉", 
        `Terima kasih telah berdonasi untuk ${title}.`, 
        "success",
        `https://sepolia.etherscan.io/tx/${tx.hash}`
      );

    } catch (error) {
      setLoadingId(null);
      console.error(error);
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
         showToast("Saldo Kurang", "Pastikan Anda punya ETH Sepolia.", "error");
      } else if (error.code === 4001) { 
         showToast("Dibatalkan", "Anda membatalkan transaksi.", "info");
      } else {
         showToast("Transaksi Gagal", "Terjadi kesalahan pada jaringan.", "error");
      }
    }
  };

  return (
    <div className="app-container">

      {/* ---  NOTIFICATION  --- */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            
            <div className="toast-icon">
              {toast.type === 'success' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {toast.type === 'error' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              {toast.type === 'info' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>

            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
              {toast.link && (
                <a href={toast.link} target="_blank" rel="noreferrer" className="toast-link">
                  Lihat Bukti &rarr;
                </a>
              )}
            </div>

            <button className="toast-close" onClick={closeToast}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="logo">Web3 Transactions</div>
        <div className="nav-action">
          <button className="btn-connect" onClick={connectWallet}>
            {account ? account.substring(0, 6) + "..." : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero">
        <h1 className="hero-title">Donation App</h1>
      </header>

      {/* --- CAMPAIGN CARDS --- */}
      <main className="cards-container">
        {campaigns.map((item) => (
          <div className="card" key={item.id}>
            <div className="card-content">
              <span className="badge">{item.category}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-info">Target: {item.target}</p>
              
              <button 
                className="btn-donate"
                onClick={() => handleDonate(item.id, item.title)}
                disabled={loadingId !== null} 
                style={{ 
                  backgroundColor: loadingId === item.id ? '#ccc' : '#1e293b',
                  cursor: loadingId !== null ? 'not-allowed' : 'pointer'
                }}
              >
                {loadingId === item.id ? "Processing..." : "Donate 0.0000001 ETH"}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* --- HISTORY SECTION --- */}
      {account && (
        <section className="history-section">
          <h2 className="section-title">📜 Riwayat Transaksi</h2>
          {history.length === 0 ? (
            <p className="empty-state">Belum ada donasi yang masuk sesi ini.</p>
          ) : (
            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Kampanye</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.title}</td>
                      <td style={{color: '#10b981', fontWeight: 'bold'}}>{record.amount}</td>
                      <td>
                        <a href={`https://sepolia.etherscan.io/tx/${record.hash}`} target="_blank" rel="noreferrer" className="hash-link">
                          Success ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

    </div>
  );
}

export default App;