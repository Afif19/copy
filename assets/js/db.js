/**
 * LOCAL STORAGE DATABASE ENGINE & HELPER (db.js)
 * 
 * File ini bertindak sebagai simulator database (DBMS) di browser menggunakan localStorage.
 * Seluruh operasi CRUD (Create, Read, Update, Delete), validasi relasi tabel (Foreign Key),
 * dan penghitungan laporan dilakukan di sini.
 */

const DB = {
    
    /**
     * FUNGSI: init()
     * Deskripsi: Melakukan pengecekan dan inisialisasi tabel database lokal jika kosong.
     * Alur: Memeriksa apakah tabel sudah ada di localStorage, jika belum, buat array kosong 
     *       dan isi dengan data sampel (seed data) awal agar aplikasi tidak kosong.
     * Terhubung dengan: Dipanggil secara otomatis ketika file db.js dimuat di semua halaman HTML.
     */
    init: function () {
        // 1. Inisialisasi Tabel Users (Untuk login admin)
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                { id_user: 1, username: 'admin', password: 'admin' } // Akun admin default
            ]));
        }

        // 2. Inisialisasi Tabel Kategori (Untuk pengelompokan barang)
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

        // 3. Inisialisasi Tabel Barang (Stok utama)
        if (!localStorage.getItem('barang')) {
            localStorage.setItem('barang', JSON.stringify([
                { id_barang: 1, nama_barang: 'Semen Tiga Roda 50kg', id_kategori: 1, satuan: 'Sak', harga_beli: 65000, harga_jual: 70000, stok: 120, stok_minimum: 10 },
                { id_barang: 2, nama_barang: 'Besi Beton 10mm', id_kategori: 2, satuan: 'Batang', harga_beli: 55000, harga_jual: 62000, stok: 85, stok_minimum: 15 },
                { id_barang: 3, nama_barang: 'Cat Tembok Dulux 5kg', id_kategori: 3, satuan: 'PCS', harga_beli: 145000, harga_jual: 160000, stok: 4, stok_minimum: 5 },
                { id_barang: 4, nama_barang: 'Pipa PVC Wavin 1/2"', id_kategori: 4, satuan: 'Batang', harga_beli: 18000, harga_jual: 22000, stok: 50, stok_minimum: 10 },
                { id_barang: 5, nama_barang: 'Kayu Kaso 4x6', id_kategori: 5, satuan: 'Batang', harga_beli: 12000, harga_jual: 15000, stok: 0, stok_minimum: 5 }
            ]));
        }

        // 4. Inisialisasi Tabel Barang Masuk (Riwayat penambahan stok)
        if (!localStorage.getItem('barang_masuk')) {
            localStorage.setItem('barang_masuk', JSON.stringify([
                { id_barang_masuk: 1, tanggal: '2026-06-10', id_barang: 1, jumlah_masuk: 100, harga_beli: 65000, harga_jual: 70000, keterangan: 'Stok awal supplier' },
                { id_barang_masuk: 2, tanggal: '2026-06-12', id_barang: 2, jumlah_masuk: 80, harga_beli: 55000, harga_jual: 62000, keterangan: 'Restock gudang' },
                { id_barang_masuk: 3, tanggal: '2026-06-15', id_barang: 3, jumlah_masuk: 10, harga_beli: 145000, harga_jual: 160000, keterangan: 'Pemasokan cat' }
            ]));
        }

        // 5. Inisialisasi Tabel Penjualan (Header invoice penjualan)
        if (!localStorage.getItem('penjualan')) {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('penjualan', JSON.stringify([
                { id_penjualan: 1, tanggal: '2026-06-14', nama_pembeli: 'Toko Bangun Jaya', alamat: 'Jl. Sudirman 45', total_transaksi: 140000 },
                { id_penjualan: 2, tanggal: '2026-06-15', nama_pembeli: 'Pak Ahmad', alamat: 'Perum Indah B-12', total_transaksi: 186000 },
                { id_penjualan: 3, tanggal: today, nama_pembeli: 'Kontraktor Adi', alamat: 'Proyek Ruko Sentosa', total_transaksi: 960000 }
            ]));
        }

        // 6. Inisialisasi Tabel Detail Penjualan (Rincian barang per transaksi/invoice)
        if (!localStorage.getItem('detail_penjualan')) {
            localStorage.setItem('detail_penjualan', JSON.stringify([
                { id_detail: 1, id_penjualan: 1, id_barang: 1, jumlah: 2, harga_jual: 70000, subtotal: 140000 },
                { id_detail: 2, id_penjualan: 2, id_barang: 2, jumlah: 3, harga_jual: 62000, subtotal: 186000 },
                { id_detail: 3, id_penjualan: 3, id_barang: 3, jumlah: 6, harga_jual: 160000, subtotal: 960000 }
            ]));
        }
    },

    /**
     * FUNGSI: checkAuth(isLoginPage)
     * Deskripsi: Sistem filter keamanan halaman (middleware).
     * Parameter:
     *   - isLoginPage (boolean): True jika kode dijalankan di halaman login.html.
     * Alur: Memeriksa flag sesi login di sessionStorage/localStorage. 
     *       Jika belum login dan membuka halaman utama, alihkan ke login.html.
     *       Jika sudah login dan membuka halaman login, alihkan ke dashboard.html.
     * Terhubung dengan: Dipanggil di header semua halaman HTML utama & form login.html.
     */
    checkAuth: function (isLoginPage = false) {
        const isLoggedIn = sessionStorage.getItem('login') === 'true' || localStorage.getItem('login') === 'true';
        const rootPath = window.location.pathname.includes('/auth/') ? '../' : '';

        if (!isLoggedIn && !isLoginPage) {
            // Belum login dan mencoba akses dashboard/barang -> paksa ke halaman login
            window.location.href = rootPath + 'auth/login.html';
        } else if (isLoggedIn && isLoginPage) {
            // Sudah login tapi coba buka form login lagi -> kembalikan ke dashboard
            window.location.href = '../dashboard.html';
        }
    },

    /**
     * FUNGSI: login(username, password, rememberMe)
     * Deskripsi: Autentikasi user.
     * Parameter:
     *   - username (string)
     *   - password (string)
     *   - rememberMe (boolean): Jika true, simpan status login secara permanen di localStorage.
     * Kembalian: boolean (true jika username & password cocok, false jika salah).
     * Terhubung dengan: Dipanggil oleh event submit form di login.html.
     */
    login: function (username, password, rememberMe = false) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        // Cari user yang memiliki username & password cocok
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Set session agar halaman lain mengenali bahwa user telah sukses masuk
            sessionStorage.setItem('login', 'true');
            sessionStorage.setItem('username', user.username);
            if (rememberMe) {
                // Simpan permanen jika checkbox 'Ingat saya' dicentang
                localStorage.setItem('login', 'true');
                localStorage.setItem('username', user.username);
            }
            return true;
        }
        return false;
    },

    /**
     * FUNGSI: logout()
     * Deskripsi: Mengakhiri sesi login user.
     * Alur: Menghapus flag login dan username dari penyimpanan, kemudian dialihkan ke login.html.
     * Terhubung dengan: Dipanggil oleh tombol "Logout" di sidebar.html, header.html, dan file logout.html.
     */
    logout: function () {
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('username');
        localStorage.removeItem('login');
        localStorage.removeItem('username');
        const rootPath = window.location.pathname.includes('/auth/') ? '' : 'auth/';
        window.location.href = rootPath + 'login.html';
    },

    /**
     * FUNGSI: resetPassword(newPassword)
     * Deskripsi: Mengatur ulang sandi akun admin.
     * Parameter:
     *   - newPassword (string)
     * Terhubung dengan: Dipanggil secara otomatis saat membuka file reset_password.html.
     */
    resetPassword: function (newPassword) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminIndex = users.findIndex(u => u.username === 'admin');
        if (adminIndex !== -1) {
            users[adminIndex].password = newPassword; // Ubah password admin yang ada
        } else {
            users.push({ id_user: 1, username: 'admin', password: newPassword }); // Buat baru jika terhapus
        }
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },

    /**
     * FUNGSI: getTable(tableName)
     * Deskripsi: Mengambil mentahan data tabel dari localStorage dan di-parse ke array objek JS.
     * Parameter:
     *   - tableName (string)
     * Kembalian: Array of Objects
     */
    getTable: function (tableName) {
        return JSON.parse(localStorage.getItem(tableName) || '[]');
    },

    /**
     * FUNGSI: saveTable(tableName, data)
     * Deskripsi: Menyimpan array objek JS kembali ke localStorage dalam format string JSON.
     * Parameter:
     *   - tableName (string)
     *   - data (Array of Objects)
     */
    saveTable: function (tableName, data) {
        localStorage.setItem(tableName, JSON.stringify(data));
    },

    /**
     * FUNGSI: getNextId(table, idField)
     * Deskripsi: Auto-Increment simulator. Mencari ID terbesar dalam suatu tabel dan menambahkannya 1.
     * Parameter:
     *   - table (string): Nama tabel
     *   - idField (string): Kolom Primary Key (misal: 'id_barang')
     * Kembalian: integer (ID baru yang siap dipakai)
     */
    getNextId: function (table, idField) {
        const data = this.getTable(table);
        if (data.length === 0) return 1;
        const ids = data.map(item => item[idField]);
        return Math.max(...ids) + 1; // ID Terbesar + 1
    },

    /**
     * FUNGSI: getCategories()
     * Deskripsi: Mengambil semua data kategori dan diurutkan secara alfabet (A-Z).
     * Kembalian: Array Kategori
     * Terhubung dengan: `kategori.html` (isi tabel) & `barang.html` (pilihan dropdown saat tambah/edit barang).
     */
    getCategories: function () {
        return this.getTable('kategori').sort((a, b) => a.nama_kategori.localeCompare(b.nama_kategori));
    },

    /**
     * FUNGSI: addCategory(name)
     * Deskripsi: Menambahkan kategori baru.
     * Parameter:
     *   - name (string)
     * Alur: Validasi agar nama kategori tidak boleh kembar (Unique Constraint).
     * Terhubung dengan: Form submit di modal Tambah Kategori di `kategori.html`.
     */
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

    /**
     * FUNGSI: updateCategory(id, name)
     * Deskripsi: Mengubah nama kategori berdasarkan ID.
     * Parameter:
     *   - id (int)
     *   - name (string): Nama baru
     * Terhubung dengan: Form submit di modal Ubah Kategori di `kategori.html`.
     */
    updateCategory: function (id, name) {
        const categories = this.getTable('kategori');
        const index = categories.findIndex(c => c.id_kategori === parseInt(id));
        if (index === -1) throw new Error('Kategori tidak ditemukan!');
        
        // Cek apakah nama baru sudah dipakai oleh kategori lain
        if (categories.some((c, idx) => idx !== index && c.nama_kategori.toLowerCase() === name.toLowerCase())) {
            throw new Error('Nama kategori sudah digunakan!');
        }

        categories[index].nama_kategori = name;
        this.saveTable('kategori', categories);
        return true;
    },

    /**
     * FUNGSI: deleteCategory(id)
     * Deskripsi: Menghapus kategori berdasarkan ID.
     * Parameter:
     *   - id (int)
     * Alur: VALIDASI FOREIGN KEY! Jika kategori ini sedang dipakai oleh suatu barang 
     *       di tabel barang, batalkan penghapusan demi menjaga integritas data relasional.
     * Terhubung dengan: Tombol Hapus (trash icon) di `kategori.html`.
     */
    deleteCategory: function (id) {
        const idInt = parseInt(id);
        const barangList = this.getTable('barang');
        // Cari apakah ada barang yang berkategori ini
        const count = barangList.filter(b => b.id_kategori === idInt).length;
        if (count > 0) {
            throw new Error(`Kategori tidak dapat dihapus karena masih digunakan oleh ${count} data barang!`);
        }

        const categories = this.getTable('kategori');
        const filtered = categories.filter(c => c.id_kategori !== idInt);
        this.saveTable('kategori', filtered);
        return true;
    },

    /**
     * FUNGSI: getBarang()
     * Deskripsi: Mengambil seluruh barang dan melakukan INNER JOIN manual dengan tabel kategori.
     * Kembalian: Array Barang + Nama Kategori-nya.
     * Terhubung dengan: Tabel inventori di `barang.html` dan `laporan.html` (Laporan Stok).
     */
    getBarang: function () {
        const barangList = this.getTable('barang');
        const categories = this.getTable('kategori');
        
        // Simulasikan Query: SELECT barang.*, kategori.nama_kategori FROM barang JOIN kategori ON ...
        return barangList.map(b => {
            const cat = categories.find(c => c.id_kategori === b.id_kategori);
            return {
                ...b,
                nama_kategori: cat ? cat.nama_kategori : 'Tidak Diketahui'
            };
        }).sort((a, b) => b.id_barang - a.id_barang); // Urutkan dari barang terbaru (ID terbesar)
    },

    /**
     * FUNGSI: addBarang(item)
     * Deskripsi: Menyimpan barang baru ke tabel.
     * Parameter:
     *   - item (Object): Berisi nama, kategori, satuan, harga beli, harga jual, stok awal, stok minimum.
     * Terhubung dengan: Form submit di modal Tambah Barang di `barang.html`.
     */
    addBarang: function (item) {
        const barangList = this.getTable('barang');
        const nextId = this.getNextId('barang', 'id_barang');
        
        barangList.push({
            id_barang: nextId,
            nama_barang: item.nama_barang,
            id_kategori: parseInt(item.id_kategori),
            satuan: item.satuan,
            harga_beli: parseFloat(item.harga_beli),
            harga_jual: parseFloat(item.harga_jual),
            stok: parseInt(item.stok) || 0,
            stok_minimum: parseInt(item.stok_minimum) || 5
        });
        
        this.saveTable('barang', barangList);
        return true;
    },

    /**
     * FUNGSI: updateBarang(id, item)
     * Deskripsi: Mengubah detail barang berdasarkan ID.
     * Parameter:
     *   - id (int)
     *   - item (Object): Detail data baru
     * Terhubung dengan: Form submit di modal Edit Barang di `barang.html`.
     */
    updateBarang: function (id, item) {
        const barangList = this.getTable('barang');
        const index = barangList.findIndex(b => b.id_barang === parseInt(id));
        if (index === -1) throw new Error('Barang tidak ditemukan!');

        barangList[index] = {
            ...barangList[index],
            nama_barang: item.nama_barang,
            id_kategori: parseInt(item.id_kategori),
            satuan: item.satuan,
            harga_beli: parseFloat(item.harga_beli),
            harga_jual: parseFloat(item.harga_jual),
            stok: parseInt(item.stok),
            stok_minimum: parseInt(item.stok_minimum)
        };
        
        this.saveTable('barang', barangList);
        return true;
    },

    /**
     * FUNGSI: deleteBarang(id)
     * Deskripsi: Menghapus barang berdasarkan ID.
     * Parameter:
     *   - id (int)
     * Alur: VALIDASI RELASIONAL! Jika barang ini memiliki riwayat transaksi di tabel
     *       `detail_penjualan` atau tabel `barang_masuk`, gagalkan penghapusan data 
     *       agar laporan keuangan dan mutasi barang masa lalu tetap akurat (tidak rusak).
     * Terhubung dengan: Tombol Hapus (trash icon) di `barang.html`.
     */
    deleteBarang: function (id) {
        const idInt = parseInt(id);
        
        // Cek riwayat penjualan
        const detailPenjualan = this.getTable('detail_penjualan');
        const checkSale = detailPenjualan.filter(dp => dp.id_barang === idInt).length;

        // Cek riwayat barang masuk
        const barangMasuk = this.getTable('barang_masuk');
        const checkIn = barangMasuk.filter(bm => bm.id_barang === idInt).length;

        if (checkSale > 0 || checkIn > 0) {
            throw new Error('Barang tidak dapat dihapus karena sudah memiliki riwayat transaksi penjualan atau barang masuk!');
        }

        const barangList = this.getTable('barang');
        const filtered = barangList.filter(b => b.id_barang !== idInt);
        this.saveTable('barang', filtered);
        return true;
    },

    /**
     * FUNGSI: getBarangMasuk()
     * Deskripsi: Mengambil seluruh riwayat barang masuk supplier dan di-JOIN dengan data barang.
     * Kembalian: Array Mutasi Masuk + Nama & Satuan barangnya.
     * Terhubung dengan: Tabel Riwayat di `barang_masuk.html`.
     */
    getBarangMasuk: function () {
        const inList = this.getTable('barang_masuk');
        const barangList = this.getTable('barang');
        
        // Lakukan join manual agar kita tahu nama barang dari ID barang yang dicatat
        return inList.map(bm => {
            const b = barangList.find(x => x.id_barang === bm.id_barang);
            return {
                ...bm,
                nama_barang: b ? b.nama_barang : 'Barang Dihapus',
                satuan: b ? b.satuan : '-'
            };
        }).sort((a, b) => b.id_barang_masuk - a.id_barang_masuk);
    },

    /**
     * FUNGSI: addBarangMasuk(entry)
     * Deskripsi: Menambahkan mutasi barang masuk supplier (Restok).
     * Parameter:
     *   - entry (Object): Berisi id_barang, tanggal, jumlah_masuk, harga_beli baru, harga_jual baru.
     * Alur: 1. Catat transaksi baru ke tabel `barang_masuk`.
     *       2. Update stok barang di tabel `barang` (stok = stok + jumlah_masuk).
     *       3. Update harga_beli dan harga_jual di tabel `barang` ke harga terbaru.
     * Terhubung dengan: Form submit transaksi di `barang_masuk.html`.
     */
    addBarangMasuk: function (entry) {
        const idBarang = parseInt(entry.id_barang);
        const qty = parseInt(entry.jumlah_masuk);
        const buy = parseFloat(entry.harga_beli);
        const sell = parseFloat(entry.harga_jual);

        if (idBarang <= 0 || qty <= 0 || buy < 0 || sell < 0) {
            throw new Error('Data input tidak valid!');
        }

        // 1. Simpan ke tabel mutasi masuk
        const inList = this.getTable('barang_masuk');
        const nextId = this.getNextId('barang_masuk', 'id_barang_masuk');
        inList.push({
            id_barang_masuk: nextId,
            tanggal: entry.tanggal,
            id_barang: idBarang,
            jumlah_masuk: qty,
            harga_beli: buy,
            harga_jual: sell,
            keterangan: entry.keterangan || ''
        });

        // 2. Perbarui nilai stok dan harga di master barang
        const barangList = this.getTable('barang');
        const index = barangList.findIndex(b => b.id_barang === idBarang);
        if (index === -1) throw new Error('Barang tidak ditemukan!');

        barangList[index].stok += qty; // Tambahkan stok
        barangList[index].harga_beli = buy; // Set harga beli baru
        barangList[index].harga_jual = sell; // Set harga jual baru

        // 3. Simpan perubahan kedua tabel ke localStorage
        this.saveTable('barang_masuk', inList);
        this.saveTable('barang', barangList);
        return true;
    },

    /**
     * FUNGSI: getSalesHistoryCombined()
     * Deskripsi: Menggabungkan tabel penjualan, detail_penjualan, dan barang (JOIN 3 tabel).
     * Kembalian: Array of objek transaksi gabungan.
     * Terhubung dengan: Riwayat Penjualan di `penjualan.html` dan `laporan.html` (Laporan Penjualan).
     */
    getSalesHistoryCombined: function () {
        const sales = this.getTable('penjualan');
        const details = this.getTable('detail_penjualan');
        const barangList = this.getTable('barang');

        const combined = [];
        
        // Loop setiap data invoice penjualan
        sales.forEach(p => {
            // Filter rincian item (details) yang dimiliki oleh invoice ini
            const txDetails = details.filter(d => d.id_penjualan === p.id_penjualan);
            
            // Gabungkan rincian item tersebut dengan data nama barangnya
            txDetails.forEach(d => {
                const b = barangList.find(x => x.id_barang === d.id_barang);
                combined.push({
                    id_penjualan: p.id_penjualan,
                    tanggal: p.tanggal,
                    nama_pembeli: p.nama_pembeli,
                    alamat: p.alamat || '-',
                    nama_barang: b ? b.nama_barang : 'Barang Dihapus',
                    satuan: b ? b.satuan : '-',
                    jumlah: d.jumlah,
                    harga_jual: d.harga_jual,
                    subtotal: d.subtotal
                });
            });
        });
        
        // Urutkan dari transaksi paling baru (ID penjualan terbesar)
        return combined.sort((a, b) => b.id_penjualan - a.id_penjualan || b.id_detail - a.id_detail);
    },

    /**
     * FUNGSI: addPenjualan(sale)
     * Deskripsi: Mencatat transaksi penjualan baru (Kasir).
     * Parameter:
     *   - sale (Object): id_barang, tanggal, nama_pembeli, alamat, jumlah, harga_jual.
     * Alur: 1. Periksa ketersediaan stok barang. Jika stok < jumlah beli, batalkan transaksi.
     *       2. Catat data penjualan baru ke tabel `penjualan` (Header Invoice).
     *       3. Catat rincian item ke tabel `detail_penjualan`.
     *       4. Kurangi stok barang di tabel master `barang` (stok = stok - jumlah beli).
     * Terhubung dengan: Form submit di kasir `penjualan.html`.
     */
    addPenjualan: function (sale) {
        const idBarang = parseInt(sale.id_barang);
        const qty = parseInt(sale.jumlah);
        const sellPrice = parseFloat(sale.harga_jual);

        if (!sale.tanggal || !sale.nama_pembeli || idBarang <= 0 || qty <= 0 || sellPrice < 0) {
            throw new Error('Data input tidak valid!');
        }

        // 1. Validasi kecukupan stok barang
        const barangList = this.getTable('barang');
        const bIndex = barangList.findIndex(x => x.id_barang === idBarang);
        if (bIndex === -1) throw new Error('Barang tidak ditemukan!');
        
        if (barangList[bIndex].stok < qty) {
            throw new Error(`Stok barang '${barangList[bIndex].nama_barang}' tidak mencukupi! Tersedia: ${barangList[bIndex].stok}`);
        }

        // Hitung total harga item
        const subtotal = qty * sellPrice;

        // 2. Simpan header transaksi penjualan
        const salesList = this.getTable('penjualan');
        const idPenjualan = this.getNextId('penjualan', 'id_penjualan');
        salesList.push({
            id_penjualan: idPenjualan,
            tanggal: sale.tanggal,
            nama_pembeli: sale.nama_pembeli,
            alamat: sale.alamat || '',
            total_transaksi: subtotal
        });

        // 3. Simpan rincian transaksi penjualan
        const detailsList = this.getTable('detail_penjualan');
        const idDetail = this.getNextId('detail_penjualan', 'id_detail');
        detailsList.push({
            id_detail: idDetail,
            id_penjualan: idPenjualan,
            id_barang: idBarang,
            jumlah: qty,
            harga_jual: sellPrice,
            subtotal: subtotal
        });

        // 4. Potong jumlah stok barang yang terjual
        barangList[bIndex].stok -= qty;

        // 5. Simpan semua update tabel ke localStorage
        this.saveTable('penjualan', salesList);
        this.saveTable('detail_penjualan', detailsList);
        this.saveTable('barang', barangList);
        return true;
    },

    /**
     * FUNGSI: getMetrics()
     * Deskripsi: Menghitung akumulasi data ringkas untuk widget box atas.
     * Kembalian: Object berisi { total_barang, penjualan_hari_ini, total_transaksi, barang_hampir_habis }
     * Terhubung dengan: Box metrik widget di `dashboard.html`.
     */
    getMetrics: function () {
        const barangList = this.getTable('barang');
        const sales = this.getTable('penjualan');
        const todayStr = new Date().toISOString().split('T')[0]; // Format tanggal hari ini: YYYY-MM-DD

        // Metrik 1: Total variasi barang unik
        const totalBarang = barangList.length;

        // Metrik 2: Total pendapatan kotor dari transaksi hari ini
        const salesToday = sales
            .filter(s => s.tanggal === todayStr)
            .reduce((sum, s) => sum + parseFloat(s.total_transaksi), 0);

        // Metrik 3: Total seluruh invoice penjualan yang tercatat
        const totalTx = sales.length;

        // Metrik 4: Jumlah barang yang stoknya kurang dari atau sama dengan batas minimal
        const lowStock = barangList.filter(b => b.stok <= b.stok_minimum).length;

        return {
            total_barang: totalBarang,
            penjualan_hari_ini: salesToday,
            total_transaksi: totalTx,
            barang_hampir_habis: lowStock
        };
    },

    /**
     * FUNGSI: getTopSellingProducts()
     * Deskripsi: Mengakumulasi jumlah penjualan tiap barang dan mengambil 5 barang dengan penjualan terbanyak.
     * Kembalian: Array 5 barang terlaris.
     * Terhubung dengan: Tabel "5 Barang Terlaris" di sebelah kanan grafik `dashboard.html`.
     */
    getTopSellingProducts: function () {
        const details = this.getTable('detail_penjualan');
        const barangList = this.getTable('barang');

        // Akumulasikan total terjual per ID Barang
        const productSales = {};
        details.forEach(d => {
            productSales[d.id_barang] = (productSales[d.id_barang] || 0) + d.jumlah;
        });

        // Ubah map ID barang ke array objek yang menyertakan Nama & Satuan barang
        const topProducts = [];
        for (const [id_barang, total_terjual] of Object.entries(productSales)) {
            const b = barangList.find(x => x.id_barang === parseInt(id_barang));
            if (b) {
                topProducts.push({
                    nama_barang: b.nama_barang,
                    total_terjual: total_terjual,
                    satuan: b.satuan
                });
            }
        }
        
        // Urutkan dari jumlah terjual terbanyak, ambil 5 teratas
        return topProducts.sort((a, b) => b.total_terjual - a.total_terjual).slice(0, 5);
    },

    /**
     * FUNGSI: getRecentTransactions()
     * Deskripsi: Mengambil 5 transaksi penjualan terakhir dan menghitung total item barang per invoice.
     * Kembalian: Array 5 transaksi terbaru.
     * Terhubung dengan: Tabel "Transaksi Terakhir" di bagian bawah kiri `dashboard.html`.
     */
    getRecentTransactions: function () {
        const sales = this.getTable('penjualan');
        const details = this.getTable('detail_penjualan');
        
        return sales.map(s => {
            // Jumlahkan total kuantitas barang yang dibeli dalam invoice ini
            const itemCount = details.filter(d => d.id_penjualan === s.id_penjualan).reduce((sum, d) => sum + d.jumlah, 0);
            return {
                ...s,
                jumlah_item: itemCount
            };
        }).sort((a, b) => b.id_penjualan - a.id_penjualan).slice(0, 5);
    },

    /**
     * FUNGSI: getAlertStockList()
     * Deskripsi: Menyaring barang-barang yang stoknya kritis (di bawah minimum) untuk diberi status peringatan.
     * Kembalian: Array barang kritis teratas.
     * Terhubung dengan: Tabel "Peringatan Stok Hampir Habis" di kanan bawah `dashboard.html`.
     */
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
        }).sort((a, b) => a.stok - b.stok).slice(0, 5); // Tampilkan yang paling kritis (stok terendah) dulu
    },

    /**
     * FUNGSI: getChartData(type)
     * Deskripsi: Menyusun data grafik penjualan harian, bulanan, atau tahunan.
     * Parameter:
     *   - type (string): 'harian' | 'bulanan' | 'tahunan'
     * Kembalian: Object data yang kompatibel dengan format grafik Chart.js { labels, values, label }
     * Terhubung dengan: Grafik penjualan di `dashboard.html`.
     */
    getChartData: function (type) {
        const sales = this.getTable('penjualan');
        const today = new Date();

        if (type === 'harian') {
            // A. FILTER HARIAN (Bulan ini)
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-indexed
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Hitung jumlah hari bulan berjalan

            const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1); // 1, 2, ..., 30/31
            const values = Array(daysInMonth).fill(0);

            sales.forEach(s => {
                const sDate = new Date(s.tanggal);
                // Cek jika transaksi terjadi pada bulan dan tahun yang sama dengan hari ini
                if (sDate.getFullYear() === year && sDate.getMonth() === month) {
                    const day = sDate.getDate();
                    values[day - 1] += parseFloat(s.total_transaksi); // Tambahkan ke tanggal ybs
                }
            });

            return {
                labels: labels,
                values: values,
                label: 'Penjualan Harian Bulan Ini'
            };
            
        } else if (type === 'bulanan') {
            // B. FILTER BULANAN (Tahun ini)
            const year = today.getFullYear();
            const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const values = Array(12).fill(0); // 12 Bulan

            sales.forEach(s => {
                const sDate = new Date(s.tanggal);
                // Cek jika terjadi pada tahun berjalan
                if (sDate.getFullYear() === year) {
                    const month = sDate.getMonth();
                    values[month] += parseFloat(s.total_transaksi);
                }
            });

            return {
                labels: bulanNames,
                values: values,
                label: 'Penjualan Bulanan Tahun Ini'
            };
            
        } else if (type === 'tahunan') {
            // C. FILTER TAHUNAN (Semua tahun transaksi)
            const yearlySales = {};
            sales.forEach(s => {
                const year = new Date(s.tanggal).getFullYear();
                yearlySales[year] = (yearlySales[year] || 0) + parseFloat(s.total_transaksi);
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

    /**
     * FUNGSI: exportToExcel(htmlTableContent, filename)
     * Deskripsi: Menghasilkan file unduhan Excel instan secara client-side menggunakan Blob.
     * Parameter:
     *   - htmlTableContent (string): Struktur baris HTML table laporan.
     *   - filename (string): Nama file unduhan (.xls)
     * Terhubung dengan: Tombol Export Excel di tab Penjualan dan Laporan Stok di `laporan.html`.
     */
    exportToExcel: function (htmlTableContent, filename) {
        // Konversi string HTML ke Blob dengan format aplikasi excel
        const blob = new Blob([htmlTableContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click(); // Trigger dialog unduh browser
        document.body.removeChild(link);
    }
};

// Panggil fungsi inisialisasi tabel database saat pertama kali script ini dimuat browser
DB.init();
