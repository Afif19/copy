/**
 * LOCAL STORAGE DATABASE ENGINE & HELPER (db.js)
 * 
 * Simulator database (DBMS) di browser menggunakan localStorage untuk SI Toko Bangunan.
 * Menyimpan data dalam skema relasional Header-Detail dan mendukung auto-generate kode.
 * Dilengkapi komentar penjelasan dalam Bahasa Indonesia.
 */

const DB = {
    
    /**
     * FUNGSI: init()
     * Deskripsi: Pengecekan dan inisialisasi tabel database lokal jika kosong.
     * Alur: Mengisi localStorage dengan seed data awal relasional.
     */
    init: function () {
        const CURRENT_VERSION = 'v1.6';
        if (localStorage.getItem('db_version') !== CURRENT_VERSION) {
            localStorage.removeItem('users');
            localStorage.removeItem('kategori');
            localStorage.removeItem('barang');
            localStorage.removeItem('supplier');
            localStorage.removeItem('pelanggan');
            localStorage.removeItem('pembelian');
            localStorage.removeItem('detail_pembelian');
            localStorage.removeItem('penjualan');
            localStorage.removeItem('detail_penjualan');
            localStorage.setItem('db_version', CURRENT_VERSION);
        }

        // 1. Inisialisasi Tabel Users
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                { id_user: 1, username: 'admin', password: 'admin' }
            ]));
        }

        // 2. Inisialisasi Tabel Kategori
        if (!localStorage.getItem('kategori')) {
            localStorage.setItem('kategori', JSON.stringify([
                { id_kategori: 1, nama_kategori: 'Semen' },
                { id_kategori: 2, nama_kategori: 'Besi & Baja' },
                { id_kategori: 3, nama_kategori: 'Cat & Perlengkapan' },
                { id_kategori: 4, nama_kategori: 'Pipa & Fitting' },
                { id_kategori: 5, nama_kategori: 'Kayu' },
                { id_kategori: 6, nama_kategori: 'Kelistrikan' },
                { id_kategori: 7, nama_kategori: 'Paku & Baut' }
            ]));
        }

        // 3. Inisialisasi Tabel Barang (Master Inventori)
        if (!localStorage.getItem('barang')) {
            localStorage.setItem('barang', JSON.stringify([
                { id_inventori: 1, kode_barang: 'BRG0001', nama_barang: 'Semen Tiga Roda 50kg', kategori: 'Semen', satuan: 'Sak', satuan_eceran: 'Kg', nilai_konversi: 50, harga_beli: 65000, harga_jual: 70000, stok: 120, stok_utuh: 120, stok_eceran: 0, stok_minimum: 10 },
                { id_inventori: 2, kode_barang: 'BRG0002', nama_barang: 'Besi Beton 10mm', kategori: 'Besi & Baja', satuan: 'Batang', satuan_eceran: null, nilai_konversi: 1, harga_beli: 55000, harga_jual: 62000, stok: 85, stok_utuh: 85, stok_eceran: 0, stok_minimum: 15 },
                { id_inventori: 3, kode_barang: 'BRG0003', nama_barang: 'Cat Tembok Dulux 5kg', kategori: 'Cat & Perlengkapan', satuan: 'PCS', satuan_eceran: null, nilai_konversi: 1, harga_beli: 145000, harga_jual: 160000, stok: 4, stok_utuh: 4, stok_eceran: 0, stok_minimum: 5 },
                { id_inventori: 4, kode_barang: 'BRG0004', nama_barang: 'Pipa PVC Wavin 1/2"', kategori: 'Pipa & Fitting', satuan: 'Batang', satuan_eceran: 'Meter', nilai_konversi: 4, harga_beli: 18000, harga_jual: 22000, stok: 50, stok_utuh: 50, stok_eceran: 0, stok_minimum: 10 },
                { id_inventori: 5, kode_barang: 'BRG0005', nama_barang: 'Kayu Kaso 4x6', kategori: 'Kayu', satuan: 'Batang', satuan_eceran: null, nilai_konversi: 1, harga_beli: 12000, harga_jual: 15000, stok: 0, stok_utuh: 0, stok_eceran: 0, stok_minimum: 5 }
            ]));
        }

        // 4. Inisialisasi Tabel Supplier
        if (!localStorage.getItem('supplier')) {
            localStorage.setItem('supplier', JSON.stringify([
                { id_supplier: 1, kode_supplier: 'SUP0001', nama_supplier: 'PT Semen Indonesia', alamat: 'Gresik, Jawa Timur', no_telp: '081122334455' },
                { id_supplier: 2, kode_supplier: 'SUP0002', nama_supplier: 'Krakatau Steel', alamat: 'Cilegon, Banten', no_telp: '081234567890' },
                { id_supplier: 3, kode_supplier: 'SUP0003', nama_supplier: 'Dulux Paint Utama', alamat: 'Jakarta Barat', no_telp: '081399887766' }
            ]));
        }

        // 5. Inisialisasi Tabel Pelanggan
        if (!localStorage.getItem('pelanggan')) {
            localStorage.setItem('pelanggan', JSON.stringify([
                { id_pelanggan: 1, kode_pelanggan: 'UM0001', nama_pelanggan: 'Umum / Walk-in', jenis_pelanggan: 'Umum', alamat: 'Toko Fisik', no_telp: '-' },
                { id_pelanggan: 2, kode_pelanggan: 'TB0001', nama_pelanggan: 'TB Karya Mandiri', jenis_pelanggan: 'Retail', alamat: 'Jl. Merdeka No. 10', no_telp: '085611223344' },
                { id_pelanggan: 3, kode_pelanggan: 'TB0002', nama_pelanggan: 'TB Budi Hartono', jenis_pelanggan: 'Retail', alamat: 'Perum Sentosa Indah C-5', no_telp: '087812345678' }
            ]));
        }

        // 6. Inisialisasi Tabel Pembelian (Header Barang Masuk)
        if (!localStorage.getItem('pembelian')) {
            localStorage.setItem('pembelian', JSON.stringify([
                { no_pembelian: 'PBL000001', tanggal: '2026-06-10', id_supplier: 1, total_pembelian: 6500000, nomor_faktur_supplier: '0100/GCU', metode_pembayaran: 'Tunai', status_pembayaran: 'Lunas', jatuh_tempo: '-' },
                { no_pembelian: 'PBL000002', tanggal: '2026-06-12', id_supplier: 2, total_pembelian: 4400000, nomor_faktur_supplier: '0200/GCU', metode_pembayaran: 'Tempo', status_pembayaran: 'Belum Lunas', jatuh_tempo: '2026-07-12' }
            ]));
        }

        // 7. Inisialisasi Tabel Detail Pembelian
        if (!localStorage.getItem('detail_pembelian')) {
            localStorage.setItem('detail_pembelian', JSON.stringify([
                { id_detail: 1, no_pembelian: 'PBL000001', id_inventori: 1, qty: 100, harga_beli: 65000, subtotal: 6500000 },
                { id_detail: 2, no_pembelian: 'PBL000002', id_inventori: 2, qty: 80, harga_beli: 55000, subtotal: 4400000 }
            ]));
        }

        // 8. Inisialisasi Tabel Penjualan (Header Nota)
        if (!localStorage.getItem('penjualan')) {
            localStorage.setItem('penjualan', JSON.stringify([
                { id_penjualan: 1, no_penjualan: 'PJL000001', tanggal: '2026-06-14', id_pelanggan: 1, metode_pembayaran: 'Tunai', status_pembayaran: 'Lunas', jatuh_tempo: '-', total_penjualan: 140000 },
                { id_penjualan: 2, no_penjualan: 'PJL000002', tanggal: '2026-06-15', id_pelanggan: 2, metode_pembayaran: 'Transfer', status_pembayaran: 'Lunas', jatuh_tempo: '-', total_penjualan: 186000 }
            ]));
        }

        // 9. Inisialisasi Tabel Detail Penjualan
        if (!localStorage.getItem('detail_penjualan')) {
            localStorage.setItem('detail_penjualan', JSON.stringify([
                { id_detail: 1, no_penjualan: 'PJL000001', id_inventori: 1, qty: 2, harga_jual: 70000, subtotal: 140000 },
                { id_detail: 2, no_penjualan: 'PJL000002', id_inventori: 2, qty: 3, harga_jual: 62000, subtotal: 186000 }
            ]));
        }

        // 10. Inisialisasi Tabel Pembayaran Pembelian (Hutang)
        if (!localStorage.getItem('pembayaran_pembelian')) {
            localStorage.setItem('pembayaran_pembelian', JSON.stringify([]));
        }

        // 11. Inisialisasi Tabel Pembayaran Penjualan (Piutang)
        if (!localStorage.getItem('pembayaran_penjualan')) {
            localStorage.setItem('pembayaran_penjualan', JSON.stringify([]));
        }

        // 12. Inisialisasi Tabel Pemecahan Barang
        if (!localStorage.getItem('pemecahan_barang')) {
            localStorage.setItem('pemecahan_barang', JSON.stringify([]));
        }
    },

    // Middleware Autentikasi Client-Side
    checkAuth: function (isLoginPage = false) {
        const isLoggedIn = sessionStorage.getItem('login') === 'true' || localStorage.getItem('login') === 'true';
        const rootPath = window.location.pathname.includes('/auth/') ? '../' : '';

        if (!isLoggedIn && !isLoginPage) {
            window.location.href = rootPath + 'auth/login.html';
        } else if (isLoggedIn && isLoginPage) {
            window.location.href = '../dashboard.html';
        }
    },

    login: function (username, password, rememberMe = false) {
        const users = this.getTable('users');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            sessionStorage.setItem('login', 'true');
            sessionStorage.setItem('username', user.username);
            if (rememberMe) {
                localStorage.setItem('login', 'true');
                localStorage.setItem('username', user.username);
            }
            return true;
        }
        return false;
    },

    logout: function () {
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('username');
        localStorage.removeItem('login');
        localStorage.removeItem('username');
        const rootPath = window.location.pathname.includes('/auth/') ? '' : 'auth/';
        window.location.href = rootPath + 'login.html';
    },

    resetPassword: function (newPassword) {
        const users = this.getTable('users');
        const adminIndex = users.findIndex(u => u.username === 'admin');
        if (adminIndex !== -1) {
            users[adminIndex].password = newPassword;
        } else {
            users.push({ id_user: 1, username: 'admin', password: newPassword });
        }
        this.saveTable('users', users);
        return true;
    },

    getTable: function (tableName) {
        return JSON.parse(localStorage.getItem(tableName) || '[]');
    },

    saveTable: function (tableName, data) {
        localStorage.setItem(tableName, JSON.stringify(data));
    },

    getNextId: function (table, idField) {
        const data = this.getTable(table);
        if (data.length === 0) return 1;
        const ids = data.map(item => item[idField]);
        return Math.max(...ids) + 1;
    },

    getCategories: function () {
        return this.getTable('kategori').sort((a, b) => a.nama_kategori.localeCompare(b.nama_kategori));
    },

    addCategory: function (name) {
        const categories = this.getTable('kategori');
        if (categories.some(c => c.nama_kategori.toLowerCase() === name.toLowerCase())) {
            throw new Error('Nama kategori sudah ada!');
        }
        const nextId = this.getNextId('kategori', 'id_kategori');
        categories.push({ id_kategori: nextId, nama_kategori: name });
        this.saveTable('kategori', categories);
        return true;
    },

    updateCategory: function (id, name) {
        const categories = this.getTable('kategori');
        const index = categories.findIndex(c => c.id_kategori === parseInt(id));
        if (index === -1) throw new Error('Kategori tidak ditemukan!');
        
        if (categories.some((c, idx) => idx !== index && c.nama_kategori.toLowerCase() === name.toLowerCase())) {
            throw new Error('Nama kategori sudah digunakan!');
        }

        const oldName = categories[index].nama_kategori;
        categories[index].nama_kategori = name;
        this.saveTable('kategori', categories);

        // Cascading update ke tabel barang
        const barangList = this.getTable('barang');
        barangList.forEach(b => {
            if (b.kategori === oldName) {
                b.kategori = name;
            }
        });
        this.saveTable('barang', barangList);

        return true;
    },

    deleteCategory: function (id) {
        const idInt = parseInt(id);
        const categories = this.getTable('kategori');
        const cat = categories.find(c => c.id_kategori === idInt);
        if (!cat) return false;

        const barangList = this.getTable('barang');
        const count = barangList.filter(b => b.kategori === cat.nama_kategori).length;
        if (count > 0) {
            throw new Error(`Kategori tidak dapat dihapus karena masih digunakan oleh ${count} data barang!`);
        }

        const filtered = categories.filter(c => c.id_kategori !== idInt);
        this.saveTable('kategori', filtered);
        return true;
    },

    // ==========================================
    // REVISI DATA BARANG & MULTI-SATUAN
    // ==========================================
    getBarang: function () {
        const barangList = this.getTable('barang');
        
        // Return data dengan mapping kompatibilitas ke halaman dashboard dan laporan lama
        return barangList.map(b => {
            const stokUtuhVal = b.stok_utuh !== undefined ? parseInt(b.stok_utuh) : parseInt(b.stok || 0);
            const stokEceranVal = parseInt(b.stok_eceran || 0);
            const konversiVal = parseInt(b.nilai_konversi) || 1;

            return {
                ...b,
                satuan_utuh: b.satuan,
                satuan_eceran: b.satuan_eceran || null,
                nilai_konversi: konversiVal,
                stok_utuh: stokUtuhVal,
                stok_eceran: stokEceranVal,
                stok: stokUtuhVal, // Alias kompatibilitas
                id_barang: b.id_inventori, // Alias id_barang untuk menghindari error visual dashboard
                nama_kategori: b.kategori  // Alias nama_kategori
            };
        }).sort((a, b) => b.id_inventori - a.id_inventori);
    },

    generateKodeBarang: function () {
        const barangList = this.getTable('barang');
        if (barangList.length === 0) return "BRG0001";
        
        const nums = barangList.map(b => {
            const numPart = b.kode_barang.substring(3);
            return parseInt(numPart) || 0;
        });
        const nextNum = Math.max(...nums) + 1;
        return "BRG" + nextNum.toString().padStart(4, "0");
    },

    addBarang: function (item) {
        const barangList = this.getTable('barang');
        const nextId = this.getNextId('barang', 'id_inventori');
        const autoCode = this.generateKodeBarang();

        // Ambil nama kategori ter-resolve jika id_kategori dikirim
        let catName = item.kategori || "";
        if (item.id_kategori) {
            const categories = this.getTable('kategori');
            const c = categories.find(x => x.id_kategori === parseInt(item.id_kategori));
            if (c) catName = c.nama_kategori;
        }

        const stokUtuhVal = item.stok_utuh !== undefined ? parseInt(item.stok_utuh) : (parseInt(item.stok) || 0);
        const stokEceranVal = parseInt(item.stok_eceran) || 0;
        const konversiVal = parseInt(item.nilai_konversi) || 1;

        barangList.push({
            id_inventori: nextId,
            kode_barang: autoCode,
            nama_barang: item.nama_barang,
            kategori: catName,
            satuan: item.satuan, // Satuan Utuh
            satuan_eceran: item.satuan_eceran || null,
            nilai_konversi: konversiVal,
            harga_beli: parseFloat(item.harga_beli) || 0,
            harga_jual: parseFloat(item.harga_jual) || 0,
            stok: stokUtuhVal,
            stok_utuh: stokUtuhVal,
            stok_eceran: stokEceranVal,
            stok_minimum: parseInt(item.stok_minimum) || 5
        });
        
        this.saveTable('barang', barangList);
        return true;
    },

    updateBarang: function (id, item) {
        const barangList = this.getTable('barang');
        const index = barangList.findIndex(b => b.id_inventori === parseInt(id));
        if (index === -1) throw new Error('Barang tidak ditemukan!');

        let catName = item.kategori || barangList[index].kategori;
        if (item.id_kategori) {
            const categories = this.getTable('kategori');
            const c = categories.find(x => x.id_kategori === parseInt(item.id_kategori));
            if (c) catName = c.nama_kategori;
        }

        const currentBarang = barangList[index];
        const stokUtuhVal = item.stok_utuh !== undefined ? parseInt(item.stok_utuh) : (item.stok !== undefined ? parseInt(item.stok) : (currentBarang.stok_utuh !== undefined ? currentBarang.stok_utuh : currentBarang.stok));
        const stokEceranVal = item.stok_eceran !== undefined ? parseInt(item.stok_eceran) : (currentBarang.stok_eceran || 0);
        const konversiVal = item.nilai_konversi !== undefined ? parseInt(item.nilai_konversi) : (currentBarang.nilai_konversi || 1);

        barangList[index] = {
            ...currentBarang,
            nama_barang: item.nama_barang,
            kategori: catName,
            satuan: item.satuan,
            satuan_eceran: item.satuan_eceran !== undefined ? (item.satuan_eceran || null) : currentBarang.satuan_eceran,
            nilai_konversi: konversiVal,
            harga_beli: parseFloat(item.harga_beli),
            harga_jual: parseFloat(item.harga_jual),
            stok: stokUtuhVal,
            stok_utuh: stokUtuhVal,
            stok_eceran: stokEceranVal,
            stok_minimum: parseInt(item.stok_minimum)
        };
        
        this.saveTable('barang', barangList);
        return true;
    },

    // ==========================================
    // LOGIKA PEMECAHAN SATUAN BARANG
    // ==========================================
    addPemecahanSatuan: function (data) {
        const { id_inventori, qty_utuh, keterangan } = data;
        const idInt = parseInt(id_inventori);
        const qtyUtuhInt = parseInt(qty_utuh);

        if (!idInt || !qtyUtuhInt || qtyUtuhInt <= 0) {
            throw new Error('Jumlah utuh yang dipecah harus bernilai angka positif (> 0)!');
        }

        const barangList = this.getTable('barang');
        const index = barangList.findIndex(b => b.id_inventori === idInt);
        if (index === -1) throw new Error('Barang tidak ditemukan!');

        const item = barangList[index];
        const satuanUtuh = item.satuan || 'Sak';
        const satuanEceran = item.satuan_eceran;
        const nilaiKonversi = parseInt(item.nilai_konversi) || 0;
        const currentStokUtuh = item.stok_utuh !== undefined ? parseInt(item.stok_utuh) : parseInt(item.stok || 0);
        const currentStokEceran = parseInt(item.stok_eceran || 0);

        if (!satuanEceran || nilaiKonversi <= 0) {
            throw new Error(`Barang '${item.nama_barang}' belum memiliki konfigurasi Satuan Eceran dan Nilai Konversi yang valid!`);
        }

        if (currentStokUtuh < qtyUtuhInt) {
            throw new Error(`Stok utuh (${currentStokUtuh} ${satuanUtuh}) tidak mencukupi untuk dipecah sebanyak ${qtyUtuhInt} ${satuanUtuh}!`);
        }

        const qtyEceranHasil = qtyUtuhInt * nilaiKonversi;
        const newStokUtuh = currentStokUtuh - qtyUtuhInt;
        const newStokEceran = currentStokEceran + qtyEceranHasil;

        // Update stok pada master barang
        barangList[index].stok_utuh = newStokUtuh;
        barangList[index].stok = newStokUtuh; // alias kompatibilitas
        barangList[index].stok_eceran = newStokEceran;

        this.saveTable('barang', barangList);

        // Simpan record histori pemecahan
        const pemecahanList = this.getTable('pemecahan_barang');
        const nextId = this.getNextId('pemecahan_barang', 'id_pemecahan');
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

        pemecahanList.push({
            id_pemecahan: nextId,
            tanggal: nowStr,
            id_inventori: idInt,
            nama_barang: item.nama_barang,
            qty_utuh: qtyUtuhInt,
            satuan_utuh: satuanUtuh,
            qty_eceran: qtyEceranHasil,
            satuan_eceran: satuanEceran,
            nilai_konversi: nilaiKonversi,
            keterangan: keterangan || `Pemecahan ${qtyUtuhInt} ${satuanUtuh} menjadi ${qtyEceranHasil} ${satuanEceran}`
        });

        this.saveTable('pemecahan_barang', pemecahanList);
        return true;
    },

    getPemecahanHistory: function () {
        const list = this.getTable('pemecahan_barang');
        const barangList = this.getTable('barang');

        return list.map(p => {
            const b = barangList.find(x => x.id_inventori === p.id_inventori) || {};
            return {
                ...p,
                nama_barang: p.nama_barang || b.nama_barang || 'Barang Dihapus',
                kode_barang: b.kode_barang || '-'
            };
        }).sort((a, b) => b.id_pemecahan - a.id_pemecahan);
    },

    deleteBarang: function (id) {
        const idInt = parseInt(id);
        
        // Periksa riwayat pembelian
        const detailPembelian = this.getTable('detail_pembelian');
        const hasPembelian = detailPembelian.some(dp => dp.id_inventori === idInt);

        // Periksa riwayat penjualan
        const detailPenjualan = this.getTable('detail_penjualan');
        const hasPenjualan = detailPenjualan.some(dp => dp.id_inventori === idInt);

        if (hasPembelian || hasPenjualan) {
            throw new Error('Barang tidak dapat dihapus karena sudah memiliki riwayat transaksi pembelian atau penjualan!');
        }

        const barangList = this.getTable('barang');
        const filtered = barangList.filter(b => b.id_inventori !== idInt);
        this.saveTable('barang', filtered);
        return true;
    },

    // ==========================================
    // REVISI BARANG MASUK
    // ==========================================
    generateKodeSupplier: function () {
        const suppliers = this.getTable('supplier');
        if (suppliers.length === 0) return "SUP0001";
        const nums = suppliers.map(s => {
            const numPart = s.kode_supplier.substring(3);
            return parseInt(numPart) || 0;
        });
        const nextNum = Math.max(...nums) + 1;
        return "SUP" + nextNum.toString().padStart(4, "0");
    },

    generateNoPembelian: function () {
        const pembelian = this.getTable('pembelian');
        if (pembelian.length === 0) return "PBL000001";
        
        const nums = pembelian.map(p => {
            const numPart = p.no_pembelian.substring(3);
            return parseInt(numPart) || 0;
        });
        const nextNum = Math.max(...nums) + 1;
        return "PBL" + nextNum.toString().padStart(6, "0");
    },

    getBarangMasuk: function () {
        const detailPembelian = this.getTable('detail_pembelian');
        const pembelian = this.getTable('pembelian');
        const barangList = this.getTable('barang');
        const suppliers = this.getTable('supplier');

        // Render untuk riwayat barang masuk mendatar (flat row list)
        return detailPembelian.map(dp => {
            const parent = pembelian.find(p => p.no_pembelian === dp.no_pembelian) || {};
            const b = barangList.find(x => x.id_inventori === dp.id_inventori) || {};
            const s = suppliers.find(x => x.id_supplier === parent.id_supplier) || {};

            return {
                id_barang_masuk: dp.id_detail,
                tanggal: parent.tanggal || '',
                no_pembelian: dp.no_pembelian,
                id_barang: dp.id_inventori,
                nama_barang: b.nama_barang || 'Barang Dihapus',
                satuan: dp.satuan || b.satuan || '-',
                jumlah_masuk: dp.qty,
                harga_beli: dp.harga_beli,
                harga_jual: b.harga_jual || 0,
                keterangan: s.nama_supplier || 'Supplier Dihapus',
                nomor_faktur_supplier: parent.nomor_faktur_supplier || '-',
                metode_pembayaran: parent.metode_pembayaran || 'Tunai',
                status_pembayaran: parent.status_pembayaran || 'Lunas',
                jatuh_tempo: parent.jatuh_tempo || '-'
            };
        }).sort((a, b) => b.id_barang_masuk - a.id_barang_masuk);
    },

    addBarangMasukMulti: function (tanggal, supplierParam, items, extraData) {
        if (!tanggal || !supplierParam || !items || items.length === 0) {
            throw new Error('Informasi data barang masuk tidak lengkap!');
        }

        const pembelian = this.getTable('pembelian');
        const detailPembelian = this.getTable('detail_pembelian');
        const barangList = this.getTable('barang');
        const suppliers = this.getTable('supplier');

        // Cari supplier berdasarkan nama (case-insensitive) atau ID
        let resolvedSupplier = suppliers.find(s => 
            s.nama_supplier.toLowerCase() === supplierParam.toString().trim().toLowerCase() ||
            s.id_supplier === parseInt(supplierParam)
        );

        // Jika tidak ada di database, buat baru otomatis
        if (!resolvedSupplier) {
            const nextId = this.getNextId('supplier', 'id_supplier');
            const kode_supplier = this.generateKodeSupplier();
            resolvedSupplier = {
                id_supplier: nextId,
                kode_supplier: kode_supplier,
                nama_supplier: supplierParam.toString().trim(),
                alamat: extraData?.alamat_supplier || '-',
                no_telp: '-'
            };
            suppliers.push(resolvedSupplier);
            this.saveTable('supplier', suppliers);
        } else if (extraData?.alamat_supplier && extraData.alamat_supplier !== '-' && resolvedSupplier.alamat !== extraData.alamat_supplier) {
            resolvedSupplier.alamat = extraData.alamat_supplier;
            this.saveTable('supplier', suppliers);
        }

        const no_pembelian = this.generateNoPembelian();
        let nextDetailId = this.getNextId('detail_pembelian', 'id_detail');
        let total_pembelian = 0;

        items.forEach(item => {
            let id_inventori = item.id_inventori ? parseInt(item.id_inventori) : null;
            const qty = parseInt(item.qty);
            const buy = parseFloat(item.harga_beli);
            const sell = parseFloat(item.harga_jual);

            if (qty <= 0 || buy < 0 || sell < 0) {
                throw new Error('Jumlah masuk dan harga beli/jual harus bernilai positif!');
            }

            // Jika barang belum terdaftar di database master
            if (!id_inventori) {
                // Cek apakah barang dengan nama yang sama persis sudah ada di database master
                const existingMaster = barangList.find(b => b.nama_barang.toLowerCase() === item.nama_barang.trim().toLowerCase());
                if (existingMaster) {
                    id_inventori = existingMaster.id_inventori;
                } else {
                    // Buat barang baru
                    id_inventori = this.getNextId('barang', 'id_inventori');
                    const nextCodeNum = barangList.length + 1;
                    const kode_barang = "BRG" + nextCodeNum.toString().padStart(4, "0");
                    const newProduct = {
                        id_inventori: id_inventori,
                        kode_barang: kode_barang,
                        nama_barang: item.nama_barang.trim(),
                        kategori: 'Lainnya',
                        harga_beli: buy,
                        harga_jual: sell,
                        satuan: item.satuan || 'Pcs',
                        stok: 0,
                        stok_minimum: 5
                    };
                    barangList.push(newProduct);
                }
            }

            const subtotal = qty * buy;
            total_pembelian += subtotal;

            // Simpan detail
            detailPembelian.push({
                id_detail: nextDetailId++,
                no_pembelian: no_pembelian,
                id_inventori: id_inventori,
                qty: qty,
                harga_beli: buy,
                satuan: item.satuan,
                subtotal: subtotal
            });

            // Update stok dan harga di master barang
            const bIdx = barangList.findIndex(x => x.id_inventori === id_inventori);
            if (bIdx !== -1) {
                barangList[bIdx].stok += qty;
                barangList[bIdx].harga_beli = buy;
                barangList[bIdx].harga_jual = sell;
                barangList[bIdx].satuan = item.satuan;
            }
        });

        // Simpan header
        pembelian.push({
            no_pembelian: no_pembelian,
            tanggal: tanggal,
            id_supplier: resolvedSupplier.id_supplier,
            total_pembelian: total_pembelian,
            nomor_faktur_supplier: extraData?.nomor_faktur_supplier || '-',
            metode_pembayaran: extraData?.metode_pembayaran || 'Tunai',
            status_pembayaran: extraData?.status_pembayaran || 'Lunas',
            jatuh_tempo: extraData?.jatuh_tempo || '-'
        });

        this.saveTable('pembelian', pembelian);
        this.saveTable('detail_pembelian', detailPembelian);
        this.saveTable('barang', barangList);
        return true;
    },

    // ==========================================
    // REVISI PENJUALAN
    // ==========================================
    generateKodePelanggan: function (isToko) {
        const pelangganList = this.getTable('pelanggan');
        const prefix = isToko ? "TB" : "UM";
        const filtered = pelangganList.filter(p => p.kode_pelanggan.startsWith(prefix));
        
        if (filtered.length === 0) {
            return prefix + "0001";
        }
        
        const nums = filtered.map(p => {
            const numPart = p.kode_pelanggan.substring(prefix.length);
            return parseInt(numPart) || 0;
        });
        const nextNum = Math.max(...nums) + 1;
        return prefix + nextNum.toString().padStart(4, "0");
    },

    generateNoPenjualan: function () {
        const penjualan = this.getTable('penjualan');
        if (penjualan.length === 0) return "PJL000001";
        
        const nums = penjualan.map(p => {
            const numPart = p.no_penjualan.substring(3);
            return parseInt(numPart) || 0;
        });
        const nextNum = Math.max(...nums) + 1;
        return "PJL" + nextNum.toString().padStart(6, "0");
    },

    getSalesHistoryCombined: function () {
        const detailPenjualan = this.getTable('detail_penjualan');
        const penjualan = this.getTable('penjualan');
        const barangList = this.getTable('barang');
        const pelangganList = this.getTable('pelanggan');

        return detailPenjualan.map(dp => {
            const parent = penjualan.find(p => p.no_penjualan === dp.no_penjualan) || {};
            const b = barangList.find(x => x.id_inventori === dp.id_inventori) || {};
            const pl = pelangganList.find(x => x.id_pelanggan === parent.id_pelanggan) || {};

            return {
                id_penjualan: parent.id_penjualan || 0,
                no_penjualan: dp.no_penjualan,
                tanggal: parent.tanggal || '',
                nama_pembeli: pl.nama_pelanggan || 'Umum',
                alamat: pl.alamat || '-',
                nama_barang: b.nama_barang || 'Barang Dihapus',
                satuan: dp.satuan || b.satuan || '-',
                jumlah: dp.qty,
                harga_jual: dp.harga_jual,
                subtotal: dp.subtotal,
                metode_pembayaran: parent.metode_pembayaran || 'Tunai',
                status_pembayaran: parent.status_pembayaran || 'Lunas',
                jatuh_tempo: (parent.metode_pembayaran === 'Tempo' && parent.jatuh_tempo && parent.jatuh_tempo !== '-') ? parent.jatuh_tempo : null
            };
        }).sort((a, b) => b.id_penjualan - a.id_penjualan);
    },

    addPenjualanMulti: function (transaction, items) {
        if (!transaction.tanggal || !transaction.id_pelanggan || !items || items.length === 0) {
            throw new Error('Informasi transaksi penjualan tidak lengkap!');
        }

        const penjualan = this.getTable('penjualan');
        const detailPenjualan = this.getTable('detail_penjualan');
        const barangList = this.getTable('barang');
        const pelangganList = this.getTable('pelanggan');

        // Cari pelanggan berdasarkan nama (case-insensitive) atau ID
        const pelangganParam = transaction.id_pelanggan;
        let resolvedPelanggan = pelangganList.find(p => 
            p.nama_pelanggan.toLowerCase() === pelangganParam.toString().trim().toLowerCase() ||
            p.id_pelanggan === parseInt(pelangganParam)
        );

        // Jika tidak ditemukan di database, buat baru otomatis
        if (!resolvedPelanggan) {
            const nameTrimmed = pelangganParam.toString().trim();
            // Cek apakah diawali dengan kode TB/tb (misal: "TB Mandiri" atau "tb/Sejahtera" atau "tb-karya")
            const isToko = /^tb[\/\s-]?/i.test(nameTrimmed);
            const jenis = isToko ? 'Retail' : 'Umum';

            const nextId = this.getNextId('pelanggan', 'id_pelanggan');
            const kode_pelanggan = this.generateKodePelanggan(isToko);
            resolvedPelanggan = {
                id_pelanggan: nextId,
                kode_pelanggan: kode_pelanggan,
                nama_pelanggan: nameTrimmed,
                jenis_pelanggan: jenis,
                alamat: transaction.alamat_pelanggan || '-',
                no_telp: '-'
            };
            pelangganList.push(resolvedPelanggan);
            this.saveTable('pelanggan', pelangganList);
        } else if (transaction.alamat_pelanggan && transaction.alamat_pelanggan !== '-' && resolvedPelanggan.alamat !== transaction.alamat_pelanggan) {
            resolvedPelanggan.alamat = transaction.alamat_pelanggan;
            this.saveTable('pelanggan', pelangganList);
        }

        const no_penjualan = this.generateNoPenjualan();
        const nextSaleId = this.getNextId('penjualan', 'id_penjualan');
        let nextDetailId = this.getNextId('detail_penjualan', 'id_detail');
        let total_penjualan = 0;

        // Validasi stok dahulu sebelum memodifikasi
        items.forEach(item => {
            const id_inventori = parseInt(item.id_inventori);
            const qty = parseInt(item.qty);

            const b = barangList.find(x => x.id_inventori === id_inventori);
            if (!b) throw new Error('Barang tidak ditemukan!');
            if (b.stok < qty) {
                throw new Error(`Stok barang '${b.nama_barang}' tidak mencukupi! Tersedia: ${b.stok}`);
            }
        });

        items.forEach(item => {
            const id_inventori = parseInt(item.id_inventori);
            const qty = parseInt(item.qty);
            const sell = parseFloat(item.harga_jual);
            const subtotal = qty * sell;

            total_penjualan += subtotal;

            // Simpan detail
            detailPenjualan.push({
                id_detail: nextDetailId++,
                no_penjualan: no_penjualan,
                id_inventori: id_inventori,
                qty: qty,
                harga_jual: sell,
                satuan: item.satuan,
                subtotal: subtotal
            });

            // Potong stok
            const bIdx = barangList.findIndex(x => x.id_inventori === id_inventori);
            if (bIdx !== -1) {
                barangList[bIdx].stok -= qty;
                barangList[bIdx].satuan = item.satuan;
            }
        });

        // Simpan header
        penjualan.push({
            id_penjualan: nextSaleId,
            no_penjualan: no_penjualan,
            tanggal: transaction.tanggal,
            id_pelanggan: resolvedPelanggan.id_pelanggan,
            metode_pembayaran: transaction.metode_pembayaran || 'Tunai',
            status_pembayaran: transaction.status_pembayaran || 'Lunas',
            jatuh_tempo: transaction.jatuh_tempo || '-',
            total_penjualan: total_penjualan
        });

        this.saveTable('penjualan', penjualan);
        this.saveTable('detail_penjualan', detailPenjualan);
        this.saveTable('barang', barangList);
        return true;
    },

    // ==========================================
    // METRIK DASHBOARD & CHART
    // ==========================================
    getMetrics: function () {
        const barangList = this.getTable('barang');
        const penjualan = this.getTable('penjualan');
        const todayStr = new Date().toISOString().split('T')[0];

        const totalBarang = barangList.length;
        const salesToday = penjualan
            .filter(s => s.tanggal === todayStr)
            .reduce((sum, s) => sum + parseFloat(s.total_penjualan), 0);
        const totalTx = penjualan.length;
        const lowStock = barangList.filter(b => b.stok <= b.stok_minimum).length;

        return {
            total_barang: totalBarang,
            penjualan_hari_ini: salesToday,
            total_transaksi: totalTx,
            barang_hampir_habis: lowStock
        };
    },

    getTopSellingProducts: function () {
        const details = this.getTable('detail_penjualan');
        const barangList = this.getTable('barang');

        const productSales = {};
        details.forEach(d => {
            productSales[d.id_inventori] = (productSales[d.id_inventori] || 0) + d.qty;
        });

        const topProducts = [];
        for (const [id_inventori, qty] of Object.entries(productSales)) {
            const b = barangList.find(x => x.id_inventori === parseInt(id_inventori));
            if (b) {
                topProducts.push({
                    nama_barang: b.nama_barang,
                    total_terjual: qty,
                    satuan: b.satuan
                });
            }
        }
        
        return topProducts.sort((a, b) => b.total_terjual - a.total_terjual).slice(0, 5);
    },

    getRecentTransactions: function () {
        const penjualan = this.getTable('penjualan');
        const detailPenjualan = this.getTable('detail_penjualan');
        const pelangganList = this.getTable('pelanggan');
        
        return penjualan.map(s => {
            const pl = pelangganList.find(x => x.id_pelanggan === s.id_pelanggan) || {};
            const itemCount = detailPenjualan
                .filter(d => d.no_penjualan === s.no_penjualan)
                .reduce((sum, d) => sum + d.qty, 0);

            return {
                id_penjualan: s.id_penjualan,
                tanggal: s.tanggal,
                nama_pembeli: pl.nama_pelanggan || 'Umum',
                total_transaksi: s.total_penjualan,
                jumlah_item: itemCount
            };
        }).sort((a, b) => b.id_penjualan - a.id_penjualan).slice(0, 5);
    },

    getAlertStockList: function () {
        const barangList = this.getTable('barang');
        
        return barangList.filter(b => b.stok <= b.stok_minimum).map(b => {
            let status = 'Aman';
            if (b.stok === 0) status = 'Habis';
            else if (b.stok <= b.stok_minimum) status = 'Menipis';
            return {
                nama_barang: b.nama_barang,
                stok: b.stok,
                satuan: b.satuan,
                status: status
            };
        }).sort((a, b) => a.stok - b.stok).slice(0, 5);
    },

    getChartData: function (type) {
        const penjualan = this.getTable('penjualan');
        const today = new Date();

        if (type === 'harian') {
            const year = today.getFullYear();
            const month = today.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const values = Array(daysInMonth).fill(0);

            penjualan.forEach(s => {
                const sDate = new Date(s.tanggal);
                if (sDate.getFullYear() === year && sDate.getMonth() === month) {
                    const day = sDate.getDate();
                    values[day - 1] += parseFloat(s.total_penjualan);
                }
            });

            return {
                labels: labels,
                values: values,
                label: 'Penjualan Harian Bulan Ini'
            };
            
        } else if (type === 'bulanan') {
            const year = today.getFullYear();
            const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const values = Array(12).fill(0);

            penjualan.forEach(s => {
                const sDate = new Date(s.tanggal);
                if (sDate.getFullYear() === year) {
                    const month = sDate.getMonth();
                    values[month] += parseFloat(s.total_penjualan);
                }
            });

            return {
                labels: bulanNames,
                values: values,
                label: 'Penjualan Bulanan Tahun Ini'
            };
            
        } else if (type === 'tahunan') {
            const yearlySales = {};
            penjualan.forEach(s => {
                const year = new Date(s.tanggal).getFullYear();
                yearlySales[year] = (yearlySales[year] || 0) + parseFloat(s.total_penjualan);
            });

            const years = Object.keys(yearlySales).map(Number).sort((a, b) => a - b);
            if (years.length === 0) {
                years.push(today.getFullYear());
            }

            const values = years.map(yr => yearlySales[yr] || 0);

            return {
                labels: years,
                values: values,
                label: 'Penjualan Tahunan'
            };
        }
    },

    getPembelianHeaders: function () {
        const pembelian = this.getTable('pembelian');
        const suppliers = this.getTable('supplier');

        return pembelian.map(p => {
            const s = suppliers.find(x => x.id_supplier === p.id_supplier) || {};
            return {
                no_pembelian: p.no_pembelian,
                tanggal: p.tanggal,
                supplier: s.nama_supplier || 'Supplier Dihapus',
                total_pembelian: p.total_pembelian,
                metode_pembayaran: p.metode_pembayaran || 'Tunai',
                status_pembayaran: p.status_pembayaran || 'Lunas',
                jatuh_tempo: p.jatuh_tempo || '-'
            };
        }).sort((a, b) => b.no_pembelian.localeCompare(a.no_pembelian));
    },

    getPenjualanHeaders: function () {
        const penjualan = this.getTable('penjualan');
        const pelangganList = this.getTable('pelanggan');

        return penjualan.map(p => {
            const pl = pelangganList.find(x => x.id_pelanggan === p.id_pelanggan) || {};
            return {
                id_penjualan: p.id_penjualan,
                no_penjualan: p.no_penjualan,
                tanggal: p.tanggal,
                pelanggan: pl.nama_pelanggan || 'Umum',
                alamat: pl.alamat || '-',
                total_penjualan: p.total_penjualan,
                metode_pembayaran: p.metode_pembayaran || 'Tunai',
                status_pembayaran: p.status_pembayaran || 'Lunas',
                jatuh_tempo: p.jatuh_tempo || '-'
            };
        }).sort((a, b) => b.no_penjualan.localeCompare(a.no_penjualan));
    },

    // ==========================================
    // TAHAP 4: PEMBAYARAN HUTANG & PIUTANG ENGINE
    // ==========================================

    getTotalDibayarHutang: function (no_pembelian) {
        const payments = this.getTable('pembayaran_pembelian');
        return payments
            .filter(p => p.no_pembelian === no_pembelian)
            .reduce((sum, p) => sum + (parseFloat(p.jumlah_pembayaran) || 0), 0);
    },

    getTotalDibayarPiutang: function (no_penjualan) {
        const payments = this.getTable('pembayaran_penjualan');
        return payments
            .filter(p => p.no_penjualan === no_penjualan)
            .reduce((sum, p) => sum + (parseFloat(p.jumlah_pembayaran) || 0), 0);
    },

    getSisaHutang: function (no_pembelian) {
        const pembelian = this.getTable('pembelian');
        const p = pembelian.find(x => x.no_pembelian === no_pembelian);
        if (!p) return 0;
        const dibayar = this.getTotalDibayarHutang(no_pembelian);
        return Math.max(0, (parseFloat(p.total_pembelian) || 0) - dibayar);
    },

    getSisaPiutang: function (no_penjualan) {
        const penjualan = this.getTable('penjualan');
        const p = penjualan.find(x => x.no_penjualan === no_penjualan);
        if (!p) return 0;
        const dibayar = this.getTotalDibayarPiutang(no_penjualan);
        return Math.max(0, (parseFloat(p.total_penjualan) || 0) - dibayar);
    },

    calculateJatuhTempoStatus: function (jatuhTempoDateStr) {
        if (!jatuhTempoDateStr || jatuhTempoDateStr === '-') {
            return { status: 'Tanpa Jatuh Tempo', sisa_hari: null };
        }
        const todayStr = new Date().toISOString().split('T')[0];
        const due = new Date(jatuhTempoDateStr);
        const tdy = new Date(todayStr);
        const diffTime = due - tdy;
        const sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = 'Belum Jatuh Tempo';
        if (sisaHari < 0) status = 'Sudah Lewat Jatuh Tempo';
        else if (sisaHari === 0) status = 'Jatuh Tempo Hari Ini';

        return { status: status, sisa_hari: sisaHari };
    },

    getHistoriPembayaranHutang: function (no_pembelian) {
        const list = this.getTable('pembayaran_pembelian');
        return list
            .filter(p => p.no_pembelian === no_pembelian)
            .sort((a, b) => a.id_pembayaran - b.id_pembayaran);
    },

    getHistoriPembayaranPiutang: function (no_penjualan) {
        const list = this.getTable('pembayaran_penjualan');
        return list
            .filter(p => p.no_penjualan === no_penjualan)
            .sort((a, b) => a.id_pembayaran - b.id_pembayaran);
    },

    addPembayaranHutang: function (data) {
        if (!data || !data.no_pembelian) throw new Error('Nomor pembelian wajib diisi!');
        const nominal = parseFloat(data.jumlah_pembayaran);
        if (isNaN(nominal) || nominal <= 0) throw new Error('Jumlah pembayaran harus lebih dari 0!');

        const sisa = this.getSisaHutang(data.no_pembelian);
        if (sisa <= 0) throw new Error('Hutang untuk nota ini sudah LUNAS!');
        if (nominal > sisa) {
            throw new Error(`Nominal pembayaran tidak boleh melebihi sisa hutang (Rp ${sisa.toLocaleString('id-ID')})!`);
        }

        const list = this.getTable('pembayaran_pembelian');
        const nextId = this.getNextId('pembayaran_pembelian', 'id_pembayaran');
        const record = {
            id_pembayaran: nextId,
            no_pembelian: data.no_pembelian,
            tanggal_pembayaran: data.tanggal_pembayaran || new Date().toISOString().split('T')[0],
            jumlah_pembayaran: nominal,
            metode_pembayaran: data.metode_pembayaran || 'Tunai',
            keterangan: data.keterangan || ''
        };
        list.push(record);
        this.saveTable('pembayaran_pembelian', list);

        const sisaAfter = this.getSisaHutang(data.no_pembelian);
        if (sisaAfter <= 0) {
            const pembelian = this.getTable('pembelian');
            const idx = pembelian.findIndex(p => p.no_pembelian === data.no_pembelian);
            if (idx !== -1) {
                pembelian[idx].status_pembayaran = 'Lunas';
                this.saveTable('pembelian', pembelian);
            }
        }

        return record;
    },

    addPembayaranPiutang: function (data) {
        if (!data || !data.no_penjualan) throw new Error('Nomor penjualan wajib diisi!');
        const nominal = parseFloat(data.jumlah_pembayaran);
        if (isNaN(nominal) || nominal <= 0) throw new Error('Jumlah pembayaran harus lebih dari 0!');

        const sisa = this.getSisaPiutang(data.no_penjualan);
        if (sisa <= 0) throw new Error('Piutang untuk nota ini sudah LUNAS!');
        if (nominal > sisa) {
            throw new Error(`Nominal pembayaran tidak boleh melebihi sisa piutang (Rp ${sisa.toLocaleString('id-ID')})!`);
        }

        const list = this.getTable('pembayaran_penjualan');
        const nextId = this.getNextId('pembayaran_penjualan', 'id_pembayaran');
        const record = {
            id_pembayaran: nextId,
            no_penjualan: data.no_penjualan,
            tanggal_pembayaran: data.tanggal_pembayaran || new Date().toISOString().split('T')[0],
            jumlah_pembayaran: nominal,
            metode_pembayaran: data.metode_pembayaran || 'Tunai',
            keterangan: data.keterangan || ''
        };
        list.push(record);
        this.saveTable('pembayaran_penjualan', list);

        const sisaAfter = this.getSisaPiutang(data.no_penjualan);
        if (sisaAfter <= 0) {
            const penjualan = this.getTable('penjualan');
            const idx = penjualan.findIndex(p => p.no_penjualan === data.no_penjualan);
            if (idx !== -1) {
                penjualan[idx].status_pembayaran = 'Lunas';
                this.saveTable('penjualan', penjualan);
            }
        }

        return record;
    },

    getHutangSupplier: function () {
        const pembelian = this.getTable('pembelian');
        const suppliers = this.getTable('supplier');

        const todayStr = new Date().toISOString().split('T')[0];
        const result = [];

        pembelian.forEach(p => {
            if (p.metode_pembayaran === 'Tempo' || p.status_pembayaran === 'Belum Lunas') {
                const s = suppliers.find(x => x.id_supplier === p.id_supplier) || {};
                const totalDibayar = this.getTotalDibayarHutang(p.no_pembelian);
                const totalNota = parseFloat(p.total_pembelian) || 0;
                const sisaHutang = Math.max(0, totalNota - totalDibayar);

                if (sisaHutang > 0) {
                    let statusTempo = 'Belum Jatuh Tempo';
                    let sisaHari = null;

                    if (p.jatuh_tempo && p.jatuh_tempo !== '-') {
                        const due = new Date(p.jatuh_tempo);
                        const tdy = new Date(todayStr);
                        const diffTime = due - tdy;
                        sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (sisaHari < 0) statusTempo = 'Sudah Lewat Jatuh Tempo';
                        else if (sisaHari === 0) statusTempo = 'Jatuh Tempo Hari Ini';
                    }

                    result.push({
                        no_pembelian: p.no_pembelian,
                        tanggal: p.tanggal,
                        id_supplier: p.id_supplier,
                        supplier: s.nama_supplier || 'Supplier Dihapus',
                        nama_supplier: s.nama_supplier || 'Supplier Dihapus',
                        kode_supplier: s.kode_supplier || '-',
                        no_telp: s.no_telp || '-',
                        nomor_faktur_supplier: p.nomor_faktur_supplier || '-',
                        total_pembelian: totalNota,
                        total_hutang: totalNota,
                        total_dibayar: totalDibayar,
                        sisa_hutang: sisaHutang,
                        status_pembayaran: 'Belum Lunas',
                        metode_pembayaran: p.metode_pembayaran || 'Tempo',
                        jatuh_tempo: p.jatuh_tempo || '-',
                        status_jatuh_tempo: statusTempo,
                        sisa_hari: sisaHari
                    });
                }
            }
        });

        return result.sort((a, b) => b.no_pembelian.localeCompare(a.no_pembelian));
    },

    getPiutangPelanggan: function () {
        const penjualan = this.getTable('penjualan');
        const pelangganList = this.getTable('pelanggan');

        const todayStr = new Date().toISOString().split('T')[0];
        const result = [];

        penjualan.forEach(p => {
            if (p.metode_pembayaran === 'Tempo' || p.status_pembayaran === 'Belum Lunas') {
                const pl = pelangganList.find(x => x.id_pelanggan === p.id_pelanggan) || {};
                const totalDibayar = this.getTotalDibayarPiutang(p.no_penjualan);
                const totalNota = parseFloat(p.total_penjualan) || 0;
                const sisaPiutang = Math.max(0, totalNota - totalDibayar);

                if (sisaPiutang > 0) {
                    let statusTempo = 'Belum Jatuh Tempo';
                    let sisaHari = null;

                    if (p.jatuh_tempo && p.jatuh_tempo !== '-') {
                        const due = new Date(p.jatuh_tempo);
                        const tdy = new Date(todayStr);
                        const diffTime = due - tdy;
                        sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (sisaHari < 0) statusTempo = 'Sudah Lewat Jatuh Tempo';
                        else if (sisaHari === 0) statusTempo = 'Jatuh Tempo Hari Ini';
                    }

                    result.push({
                        no_penjualan: p.no_penjualan,
                        id_penjualan: p.id_penjualan,
                        tanggal: p.tanggal,
                        id_pelanggan: p.id_pelanggan,
                        pelanggan: pl.nama_pelanggan || 'Umum',
                        nama_pelanggan: pl.nama_pelanggan || 'Umum',
                        kode_pelanggan: pl.kode_pelanggan || '-',
                        no_telp: pl.no_telp || '-',
                        total_penjualan: totalNota,
                        total_piutang: totalNota,
                        total_dibayar: totalDibayar,
                        sisa_piutang: sisaPiutang,
                        status_pembayaran: 'Belum Lunas',
                        metode_pembayaran: p.metode_pembayaran || 'Tempo',
                        jatuh_tempo: p.jatuh_tempo || '-',
                        status_jatuh_tempo: statusTempo,
                        sisa_hari: sisaHari
                    });
                }
            }
        });

        return result.sort((a, b) => b.no_penjualan.localeCompare(a.no_penjualan));
    },

    exportToExcel: function (htmlTableContent, filename) {
        const blob = new Blob([htmlTableContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

DB.init();
