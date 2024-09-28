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
    todos.push(task)
    writeTodos(todos)
    console.log(`"${task}" telah ditambahkan.`)
}

function showTodos() {
    const todos = readTodos()
    if (todos.length === 0) {
        console.log('Tidak ada kegiatan.')
    } else {
        console.log('Todo List:')
        todos.forEach((todo, index) => {
            console.log(`${index + 1}. [ ] ${todo}`)
        })
    }
}

function deleteTodo(index) {
    const todos = readTodos()
    if (index < 1 || index > todos.length) {
        console.log('Tidak ada data.')
    } else {
        const removedTask = todos.splice(index - 1, 1)
        writeTodos(todos)
        console.log(`"${removedTask}" telah dihapus.`)
    }
}

if (args[0] === 'add' && args.length > 1) {
    const task = args.slice(1).join(' ')
    addTodo(task)
} else if (args[0] === 'list') {
    showTodos()
} else if (args[0] === 'delete' && args[1]) {
    const taskNumber = parseInt(args[1])
    if (!isNaN(taskNumber)) {
        deleteTodo(taskNumber)
    } else {
        console.log('Tolong masukan task yang valid')
    }
} else {
    console.log('>>> JS TODO <<<')
    console.log('node todo.js <command>');
    console.log('node todo.js list');
    console.log('node todo.js add <task_content>');
    console.log('node todo.js delete <task_id>');
}