const fs = require('fs'); // Modul untuk operasi file
const args = process.argv.slice(2); // Mengambil argumen dari command line
const filePath = 'todo.json'; // Path file JSON

function fileExists(path) { // Memeriksa file ada atau tidak (pengaman)
    return fs.existsSync(path);
}

function readTodos() { // Membaca isi file JSON
    if (!fileExists(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.todos;
}

function writeTodos(todos) { // Menimpa file JSON
    const jsonData = { todos: todos };
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
}

function addTodo(task) { // fungsi add
    const todos = readTodos();
    todos.push({ task: task, completed: false, tags: [] }); // Tambahkan properti tags yang diinisialisasi sebagai array
    writeTodos(todos); // timpa file JSON
    console.log(`"${task}" telah ditambahkan.`);
}


function showTodos() { // Fungsi untuk menampilkan semua task
    const todos = readTodos();
    if (todos.length === 0) {
        console.log('Tidak ada kegiatan.');
    } else {
        console.log('Todo List:');
        for (let i = 0; i < todos.length; i++) {
            const status = todos[i].completed ? '[X]' : '[ ]'; // Tentukan status
            console.log(`${i + 1}. ${status} ${todos[i].task}`); // Tampilkan task dengan status
        }
    }
}

function deleteTodo(index) { // Fungsi untuk menghapus task
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.');
    } else {
        const removedTask = todos.splice(index - 1, 1); // Menghapus menggunakan splice
        writeTodos(todos);
        console.log(`"${removedTask[0].task}" telah dihapus.`);
    }
}

function showTask(index) {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Task tidak ditemukan.');
    } else {
        const todo = todos[index - 1];
        const status = todo.completed ? 'sudah dilakukan' : 'belum dilakukan';
        console.log(`Detail kegiatan:`);
        console.log(`Task ${index} : ${todo.task}`);
        console.log(`Status : ${status}`);
        console.log(`Tag : ${Array.isArray(todo.tags) ? todo.tags.join(', ') : 'Tidak ada tag'}`); // Tampilkan tag
    }
}


function completeTask(index) { // Fungsi untuk menandai task sebagai selesai
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.');
    } else {
        todos[index - 1].completed = true;
        writeTodos(todos);
        console.log(`"${todos[index - 1].task}" telah dilakukan.`);
    }
}

function uncompleteTask(index) { // Fungsi untuk menandai task sebagai belum selesai
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.');
    } else {
        todos[index - 1].completed = false;
        writeTodos(todos);
        console.log(`"${todos[index - 1].task}" status selesai dibatalkan.`);
    }
}

function tagTask(index, tags) { // Fungsi untuk menambahkan tag
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Task tidak ditemukan.');
    } else {
        todos[index - 1].tags = [...new Set([...todos[index - 1].tags, ...tags])]; // Tambahkan tag unik
        writeTodos(todos);
        console.log(`Tag ${tags.join(', ')} telah ditambahkan ke "${todos[index - 1].task}".`);
    }
}

function listOutstanding() { // Fungsi untuk mengecek tugas yang belum dikerjakan
    const todos = readTodos();
    let hasOutstanding = false;

    console.log('Daftar pekerjaan:');
    for (let i = 0; i < todos.length; i++) {
        if (!todos[i].completed) {
            console.log(`${i + 1}. [ ] ${todos[i].task}`);
            hasOutstanding = true;
        }
    }
    if (!hasOutstanding) {
        console.log('Semua tugas telah selesai.');
    }
}

function completedDesc() { // Fungsi untuk mengecek tugas yang sudah selesai
    const todos = readTodos();
    let hasCompleted = false;

    console.log('Daftar pekerjaan:');
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].completed) {
            console.log(`${i + 1}. [X] ${todos[i].task}`);
            hasCompleted = true;
        }
    }
    if (!hasCompleted) {
        console.log('Tidak ada tugas yang sudah selesai.');
    }
}

function filterTodos(keyword) { // Fungsi untuk filter
    const todos = readTodos();
    let hasMatches = false;

    console.log(`Daftar pekerjaan:`);
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].task.toLowerCase().includes(keyword.toLowerCase())) {
            const status = todos[i].completed ? '[X]' : '[ ]';
            console.log(`${i + 1}. ${status} ${todos[i].task}`);
            hasMatches = true;
        }
    }
    if (!hasMatches) {
        console.log(`Tidak ada tugas yang cocok dengan kata kunci "${keyword}".`);
    }
}

// Syarat-syarat argumen per fungsi
if (args[0] === 'add' && args.length > 1) {
    const task = args.slice(1).join(' ');
    addTodo(task);
} else if (args[0] === 'list') {
    showTodos();
} else if (args[0] === 'listOutstanding') {
    listOutstanding();
} else if (args[0] === 'completedDsc') {
    completedDesc();
} else if (args[0] === 'delete' && args[1]) {
    const taskNumber = parseInt(args[1]);
    if (!isNaN(taskNumber)) {
        deleteTodo(taskNumber);
    } else {
        console.log('Tolong masukan task yang valid');
    }
} else if (args[0] === 'complete' && args[1]) {
    const taskNumber = parseInt(args[1]);
    if (!isNaN(taskNumber)) {
        completeTask(taskNumber);
    } else {
        console.log('Tolong masukan task yang valid');
    }
} else if (args[0] === 'uncomplete' && args[1]) {
    const taskNumber = parseInt(args[1]);
    if (!isNaN(taskNumber)) {
        uncompleteTask(taskNumber);
    } else {
        console.log('Tolong masukan task yang valid');
    }
} else if (args[0] === 'filter' && args[1]) {
    const keyword = args[1];
    if (keyword) {
        filterTodos(keyword);
    } else {
        console.log('Tolong masukkan kata kunci yang valid untuk filter.');
    }
} else if (args[0] === 'tag' && args[1]) {
    const taskNumber = parseInt(args[1]);
    const tags = args.slice(2);
    if (!isNaN(taskNumber) && tags.length > 0) {
        tagTask(taskNumber, tags);
    } else {
        console.log('Tolong masukan task yang valid dan tag yang ingin ditambahkan.');
    }
} else if (args[0] === 'task' && args[1]) {
    const taskNumber = parseInt(args[1]);
    if (!isNaN(taskNumber)) {
        showTask(taskNumber);
    } else {
        console.log('Tolong masukan task yang valid');
    }
} else { // Jika tidak ada perintah lanjutan, tampilkan ini
    console.log('>>> JS TODO <<<');
    console.log('node todo.js <command>');
    console.log('node todo.js list');
    console.log('node todo.js task <task_id>');
    console.log('node todo.js add <task_content>');
    console.log('node todo.js delete <task_id>');
    console.log('node todo.js complete <task_id>');
    console.log('node todo.js uncomplete <task_id>');
    console.log('node todo.js listOutstanding');
    console.log('node todo.js completedDsc');
    console.log('node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>');
    console.log('node todo.js filter <keyword>');
}
