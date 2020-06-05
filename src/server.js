const express = require('express')
const server = express()

const db = require('./database/db')

server.use(express.static('public'))

server.use(express.urlencoded({ extended: true }))

const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

server.get('/', (req,res) => {
    return res.render('index.html', {
        title: 'Seu marketplace de coleta de resíduos'
    })
})

server.get('/create-point', (req,res) => {
    return res.render('create-point.html')
})

server.post('/save-point', (req,res) => {
    db.run(`
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            name TEXT,
            address TEXT,
            address2 TEXT,
            state TEXT,
            city TEXT,
            items TEXT
        );
    `);
    
    const query = `
        INSERT INTO places (
            image,name,address,address2,state,city,items
        ) VALUES ( ?,?,?,?,?,?,? );`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items]

    function afterInsertData(err){
        if(err){
            return res.render('create-point.html', { saved: false })
        }
        console.log('Cadastrado com sucesso!')
        console.log(this)
        
        return res.render('create-point.html', { saved: true })
    }

    db.run(query, values, afterInsertData)
})

server.get('/search', (req,res) => {
    const q = req.query.q;
    db.all(`SELECT * FROM places WHERE city LIKE '%${q}%' OR state LIKE '%${q}%' OR name LIKE '%${q}%'`, function(err, rows){
        if(err){
            return console.log('Error: ' + err)
        }
        const total = rows.length
        return res.render('search.html', { total: total, places: rows })
    })
})



server.listen(15670)