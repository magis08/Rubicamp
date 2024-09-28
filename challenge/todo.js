const fs = require('fs') // Modul untuk operasi file
const args = process.argv.slice(2) // Mengambil argumen dari command line
const filePath = 'todo.json' // Path file JSON

function fileExists(path) { // memeriksa file ada atau tidak (pengaman)
    return fs.existsSync(path)
}

function readTodos() { // read isi file JSON
    if (!fileExists(filePath)) {
        return [] 
    }
    const data = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(data)

    return jsonData.todos
}

function writeTodos(todos) { // menimpa file JSON
    const jsonData = { todos: todos }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8')
}

function addTodo(task) { // fungsi add
    const todos = readTodos()
    todos.push({ task: task, completed: false }) // add
    writeTodos(todos) // timpa completed di file JSON dengan false (nilai inisial)
    console.log(`"${task}" telah ditambahkan.`)
}

function showTodos() { // fungsi list
    const todos = readTodos()
    if (todos.length === 0) {
        console.log('Tidak ada kegiatan.')
    } else {
        console.log('Todo List:')
        todos.forEach((todo, index) => {const status = todo.completed ? '[X]' : '[ ]' // loop setiap tugas dan tentukan status
            console.log(`${index + 1}. ${status} ${todo.task}`)
            }
        )}
    }

function deleteTodo(index) { // fungsi delete
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        const removedTask = todos.splice(index - 1, 1) // delete menggunakan splice
        writeTodos(todos) // setelah didelete, timpa file JSON
        console.log(`"${removedTask[0].task}" telah dihapus.`)
    }
}

function completeTask(index) { // fungsi tugas selesai
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        todos[index - 1].completed = true
        writeTodos(todos) // timpa index completed file JSON dengan true
        console.log(`"${todos[index - 1].task}" telah dilakukan.`)
        }
}

function uncompleteTask(index) { // fungsi tugas tidak selesai
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        todos[index - 1].completed = false
        writeTodos(todos) // timpa index completed file JSON dengan false
        console.log(`"${todos[index - 1].task}" status selesai dibatalkan`)
    }
}
function listOutstanding() { // fungsi untuk mengecek tugas yang belum dikerjakan
    const todos = readTodos()
    let hasOutstanding = false // buat variabel untuk cek apa ada tugas yang belum selesai

    console.log('Daftar pekerjaan:')

    for (let i = 0; i < todos.length; i++) { // looping untuk mengecek tugas
        if (!todos[i].completed) {
            console.log(`${i + 1}. [ ] ${todos[i].task}`)
            hasOutstanding = true
        }
    }
    if (!hasOutstanding) {
        console.log('Semua tugas telah selesai.')
    }
}
function completedDesc() { // fungsi untuk mengecek tugas yang sudah selesai
    const todos = readTodos()
    let hasOutstanding = true // pakai variabel yang ada di listOutstanding

    console.log('Daftar perkerjaan:')

    for (let i = 0; i < todos.length; i++) { // loop untuk mengecek tugas
        if (todos[i].completed) {
            console.log(`${i + 1}. [X] ${todos[i].task}`)
        }
    }
}

function filterTodos(keyword) { // fungsi untuk filter
    const todos = readTodos()
    let hasMatches = false; // buat variabel untuk mengecek apakah ada tugas yang memiliki nama yang memiliki kata kunci yang cocok

    console.log(`Daftar pekerjaan:`)

    for (let i = 0; i < todos.length; i++) { // loop untuk mengecek tugas
        if (todos[i].task.toLowerCase().includes(keyword.toLowerCase())) {
            const status = todos[i].completed ? '[X]' : '[ ]'
            console.log(`${i + 1}. ${status} ${todos[i].task}`)
            hasMatches = true
        }
    }

    if (!hasMatches) {
        console.log(`Tidak ada tugas yang cocok dengan kata kunci "${keyword}".`)
    }
}
// syarat-syarat argumen per fungsi
if (args[0] === 'add' && args.length > 1) {
    const task = args.slice(1).join(' ')
    addTodo(task)
} else if (args[0] === 'list') {
    showTodos()
} else if (args[0] === 'listOutstanding') {
    listOutstanding()
} else if (args[0] === 'completedDsc') {
    completedDesc()
} else if (args[0] === 'delete' && args[1]) {
    const taskNumber = parseInt(args[1])
    if (!isNaN(taskNumber)) {
        deleteTodo(taskNumber)
    } else {
        console.log('Tolong masukan task yang valid')
    }
} else if (args[0] === 'complete' && args[1]) {
    const taskNumber = parseInt(args[1])
    if (!isNaN(taskNumber)) {
        completeTask(taskNumber)
    } else {
        console.log('Tolong masukan task yang valid')
    }
} else if (args[0] === 'uncomplete' && args[1]) {
    const taskNumber = parseInt(args[1])
    if (!isNaN(taskNumber)) {
        uncompleteTask(taskNumber)
    } else {
        console.log('Tolong masukan task yang valid')
    }
}  else if (args[0] === 'filter' && args[1]) {
    const keyword = args[1]
    if (keyword) {
        filterTodos(keyword)
    } else {
        console.log('Tolong masukkan kata kunci yang valid untuk filter.')
    }
}
 else { // jika tidak ada perintah lanjutan, tampilkan ini
    console.log('>>> JS TODO <<<')
    console.log('node todo.js <command>')
    console.log('node todo.js list')
    console.log('node todo.js task <task_id>')
    console.log('node todo.js add <task_content>')
    console.log('node todo.js delete <task_id>')
    console.log('node todo.js complete <task_id>')
    console.log('node todo.js uncomplete <task_id>')
    console.log('node todo.js listOutstanding')
    console.log('node todo.js completedDsc')
    console.log('node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>')
    console.log('node todo.js filter <tag_name>')
}
