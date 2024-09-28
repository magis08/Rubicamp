const fs = require('fs')
const args = process.argv.slice(2)
const filePath = 'todo.json'

function fileExists(path) {
    return fs.existsSync(path)
}

function readTodos() {
    if (!fileExists(filePath)) {
        return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(data)

    return jsonData.todos
}

function writeTodos(todos) {
    const jsonData = { todos: todos }
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8')
}

function addTodo(task) {
    const todos = readTodos()
    todos.push({ task: task, completed: false })
    writeTodos(todos)
    console.log(`"${task}" telah ditambahkan.`)
}

function showTodos() {
    const todos = readTodos()
    if (todos.length === 0) {
        console.log('Tidak ada kegiatan.')
    } else {
        console.log('Todo List:')
        todos.forEach((todo, index) => {const status = todo.completed ? '[X]' : '[ ]'
            console.log(`${index + 1}. ${status} ${todo.task}`)
            }
        )}
    }


function deleteTodo(index) {
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        const removedTask = todos.splice(index - 1, 1)
        writeTodos(todos)
        console.log(`"${removedTask[0].task}" telah dihapus.`) // Pastikan hanya properti "task" dicetak
    }
}

function completeTask(index) {
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        todos[index - 1].completed = true
        writeTodos(todos)
        console.log(`"${todos[index - 1].task}" telah dilakukan.`) // Cetak hanya task
    }
}

function uncompleteTask(index) {
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        todos[index - 1].completed = false
        writeTodos(todos)
        console.log(`"${todos[index - 1].task}" status selesai dibatalkan`) // Cetak hanya task dengan simbol [X]
    }
}
function listOutstanding() {
    const todos = readTodos()
    let hasOutstanding = false

    console.log('Daftar pekerjaan:')

    for (let i = 0; i < todos.length; i++) {
        if (!todos[i].completed) {
            console.log(`${i + 1}. [ ] ${todos[i].task}`)
            hasOutstanding = true
        }
    }
    if (!hasOutstanding) {
        console.log('Semua tugas telah selesai.')
    }
}
function completedDesc() {
    const todos = readTodos()
    let hasOutstanding = true

    console.log('Daftar perkerjaan:')

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].completed) {
            console.log(`${i + 1}. [X] ${todos[i].task}`)
        }
    }
}

function filterTodos(keyword) {
    const todos = readTodos()
    let hasMatches = false; // Flag untuk mengecek apakah ada tugas yang cocok

    console.log(`Daftar pekerjaan:`)

    for (let i = 0; i < todos.length; i++) {
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
 else {
    console.log('>>> JS TODO <<<')
    console.log('node todo.js <command>')
    console.log('node todo.js list')
    console.log('node todo.js task <task_id>')
    console.log('node todo.js add <task_content>')
    console.log('node todo.js delete <task_id>')
    console.log('node todo.js complete <task_id>')
    console.log('node todo.js uncomplete <task_id>')
    console.log('node todo.js list: Outstanding asc')
    console.log('node todo.js list: Completed asc')
    console.log('node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>')
    console.log('node todo.js filter: <tag_name>')
}
