-- DATABASE TOKO BANGUNAN: TB AA BAROKAH
-- Dibuat untuk kebutuhan penelitian skripsi manajemen stok dan penjualan back office.

CREATE DATABASE IF NOT EXISTS `db_toko_bangunan`;
USE `db_toko_bangunan`;

-- Menurunkan pemeriksaan Foreign Key sementara waktu untuk mencegah error saat proses DROP
SET FOREIGN_KEY_CHECKS = 0;

-- Menghapus tabel lama jika sudah ada di database untuk mencegah konflik kegagalan
DROP TABLE IF EXISTS `detail_penjualan`;
DROP TABLE IF EXISTS `detail_pembelian`;
DROP TABLE IF EXISTS `penjualan`;
DROP TABLE IF EXISTS `pembelian`;
DROP TABLE IF EXISTS `pelanggan`;
DROP TABLE IF EXISTS `supplier`;
DROP TABLE IF EXISTS `barang`;
DROP TABLE IF EXISTS `kategori`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `barang_masuk`; -- Tabel skema lama jika ada

-- Mengaktifkan kembali pemeriksaan Foreign Key
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL USERS
-- Menyimpan data kredensial admin back office.
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL KATEGORI
-- Menyimpan data kategori pembantu untuk barang.
CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_kategori` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL BARANG
-- Menyimpan data master inventori barang bangunan.
CREATE TABLE IF NOT EXISTS `barang` (
  `id_inventori` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_barang` VARCHAR(20) UNIQUE NOT NULL,
  `nama_barang` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(100) NOT NULL, -- Disimpan langsung sebagai string VARCHAR sesuai instruksi revisi
  `satuan` VARCHAR(20) NOT NULL,
  `harga_beli` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `harga_jual` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `stok` INT NOT NULL DEFAULT 0,
  `stok_minimum` INT NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL SUPPLIER
