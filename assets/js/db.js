// LocalStorage Database Emulator for Toko Bangunan
const DB = {
    // Initializer
    init: function () {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                { id_user: 1, username: 'admin', password: 'admin' }
            ]));
        }

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

        if (!localStorage.getItem('barang')) {
            localStorage.setItem('barang', JSON.stringify([
                { id_barang: 1, nama_barang: 'Semen Tiga Roda 50kg', id_kategori: 1, satuan: 'Sak', harga_beli: 65000, harga_jual: 70000, stok: 120, stok_minimum: 10 },
                { id_barang: 2, nama_barang: 'Besi Beton 10mm', id_kategori: 2, satuan: 'Batang', harga_beli: 55000, harga_jual: 62000, stok: 85, stok_minimum: 15 },
                { id_barang: 3, nama_barang: 'Cat Tembok Dulux 5kg', id_kategori: 3, satuan: 'PCS', harga_beli: 145000, harga_jual: 160000, stok: 4, stok_minimum: 5 },
                { id_barang: 4, nama_barang: 'Pipa PVC Wavin 1/2"', id_kategori: 4, satuan: 'Batang', harga_beli: 18000, harga_jual: 22000, stok: 50, stok_minimum: 10 },
                { id_barang: 5, nama_barang: 'Kayu Kaso 4x6', id_kategori: 5, satuan: 'Batang', harga_beli: 12000, harga_jual: 15000, stok: 0, stok_minimum: 5 }
            ]));
        }

        if (!localStorage.getItem('barang_masuk')) {
            localStorage.setItem('barang_masuk', JSON.stringify([
                { id_barang_masuk: 1, tanggal: '2026-06-10', id_barang: 1, jumlah_masuk: 100, harga_beli: 65000, harga_jual: 70000, keterangan: 'Stok awal supplier' },
                { id_barang_masuk: 2, tanggal: '2026-06-12', id_barang: 2, jumlah_masuk: 80, harga_beli: 55000, harga_jual: 62000, keterangan: 'Restock gudang' },
                { id_barang_masuk: 3, tanggal: '2026-06-15', id_barang: 3, jumlah_masuk: 10, harga_beli: 145000, harga_jual: 160000, keterangan: 'Pemasokan cat' }
            ]));
        }

        if (!localStorage.getItem('penjualan')) {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('penjualan', JSON.stringify([
                { id_penjualan: 1, tanggal: '2026-06-14', nama_pembeli: 'Toko Bangun Jaya', alamat: 'Jl. Sudirman 45', total_transaksi: 140000 },
                { id_penjualan: 2, tanggal: '2026-06-15', nama_pembeli: 'Pak Ahmad', alamat: 'Perum Indah B-12', total_transaksi: 186000 },
                { id_penjualan: 3, tanggal: today, nama_pembeli: 'Kontraktor Adi', alamat: 'Proyek Ruko Sentosa', total_transaksi: 960000 }
            ]));
        }

        if (!localStorage.getItem('detail_penjualan')) {
            localStorage.setItem('detail_penjualan', JSON.stringify([
                { id_detail: 1, id_penjualan: 1, id_barang: 1, jumlah: 2, harga_jual: 70000, subtotal: 140000 },
                { id_detail: 2, id_penjualan: 2, id_barang: 2, jumlah: 3, harga_jual: 62000, subtotal: 186000 },
                { id_detail: 3, id_penjualan: 3, id_barang: 3, jumlah: 6, harga_jual: 160000, subtotal: 960000 }
            ]));
        }
    },

    // Session Management
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminIndex = users.findIndex(u => u.username === 'admin');
        if (adminIndex !== -1) {
            users[adminIndex].password = newPassword;
        } else {
            users.push({ id_user: 1, username: 'admin', password: newPassword });
        }
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    },

    // Generic Operations
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

    // Category CRUD
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

        categories[index].nama_kategori = name;
        this.saveTable('kategori', categories);
        return true;
    },

    deleteCategory: function (id) {
        const idInt = parseInt(id);
        const barangList = this.getTable('barang');
        const count = barangList.filter(b => b.id_kategori === idInt).length;
        if (count > 0) {
            throw new Error(`Kategori tidak dapat dihapus karena masih digunakan oleh ${count} data barang!`);
        }

        const categories = this.getTable('kategori');
        const filtered = categories.filter(c => c.id_kategori !== idInt);
        this.saveTable('kategori', filtered);
        return true;
    },

    // Product CRUD
    getBarang: function () {
        const barangList = this.getTable('barang');
        const categories = this.getTable('kategori');
        return barangList.map(b => {
            const cat = categories.find(c => c.id_kategori === b.id_kategori);
            return {
                ...b,
                nama_kategori: cat ? cat.nama_kategori : 'Tidak Diketahui'
            };
        }).sort((a, b) => b.id_barang - a.id_barang);
    },

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

    deleteBarang: function (id) {
        const idInt = parseInt(id);
        const detailPenjualan = this.getTable('detail_penjualan');
        const checkSale = detailPenjualan.filter(dp => dp.id_barang === idInt).length;

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

    // Stock In Operations
    getBarangMasuk: function () {
        const inList = this.getTable('barang_masuk');
        const barangList = this.getTable('barang');
        return inList.map(bm => {
            const b = barangList.find(x => x.id_barang === bm.id_barang);
            return {
                ...bm,
                nama_barang: b ? b.nama_barang : 'Barang Dihapus',
                satuan: b ? b.satuan : '-'
            };
        }).sort((a, b) => b.id_barang_masuk - a.id_barang_masuk);
    },

    addBarangMasuk: function (entry) {
        const idBarang = parseInt(entry.id_barang);
        const qty = parseInt(entry.jumlah_masuk);
        const buy = parseFloat(entry.harga_beli);
        const sell = parseFloat(entry.harga_jual);

        if (idBarang <= 0 || qty <= 0 || buy < 0 || sell < 0) {
            throw new Error('Data input tidak valid!');
        }

        // Add history entry
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

        // Update product stock and prices
        const barangList = this.getTable('barang');
        const index = barangList.findIndex(b => b.id_barang === idBarang);
        if (index === -1) throw new Error('Barang tidak ditemukan!');

        barangList[index].stok += qty;
        barangList[index].harga_beli = buy;
        barangList[index].harga_jual = sell;

        this.saveTable('barang_masuk', inList);
        this.saveTable('barang', barangList);
        return true;
    },

    // Sales (Cashier) Operations
    getSalesHistoryCombined: function () {
        const sales = this.getTable('penjualan');
        const details = this.getTable('detail_penjualan');
        const barangList = this.getTable('barang');

        const combined = [];
        sales.forEach(p => {
            const txDetails = details.filter(d => d.id_penjualan === p.id_penjualan);
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
        return combined.sort((a, b) => b.id_penjualan - a.id_penjualan || b.id_detail - a.id_detail);
    },

    addPenjualan: function (sale) {
        const idBarang = parseInt(sale.id_barang);
        const qty = parseInt(sale.jumlah);
        const sellPrice = parseFloat(sale.harga_jual);

        if (!sale.tanggal || !sale.nama_pembeli || idBarang <= 0 || qty <= 0 || sellPrice < 0) {
            throw new Error('Data input tidak valid!');
        }

        // Verify stock
        const barangList = this.getTable('barang');
        const bIndex = barangList.findIndex(x => x.id_barang === idBarang);
        if (bIndex === -1) throw new Error('Barang tidak ditemukan!');
        if (barangList[bIndex].stok < qty) {
            throw new Error(`Stok barang '${barangList[bIndex].nama_barang}' tidak mencukupi! Tersedia: ${barangList[bIndex].stok}`);
        }

        // Compute subtotal
        const subtotal = qty * sellPrice;

        // Save penjualan header
        const salesList = this.getTable('penjualan');
        const idPenjualan = this.getNextId('penjualan', 'id_penjualan');
        salesList.push({
            id_penjualan: idPenjualan,
            tanggal: sale.tanggal,
            nama_pembeli: sale.nama_pembeli,
            alamat: sale.alamat || '',
            total_transaksi: subtotal
        });

        // Save penjualan details
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

        // Deduct stock
        barangList[bIndex].stok -= qty;

        this.saveTable('penjualan', salesList);
        this.saveTable('detail_penjualan', detailsList);
        this.saveTable('barang', barangList);
        return true;
    },

    // Metrics Calculations
    getMetrics: function () {
        const barangList = this.getTable('barang');
        const sales = this.getTable('penjualan');
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Total Barang (Unique count)
        const totalBarang = barangList.length;

        // 2. Sales Today
        const salesToday = sales
            .filter(s => s.tanggal === todayStr)
            .reduce((sum, s) => sum + parseFloat(s.total_transaksi), 0);

        // 3. Total Transactions
        const totalTx = sales.length;

        // 4. Low stock count (stok <= stok_minimum)
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
            productSales[d.id_barang] = (productSales[d.id_barang] || 0) + d.jumlah;
        });

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
        return topProducts.sort((a, b) => b.total_terjual - a.total_terjual).slice(0, 5);
    },

    getRecentTransactions: function () {
        const sales = this.getTable('penjualan');
        const details = this.getTable('detail_penjualan');
        return sales.map(s => {
            const itemCount = details.filter(d => d.id_penjualan === s.id_penjualan).reduce((sum, d) => sum + d.jumlah, 0);
            return {
                ...s,
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

    // Chart Data Builder
    getChartData: function (type) {
        const sales = this.getTable('penjualan');
        const today = new Date();

        if (type === 'harian') {
            // Get all days of the current month
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-indexed
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const values = Array(daysInMonth).fill(0);

            sales.forEach(s => {
                const sDate = new Date(s.tanggal);
                if (sDate.getFullYear() === year && sDate.getMonth() === month) {
                    const day = sDate.getDate();
                    values[day - 1] += parseFloat(s.total_transaksi);
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

            sales.forEach(s => {
                const sDate = new Date(s.tanggal);
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

    // Client-side Excel Exporter
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

// Initialize DB on script load
DB.init();
