-- Database Toko Bangunan
CREATE DATABASE IF NOT EXISTS `db_toko_bangunan`;
USE `db_toko_bangunan`;

-- 1. Tabel User
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Kategori
CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_kategori` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Barang
CREATE TABLE IF NOT EXISTS `barang` (
  `id_barang` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_barang` VARCHAR(150) NOT NULL,
  `id_kategori` INT NOT NULL,
  `satuan` VARCHAR(20) NOT NULL,
  `harga_beli` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `harga_jual` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `stok` INT NOT NULL DEFAULT 0,
  `stok_minimum` INT NOT NULL DEFAULT 5,
  FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Penjualan
CREATE TABLE IF NOT EXISTS `penjualan` (
  `id_penjualan` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `nama_pembeli` VARCHAR(100) NOT NULL,
  `alamat` TEXT DEFAULT NULL,
  `total_transaksi` DECIMAL(12,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Detail Penjualan
CREATE TABLE IF NOT EXISTS `detail_penjualan` (
  `id_detail` INT AUTO_INCREMENT PRIMARY KEY,
  `id_penjualan` INT NOT NULL,
  `id_barang` INT NOT NULL,
  `jumlah` INT NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan` (`id_penjualan`) ON DELETE CASCADE,
  FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Barang Masuk
CREATE TABLE IF NOT EXISTS `barang_masuk` (
  `id_barang_masuk` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `id_barang` INT NOT NULL,
  `jumlah_masuk` INT NOT NULL,
  `harga_beli` DECIMAL(12,2) NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `keterangan` TEXT DEFAULT NULL,
  FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default user admin (username: admin, password: admin)
-- Bcrypt hash of 'admin': $2y$10$tZ2yD0Y3bE3W9sF.4Z6fEeT.Uq0mR9nZ.qH2uX1F4N8sU.p5c2yOq
INSERT INTO `users` (`id_user`, `username`, `password`) 
VALUES (1, 'admin', '$2y$10$tZ2yD0Y3bE3W9sF.4Z6fEeT.Uq0mR9nZ.qH2uX1F4N8sU.p5c2yOq')
ON DUPLICATE KEY UPDATE `password` = VALUES(`password`);
