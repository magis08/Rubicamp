const fs = require('fs');

// Membaca argument dari command line
const args = process.argv.slice(2); // Mengambil argument setelah `node` dan nama file

const filePath = 'todo.json';

// Fungsi untuk membaca file JSON
function readTodos() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.todos;
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

// Fungsi untuk menulis ke file JSON
function writeTodos(todos) {
    const jsonData = { todos: todos };
    try {
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
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

// Logika utama
if (args[0] === 'add' && args.length > 1) {
    addTodo(args[1]);
} else if (args[0] === 'list') {
    showTodos();
} else {
    console.log('node todo.js <command>');
    console.log('node todo.js list');
    console.log('node todo.js add <task_content>');

}
