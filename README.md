# Web3 Donation App (UAS Pemrograman Web)

**Nama :** ILMA NUR FADILA
**NIM :** 241111043

### Deskripsi Project

Aplikasi ini adalah platform donasi berbasis Web3 sederhana. User dapat menghubungkan dompet digital (MetaMask), memilih kampanye donasi, dan mengirimkan donasi menggunakan Ethereum (ETH) di jaringan Sepolia Testnet.

Aplikasi ini juga mencatat riwayat transaksi yang berhasil.

### Fitur Utama

1.  **Connect Wallet :** Integrasi dengan MetaMask untuk login.
2.  **Donasi ETH :** Mengirim transaksi blockchain di jaringan Sepolia.
3.  **Riwayat Transaksi :** Mencatat bukti transaksi (Hash) setelah donasi berhasil.
4.  **Notifikasi Modern :** Tampilan notifikasi status (Loading, Sukses, Gagal) yang interaktif.
5.  **Validasi Jaringan :** Otomatis meminta pengguna pindah ke jaringan Sepolia jika salah jaringan.

### Teknologi yang Digunakan

- **Frontend :** React.js
- **Backend :** Node.js & Express (API riwayat transaksi)
- **Blockchain Library :** Ethers.js v6
- **Styling :** CSS Native (Responsive & Modern UI)

### Cara Menjalankan (Instalasi)

Pastikan sudah menginstall **Node.js** dan punya **MetaMask** di browser.

#### Langkah 1 : Jalankan backend / server

1. Buka terminal dan masuk ke folder backend :
   cd backend

2. Install library yang dibutuhkan (Express & CORS) :
   npm install

3. Jalankan server :
   node server.js

#### Langkah 2 : Jalankan frontend / website

1. Buka terminal baru dan masuk folder frontend :
   cd frontend

2. Install library React & Web3 (Ethers.js, Axios) :
   npm install

3. Jalankan website :
   npm start

#### Langakah 3 : Alur penggunaan website

1. Hubungkan dengan metamask (Connect wallet) :
   Klik button 'Connect Wallet' yanga da di pojok kanan atas

2. Pilih salah satu card donasi yang ada :
   Klik button 'Donate 0.0000001 ETH' untuk melakukan donasi

3. Konfirmasi di panel metamask yang otomatis terbuka :
   Klik button 'Confirm' di panel metamask

4. Maka akan muncul notifikasi berhasil :
   Di notifikasi terdapat button yang mengarah ke detail transaksi

5. Transaksi yang dilakukan akan tampil di riwayat tarnsaksi
