const express = require('express')
const server = express()

server.use(express.static('public'))

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

server.get('/search', (req,res) => {
    return res.render('search.html')
})

server.post('/send-data', (req,res) => {
    console.log(req.params)
})


server.listen(15670)