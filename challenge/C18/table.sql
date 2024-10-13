CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

user
INSERT INTO users (username, password, role) VALUES
('agis', 'magis08', 'admin');

CREATE TABLE mahasiswa (
    nim INTEGER PRIMARY KEY NOT NULL,
    nama TEXT NOT NULL,
    tgllahir DATE,
    alamat TEXT NOT NULL,
    kodejurusan INTEGER,
    namajurusan TEXT,
    FOREIGN KEY(kodejurusan) REFERENCES jurusan(kodejurusan),
    FOREIGN KEY(namajurusan) REFERENCES jurusan(namajurusan)
);

CREATE TABLE jurusan (
    kodejurusan INTEGER PRIMARY KEY NOT NULL,
    namajurusan TEXT
);

INSERT INTO jurusan (kodejurusan, namajurusan) VALUES ('01', 'INFORMATIKA');
INSERT INTO jurusan (kodejurusan, namajurusan) VALUES ('02', 'SISTEM INFORMASI');
INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, kodejurusan, namajurusan) VALUES ('2401', 'Messi', '2005-06-24', 'Lisbon', '02', 'SISTEM INFRORMASI');
INSERT INTO mahasiswa (nim, nama, tgllahir, alamat, kodejurusan, namajurusan) VALUES ('2201', 'Cristiano', '2003-02-05', 'Rosario', '01', 'INFORMATIKA');
