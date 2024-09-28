const fs = require('fs');
const fileName = 'todo.json'; // Nama file JSON yang digunakan

// Fungsi untuk menampilkan daftar task (command: list)
function tampilkanDaftarTask() {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    const tasks = JSON.parse(data);
    if (tasks.length === 0) {
      console.log('Tidak ada task yang tersedia.');
    } else {
      console.log("\n>>> Daftar Task <<<");
      tasks.forEach(task => {
        console.log(`- ID: ${task.id}, Nama: ${task.nama}`);
      });
    }
  });
}

// Fungsi untuk menampilkan task berdasarkan ID (command: task <task_id>)
function tampilkanTaskById(taskId) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    const tasks = JSON.parse(data);
    const task = tasks.find(task => task.id === parseInt(taskId));

    if (task) {
      console.log(`\nTask ID: ${task.id}`);
      console.log(`Nama Task: ${task.nama}`);
    } else {
      console.log(`Task dengan ID ${taskId} tidak ditemukan.`);
    }
  });
}

// Fungsi untuk menambah task (command: add <id> <nama_task>)
function tambahTask(id, nama) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    const tasks = JSON.parse(data);
    const taskBaru = { id: parseInt(id), nama };

    tasks.push(taskBaru);

    fs.writeFile(fileName, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
      if (err) {
        console.log('Error menulis file:', err);
        return;
      }
      console.log(`Task baru berhasil ditambahkan: ID: ${id}, Nama: ${nama}`);
    });
  });
}

// Fungsi untuk menghapus task (command: remove <task_id>)
function hapusTask(id) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    let tasks = JSON.parse(data);
    const index = tasks.findIndex(task => task.id === parseInt(id));

    if (index !== -1) {
      tasks.splice(index, 1);

      fs.writeFile(fileName, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error menulis file:', err);
          return;
        }
        console.log(`Task dengan ID ${id} berhasil dihapus.`);
      });
    } else {
      console.log(`Task dengan ID ${id} tidak ditemukan.`);
    }
  });
}

// Fungsi untuk menghapus semua task (command: clear)
function hapusSemuaTask() {
  fs.writeFile(fileName, JSON.stringify([], null, 2), 'utf8', (err) => {
    if (err) {
      console.log('Error menghapus semua task:', err);
      return;
    }
    console.log('Semua task berhasil dihapus.');
  });
}

// Menampilkan help / daftar command (command: help)
function tampilkanHelp() {
  console.log("\n>>>> JS TODO <<<<");
  console.log("$ node todo.js <command>");
  console.log("$ node todo.js list               # Tampilkan semua task");
  console.log("$ node todo.js task <task_id>      # Tampilkan task berdasarkan ID");
  console.log("$ node todo.js add <id> <nama>     # Tambah task baru");
  console.log("$ node todo.js remove <task_id>    # Hapus task berdasarkan ID");
  console.log("$ node todo.js clear              # Hapus semua task");
  console.log("$ node todo.js complete <task_id>  # Tandai task sebagai selesai");
  console.log("$ node todo.js incomplete <task_id># Tandai task sebagai belum selesai");
  console.log("$ node todo.js update <task_id> <nama> # Update task berdasarkan ID");
  console.log("$ node todo.js help               # Tampilkan daftar perintah");
  console.log("$ node todo.js exit               # Keluar dari aplikasi");
}

// Fungsi untuk menandai task sebagai selesai (command: complete <task_id>)
function tandaiTaskSelesai(id) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    let tasks = JSON.parse(data);
    const task = tasks.find(task => task.id === parseInt(id));

    if (task) {
      task.selesai = true;

      fs.writeFile(fileName, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error menulis file:', err);
          return;
        }
        console.log(`Task dengan ID ${id} ditandai sebagai selesai.`);
      });
    } else {
      console.log(`Task dengan ID ${id} tidak ditemukan.`);
    }
  });
}

// Fungsi untuk update task (command: update <task_id> <nama_baru>)
function updateTask(id, namaBaru) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log('Error membaca file:', err);
      return;
    }

    let tasks = JSON.parse(data);
    const task = tasks.find(task => task.id === parseInt(id));

    if (task) {
      task.nama = namaBaru;

      fs.writeFile(fileName, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
        if (err) {
          console.log('Error menulis file:', err);
          return;
        }
        console.log(`Task dengan ID ${id} berhasil diupdate.`);
      });
    } else {
      console.log(`Task dengan ID ${id} tidak ditemukan.`);
    }
  });
}

// Parsing argument dari command line
const args = process.argv.slice(2);

switch (args[0]) {
  case 'list':
    tampilkanDaftarTask();
    break;
  case 'task':
    tampilkanTaskById(args[1]);
    break;
  case 'add':
    tambahTask(args[1], args[2]);
    break;
  case 'remove':
    hapusTask(args[1]);
    break;
  case 'clear':
    hapusSemuaTask();
    break;
  case 'complete':
    tandaiTaskSelesai(args[1]);
    break;
  case 'incomplete':
    console.log('Belum diimplementasikan.');
    break;
  case 'update':
    updateTask(args[1], args[2]);
    break;
  case 'help':
    tampilkanHelp();
    break;
  case 'exit':
    console.log('Keluar dari aplikasi.');
    process.exit(0);
    break;
  default:
    console.log('Perintah tidak dikenal. Ketik "node todo.js help" untuk melihat daftar perintah.');
    break;
}
