const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const { readFileSync, writeFileSync } = require('fs')

try {
    const input = readFileSync('data.json', 'utf-8');
    var data = JSON.parse(input);
} catch (err) {
    console.error('Gagal membaca data file');
}

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('person', { data })
})

app.get('/add', function (req, res) {
    res.render('form', { item: {} })
})

app.post('/add', function (req, res) {
    if (Object.keys(req.body).length !== 0) {
        const name = req.body.name
        const height = req.body.height
        const weight = req.body.weight
        const birthdate = req.body.birthdate
        const married = JSON.parse(req.body.married)
        data.push({name, height, weight, birthdate, married})
        saveData(data)
    }
    res.redirect('/')
})

app.get('/delete/:id', function (req, res) {
    const index = req.params.id
    data.splice(index, 1)
    saveData(data)
    res.redirect('/')
})

app.get('/edit/:id', function (req, res) {
    const index = req.params.id
    res.render('form', { item: data[index] })
})

app.post('edit/:id', function (req, res) {
    if (Object.keys(req.body).length !== 0) {
        const index = req.params.id
        const name = req.body.name
        const height = req.body.height
        const weight = req.body.weight
        const birthdate = req.body.birthdate
        const married = JSON.parse(req.body.married)
        data[index] = { name, height, weight, birthdate, married }
        saveData(data)
    }
    res.redirect('/')
})

function saveData (data) {
    writeFileSync('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('data saved to data.json')
        }
    })
}

app.listen(3000, function ( ) {
    console.log('server di port 3000')
})