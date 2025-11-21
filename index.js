const express = require('express');
const { compileFile } = require('pug');
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', './views');

let bbdd = [
    { id: 1, name: 'Cloud Strife', job: 'Soldier', weapon: 'Buster sword', level: 25 },
    { id: 2, name: 'Tifa Lockhart', job: 'Fighter', weapon: 'Leather gloves', level: 22 },
    { id: 3, name: 'Aerith Gainsborough', job: 'Mage', weapon: 'Magic staff', level: 20 }
];

app.get('/characters', (req, res) => {
    res.send(bbdd);
})

app.get('/characters/:id', (req, res) => {
    const c = bbdd.find(c => c.id == req.params.id);
    if (!c) res.sendStatus(404);
    else res.send(c);
})

app.post('/characters', (req, res) => {
    const c = req.body;
    if (!c || c == {}) {
        return res.sendStatus(400);
    }
    const existe = bbdd.find(ch => ch.id == c.id || ch.name == c.name);
    if (existe) {
        return res.sendStatus(400);
    }
    if (c.level > 99 || c.level < 1) {
        return res.status(400).send('Level must be between 1 and 99');
    }
    bbdd.push(c);
    res.status(201).send(c);
})

app.put('/characters/:id', (req, res) => {
    const existe = bbdd.find(ch => ch.id == req.params.id);
    if (!existe) return res.status(404).send('Character does not exist');
    const c = req.body;
    if (!c || c == {}) return res.sendStatus(400);
    const existe2 = bbdd.find(ch => ch.id == c.id || ch.name == c.name);
    if (existe2) res.sendStatus(400);
    if (c.level > 99 || c.level < 1) return res.status(400).send('Level must be between 1 and 99');
    const posicion = bbdd.findIndex(ch => ch.id == req.params.id);
    bbdd[posicion] = c;
    res.sendStatus(204);
})

app.delete('/characters/:id', (req, res) => {
    const existe = bbdd.find(ch => ch.id == req.params.id);
    if (!existe) return res.status(404).send('Character does not exist');
    const posicion = bbdd.findIndex(ch => ch.id == req.params.id);
    bbdd.splice(posicion, 1);
    res.sendStatus(204);
})

app.get('/index', (req, res) => {
    res.render('index', {title: 'Welcome'});
})

app.get('/list', (req, res) => {
    res.render('list', {characters: bbdd, title: 'Character list'});
})

app.get('/new', (req, res) => {
    res.render('new', {title: 'New character'})
})

app.post('/process', (req, res) => {
    const c = {
        id: parseInt(req.body.id),
        name: req.body.name,
        job: req.body.job,
        weapon: req.body.weapon,
        level: parseInt(req.body.level)
    };
    bbdd.push(c);
    res.redirect('/list');
})

app.listen(8080, () => {
    console.log('Servidor arrancado');
})