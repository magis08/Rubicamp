const fs = require('fs');

// Membaca argument dari command line
const args = process.argv.slice(2); // Mengambil argument setelah `node` dan nama file

const filePath = 'todo.json';

// Fungsi untuk memeriksa apakah file ada
function fileExists(path) {
    return fs.existsSync(path);
}

// Fungsi untuk membaca file JSON
function readTodos() {
    if (!fileExists(filePath)) {
        return [];
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    return jsonData.todos;
}

// Fungsi untuk menulis ke file JSON
function writeTodos(todos) {
    const jsonData = { todos: todos };
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
}

// Fungsi untuk menambahkan tugas
function addTodo(task) {
    const todos = readTodos();
    todos.push(task);
    writeTodos(todos);
    console.log(`Added task: "${task}"`);
}

// Fungsi untuk menampilkan daftar tugas
function showTodos() {
    const todos = readTodos();
    if (todos.length === 0) {
        console.log('No tasks found.');
    } else {
        console.log('Todo List:');
        todos.forEach((todo, index) => {
            console.log(`${index + 1}. ${todo}`);
        });
    }
}

// Fungsi untuk menghapus tugas
function deleteTodo(index) {
    const todos = readTodos();
    if (index < 1 || index > todos.length) {
        console.log('Invalid task number.');
    } else {
        const removedTask = todos.splice(index - 1, 1); // Menghapus berdasarkan index
        writeTodos(todos);
        console.log(`Deleted task: "${removedTask}"`);
    }
}

// Logika utama
if (args[0] === 'add' && args.length > 1) {
    const task = args.slice(1).join(' '); // Menggabungkan semua argument setelah "add"
    addTodo(task);
} else if (args[0] === 'list') {
    showTodos();
} else if (args[0] === 'delete' && args[1]) {
    const taskNumber = parseInt(args[1]);
    if (!isNaN(taskNumber)) {
        deleteTodo(taskNumber);
    } else {
        console.log('Please provide a valid task number.');
    }
} else {
    console.log('>>> JS TODO <<<')
    console.log('node todo.js <command>');
    console.log('node todo.js list');
    console.log('node todo.js add <task_content>');
    console.log('node todo.js delete <task_id>');
}
