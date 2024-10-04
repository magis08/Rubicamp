-- Table yang diubah
-- Table mahasiswa ditambah kolom tgllahir

ALTER TABLE mahasiswa
ADD tgllahir DATE;

-- nambah data tgllahir
UPDATE mahasiswa SET tgllahir = '2005-06-17'
WHERE nim = 'A001';

UPDATE mahasiswa SET tgllahir = '2003-02-07'
WHERE nim = 'A002';

--1. menampilkan data seluruh mahasiswa
SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, mahasiswa.jurusan, jurusan.namajurusan
FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan;

--2. menampilkan mahasiswa yang berumur kurang dari 20 tahun
SELECT nim, nama, tgllahir FROM mahasiswa
WHERE (strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', tgllahir)) < 20;

--3. menampilkan mahasiswa yang memiliki nilai B ke atas
SELECT mahasiswa.nama, assignment.id, assignment.nim, assignment.kodemk, assignment.nip, assignment.nilai
FROM mahasiswa, assignment WHERE mahasiswa.nim = assignment.nim
AND assignment.nilai IN ('A', 'B');

--4. menampilkan mahasiswa yang memiliki jumlah SKS lebih dari 10
SELECT mahasiswa.nama, SUM(matakuliah.sks) AS total_sks FROM assignment
JOIN mahasiswa ON assignment.nim = mahasiswa.nim
JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
GROUP BY mahasiswa.nama HAVING total_sks > 10;

--5. menampilkan mahasiswa yang mengontrak matakuliah 'data mining'
SELECT nama FROM mahasiswa JOIN assignment ON mahasiswa.nim = assignment.nim
JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
WHERE matakuliah.namamk LIKE 'Data Mining';

--6 menampilkan jumlah mahasiswa untuk setiap dosen
SELECT dosen.namadosen, COUNT(DISTINCT assignment.nim)
FROM assignment
JOIN dosen ON assignment.nip = dosen.nip
JOIN mahasiswa ON assignment.nim = mahasiswa.nim
GROUP BY dosen.namadosen;

--7. urutkan mahasiswa berdasarkan umurnya
SELECT nim, nama, ROUND(strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', tgllahir)) AS umur FROM mahasiswa
ORDER BY umur;

--8. menampilkan nilai matakuliah yang harus diulang (nilai D dan E),
--serta tampilkan data mahasiswa jurusan dan dosen secara lengkap. 
--gunakan metode JOIN dan WHERE clause (2 solusi syntx SQL)
-- JOIN
SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, jurusan.kodejurusan, jurusan.namajurusan, dosen.nip, dosen.namadosen, matakuliah.namamk, assignment.nilai
FROM mahasiswa
JOIN jurusan ON mahasiswa.jurusan = jurusan.kodejurusan
JOIN assignment ON mahasiswa.nim = assignment.nim
JOIN matakuliah ON assignment.kodemk = matakuliah.kodemk
JOIN dosen ON matakuliah.dosen = dosen.nip
WHERE assignment.nilai IN ('D', 'E');

-- WHERE
SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, jurusan.kodejurusan, jurusan.namajurusan, dosen.nip, dosen.namadosen, matakuliah.namamk, assignment.nilai
FROM mahasiswa, dosen, matakuliah, assignment, jurusan
WHERE mahasiswa.jurusan = jurusan.kodejurusan
AND mahasiswa.nim = assignment.nim
AND assignment.kodemk = matakuliah.kodemk
AND matakuliah.dosen = dosen.nip
AND assignment.nilai IN ('D', 'E');


