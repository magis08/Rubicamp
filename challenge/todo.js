const fs = require('fs'); // Modul untuk operasi file
const args = process.argv.slice(2); // Mengambil argumen dari command line
const filePath = 'todo.json'; // Path file JSON

function readTodos() { // Membaca isi file JSON
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

function Outstanding(order = 'asc') {
    const todos = readTodos(); // Ambil semua todos
    const outstandingTodos = todos.filter(todo => !todo.completed); // Ambil tugas yang belum selesai

    // Mengurutkan berdasarkan nama task
    if (order === 'desc') {
        outstandingTodos.sort((a, b) => (a.task > b.task ? 1 : -1)); // Urutkan descending
    } else {
        outstandingTodos.sort((a, b) => (a.task < b.task ? 1 : -1)); // Urutkan ascending
    }

    console.log('Daftar pekerjaan outstanding:');
    if (outstandingTodos.length === 0) {
        console.log('Semua tugas telah selesai.');
    } else {
        for (let i = 0; i < outstandingTodos.length; i++) {
            const originalIndex = todos.findIndex(todo => todo.task === outstandingTodos[i].task);
            console.log(`${originalIndex + 1}. [ ] ${outstandingTodos[i].task}`); // Tampilkan dengan indeks asli
        }
    }
}

function completed(order = 'asc') {
    const todos = readTodos(); // Ambil semua todos
    const completedTodos = todos.filter(todo => todo.completed); // Ambil tugas yang belum selesai

    // Mengurutkan berdasarkan nama task
    if (order === 'desc') {
        completedTodos.sort((a, b) => (a.task > b.task ? 1 : -1)); // Urutkan descending
    } else {
        completedTodos.sort((a, b) => (a.task < b.task ? 1 : -1)); // Urutkan ascending
    }

    console.log('Daftar pekerjaan outstanding:');
    if (completedTodos.length === 0) {
        console.log('Semua tugas telah selesai.');
    } else {
        for (let i = 0; i < completedTodos.length; i++) {
            const originalIndex = todos.findIndex(todo => todo.task === completedTodos[i].task);
            console.log(`${originalIndex + 1}. [X] ${completedTodos[i].task}`); // Tampilkan dengan indeks asli
        }
    }
}

function filterTodos(tag) { // Fungsi untuk filter
    const todos = readTodos();
    let hasMatches = false;

    console.log(`Filter:${tag}`);
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].tags.includes(tag)) {
            const status = todos[i].completed ? '[X]' : '[ ]';
            const originalIndex = todos.findIndex(todo => todo.task === todos[i].task)
            console.log(`${originalIndex + 1}. ${status} ${todos[i].task}`)
            hasMatches = true;
        }
    }
    if (!hasMatches) {
        console.log(`Tidak ada tugas yang cocok dengan kata kunci "${tag}".`);
    }
}

// Syarat-syarat argumen per fungsi
if (args[0] === 'add' && args.length > 1) {
    const task = args.slice(1).join(' ');
    addTodo(task);
} else if (args[0] === 'list') {
    showTodos();
} else if (args[0] === 'list:Outstanding') {
    Outstanding(args[1]);
} else if (args[0] === 'list:completed') {
    completed(args[1]);
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
} else if (args[0] && args[0].includes('filter:')) {
    const keyword = args[0].split(':')[1];
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
    console.log('node todo.js list:Outstanding asc | desc');
    console.log('node todo.js list:completed asc | desc');
    console.log('node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>');
    console.log('node todo.js filter:<tag_name>');
}
