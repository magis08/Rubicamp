CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

user
INSERT INTO users (username, password, role) VALUES
('agis', 'magis08', 'admin');

-- Buat tabel jurusan dulu karena tabel mahasiswa tergantung padanya
CREATE TABLE jurusan (
    kodejurusan CHAR(2) PRIMARY KEY,
    namajurusan VARCHAR(20) NOT NULL
);

-- Buat tabel mahasiswa
CREATE TABLE mahasiswa (
    nim CHAR(8) PRIMARY KEY,
    nama VARCHAR(20) NOT NULL,
    alamat VARCHAR(50) NOT NULL, -- pake TEXT lebih bagus
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
    sks INT NOT NULL,
    dosen CHAR(8),
    FOREIGN KEY (dosen) REFERENCES dosen(nip)
);

-- Buat tabel assign
CREATE TABLE assignment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nim CHAR(8) NOT NULL,
    kodemk CHAR(5) NOT NULL,
    nip CHAR(8) NOT NULL,
    nilai VARCHAR(3),
    FOREIGN KEY(nim) REFERENCES mahasiswa(nim),
    FOREIGN KEY(kodemk) REFERENCES matakuliah(kodemk),
    FOREIGN KEY(nip) REFERENCES dosen(nip)
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

-- Menambahkan nilai Mahasiswa
INSERT INTO assignment (nim, kodemk, nip, nilai) VALUES ('A001', 'MK001', '12345', 'A');
INSERT INTO assignment (nim, kodemk, nip, nilai) VALUES ('A002', 'MK001', '12345', 'A');

UPDATE assignment
SET namamk = (
    SELECT namamk
    FROM matakuliah
    WHERE matakuliah.kodemk = assignment.kodemk
);


-- tgllahir
SELECT nama, tgllahir, 
       (STRFTIME('%Y', 'now') - STRFTIME('%Y', tgllahir)) 
       - (STRFTIME('%m-%d', 'now') < STRFTIME('%m-%d', tgllahir)) 
       AS umur
FROM mahasiswa;
UPDATE mahasiswa SET tgllahir = '2005-06-24' WHERE nim = 'A001';
UPDATE mahasiswa SET tgllahir = '2003-02-05' WHERE nim = 'A002';