-- Menyimpan data supplier pengadaan barang.
CREATE TABLE IF NOT EXISTS `supplier` (
  `id_supplier` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_supplier` VARCHAR(20) UNIQUE NOT NULL,
  `nama_supplier` VARCHAR(100) NOT NULL,
  `alamat` TEXT DEFAULT NULL,
  `no_telp` VARCHAR(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL PELANGGAN
-- Menyimpan data pelanggan toko.
CREATE TABLE IF NOT EXISTS `pelanggan` (
  `id_pelanggan` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_pelanggan` VARCHAR(20) UNIQUE NOT NULL,
  `nama_pelanggan` VARCHAR(100) NOT NULL,
  `jenis_pelanggan` VARCHAR(50) NOT NULL DEFAULT 'Umum', -- Umum, Retail
  `alamat` TEXT DEFAULT NULL,
  `no_telp` VARCHAR(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL HEADER PEMBELIAN (BARANG MASUK)
-- Menyimpan informasi nota induk pembelian barang masuk dari supplier.
CREATE TABLE IF NOT EXISTS `pembelian` (
  `no_pembelian` VARCHAR(20) PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `id_supplier` INT NOT NULL,
  `total_pembelian` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `nomor_faktur_supplier` VARCHAR(50) NOT NULL,
  `metode_pembayaran` VARCHAR(50) NOT NULL DEFAULT 'Tunai', -- Tunai, Transfer, Tempo
  `status_pembayaran` VARCHAR(50) NOT NULL DEFAULT 'Lunas', -- Lunas, Belum Lunas
  `jatuh_tempo` VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id_supplier`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL DETAIL PEMBELIAN
-- Menyimpan rincian barang-barang yang dibeli dalam satu transaksi barang masuk.
CREATE TABLE IF NOT EXISTS `detail_pembelian` (
  `id_detail` INT AUTO_INCREMENT PRIMARY KEY,
  `no_pembelian` VARCHAR(20) NOT NULL,
  `id_inventori` INT NOT NULL,
  `qty` INT NOT NULL,
  `harga_beli` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`no_pembelian`) REFERENCES `pembelian` (`no_pembelian`) ON DELETE CASCADE,
  FOREIGN KEY (`id_inventori`) REFERENCES `barang` (`id_inventori`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABEL HEADER PENJUALAN
-- Menyimpan informasi nota induk penjualan barang toko.
CREATE TABLE IF NOT EXISTS `penjualan` (
  `no_penjualan` VARCHAR(20) PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `id_pelanggan` INT NOT NULL,
  `metode_pembayaran` VARCHAR(50) NOT NULL DEFAULT 'Tunai', -- Tunai, Transfer, Tempo
  `status_pembayaran` VARCHAR(50) NOT NULL DEFAULT 'Lunas', -- Lunas, Belum Lunas
  `jatuh_tempo` VARCHAR(50) DEFAULT NULL,
  `total_penjualan` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABEL DETAIL PENJUALAN
-- Menyimpan rincian barang-barang yang terjual dalam satu nota penjualan.
CREATE TABLE IF NOT EXISTS `detail_penjualan` (
  `id_detail` INT AUTO_INCREMENT PRIMARY KEY,
  `no_penjualan` VARCHAR(20) NOT NULL,
  `id_inventori` INT NOT NULL,
  `qty` INT NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`no_penjualan`) REFERENCES `penjualan` (`no_penjualan`) ON DELETE CASCADE,
  FOREIGN KEY (`id_inventori`) REFERENCES `barang` (`id_inventori`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- SEED DATA AWAL (CONTOH DATA DEFAULT)
-- ==========================================

-- Seed default user admin (username: admin, password: admin)
-- Password di-hash menggunakan PHP password_hash() dengan BCRYPT.
INSERT INTO `users` (`id_user`, `username`, `password`) 
VALUES (1, 'admin', '$2y$10$VPp9Uek9nsN7nNscN96Paeu.SykFZCE.bmZcgNNphxxGejUlnrD2a')
ON DUPLICATE KEY UPDATE `password` = VALUES(`password`);

-- Seed Kategori default
INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Semen'),
(2, 'Besi & Baja'),
(3, 'Cat & Perlengkapan'),
(4, 'Pipa & Fitting'),
(5, 'Kayu'),
(6, 'Kelistrikan'),
(7, 'Paku & Baut');

-- Seed Supplier default
INSERT INTO `supplier` (`id_supplier`, `kode_supplier`, `nama_supplier`, `alamat`, `no_telp`) VALUES
(1, 'SUP0001', 'PT Semen Indonesia', 'Gresik, Jawa Timur', '081122334455'),
(2, 'SUP0002', 'Krakatau Steel', 'Cilegon, Banten', '081234567890'),
(3, 'SUP0003', 'Dulux Paint Utama', 'Jakarta Barat', '081399887766');

-- Seed Pelanggan default
INSERT INTO `pelanggan` (`id_pelanggan`, `kode_pelanggan`, `nama_pelanggan`, `jenis_pelanggan`, `alamat`, `no_telp`) VALUES
(1, 'UM0001', 'Umum / Walk-in', 'Umum', 'Toko Fisik', '-'),
(2, 'TB0001', 'TB Karya Mandiri', 'Retail', 'Jl. Merdeka No. 10', '085611223344'),
(3, 'TB0002', 'TB Budi Hartono', 'Retail', 'Perum Sentosa Indah C-5', '087812345678');

-- Seed Barang default
INSERT INTO `barang` (`id_inventori`, `kode_barang`, `nama_barang`, `kategori`, `satuan`, `harga_beli`, `harga_jual`, `stok`, `stok_minimum`) VALUES
(1, 'BRG0001', 'Semen Tiga Roda 50kg', 'Semen', 'Sak', 65000.00, 70000.00, 120, 10),
(2, 'BRG0002', 'Besi Beton 10mm', 'Besi & Baja', 'Batang', 55000.00, 62000.00, 85, 15),
(3, 'BRG0003', 'Cat Tembok Dulux 5kg', 'Cat & Perlengkapan', 'Pcs', 145000.00, 160000.00, 4, 5),
(4, 'BRG0004', 'Pipa PVC Wavin 1/2"', 'Pipa & Fitting', 'Batang', 18000.00, 22000.00, 50, 10),
(5, 'BRG0005', 'Kayu Kaso 4x6', 'Kayu', 'Batang', 12000.00, 15000.00, 0, 5);

-- Seed Transaksi Pembelian (Barang Masuk) - Format nomor pembelian 6-digit: PBL000001
INSERT INTO `pembelian` (`no_pembelian`, `tanggal`, `id_supplier`, `total_pembelian`, `nomor_faktur_supplier`, `metode_pembayaran`, `status_pembayaran`, `jatuh_tempo`) VALUES
('PBL000001', '2026-06-10', 1, 6500000.00, '0100/GCU', 'Tunai', 'Lunas', NULL),
('PBL000002', '2026-06-12', 2, 4400000.00, '0200/GCU', 'Tempo', 'Belum Lunas', '2026-07-12');

INSERT INTO `detail_pembelian` (`no_pembelian`, `id_inventori`, `qty`, `harga_beli`, `subtotal`) VALUES
('PBL000001', 1, 100, 65000.00, 6500000.00),
('PBL000002', 2, 80, 55000.00, 4400000.00);

-- Seed Transaksi Penjualan (Nota Penjualan) - Format nomor penjualan 6-digit: PJL000001
INSERT INTO `penjualan` (`no_penjualan`, `tanggal`, `id_pelanggan`, `metode_pembayaran`, `status_pembayaran`, `jatuh_tempo`, `total_penjualan`) VALUES
('PJL000001', '2026-06-14', 1, 'Tunai', 'Lunas', NULL, 140000.00),
('PJL000002', '2026-06-15', 2, 'Transfer', 'Lunas', NULL, 186000.00);

INSERT INTO `detail_penjualan` (`no_penjualan`, `id_inventori`, `qty`, `harga_jual`, `subtotal`) VALUES
('PJL000001', 1, 2, 70000.00, 140000.00),
('PJL000002', 2, 3, 62000.00, 186000.00);
