-- Buat tabel jurusan dulu karena tabel mahasiswa tergantung padanya
CREATE TABLE jurusan (
    kodejurusan CHAR(2) PRIMARY KEY,
    namajurusan VARCHAR(20) NOT NULL
);

-- Buat tabel mahasiswa
CREATE TABLE mahasiswa (
    nim CHAR(8) PRIMARY KEY,
    nama VARCHAR(20) NOT NULL,
    alamat VARCHAR(50) NOT NULL,
    jurusan CHAR(2),
    FOREIGN KEY (jurusan) REFERENCES jurusan(kodejurusan)
);

-- Buat tabel dosen
CREATE TABLE dosen (
    nip CHAR(8) PRIMARY KEY,
    namadosen VARCHAR(20) NOT NULL
);

-- Buat tabel matakuliah
CREATE TABLE matakuliah (
    kodemk CHAR(5) PRIMARY KEY,
    namamk VARCHAR(20) NOT NULL,
    sks CHAR(2) NOT NULL,
    dosen CHAR(8),
    FOREIGN KEY (dosen) REFERENCES dosen(nip)
);

-- Menambahkan data jurusan
INSERT INTO jurusan (kodejurusan, namajurusan) VALUES ('IF', 'Informatika');
INSERT INTO jurusan (kodejurusan, namajurusan) VALUES ('SI', 'Sistem Informasi');

-- Menambahkan data mahasiswa
INSERT INTO mahasiswa (nim, nama, alamat, jurusan) VALUES ('A001', 'Messi', 'Rosario', 'IF');
INSERT INTO mahasiswa (nim, nama, alamat, jurusan) VALUES ('A002', 'Cristiano', 'Lisbon', 'SI');

-- Menambahkan data dosen
INSERT INTO dosen (nip, namadosen) VALUES ('12345', 'Guardiola');
INSERT INTO dosen (nip, namadosen) VALUES ('67890', 'Ancelotti');

-- Menambahkan data matakuliah
INSERT INTO matakuliah (kodemk, namamk, sks, dosen) VALUES ('MK001', 'Pemrograman Dasar', 3, '12345');
INSERT INTO matakuliah (kodemk, namamk, sks, dosen) VALUES ('MK002', 'Basis Data', 3, '67890');
