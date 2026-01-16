const express = require('express');
const app = express();
const { client, connectDB } = require('./db');
const { ObjectId } = require('mongodb');

connectDB();

const db = client.db("midb");
const personajes = db.collection("personajes");

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/characters', async (req, res) => {
    const resultado = await personajes.find().toArray();
    res.send(resultado);
})

app.get('/characters/:id', async (req, res) => {
    const resultado = await personajes.findOne({_id: new ObjectId(req.params.id)});
    if (!resultado) return res.sendStatus(404);
    res.send(resultado);
})

app.post('/characters', async (req, res) => {
    const c = req.body;
    if (!c || c == {}) {
        return res.sendStatus(400);
    }
    const existe = await personajes.findOne({name: c.name});
    if (existe) {
        return res.sendStatus(400);
    }
    if (c.level > 99 || c.level < 1) {
        return res.status(400).send('Level must be between 1 and 99');
    }
    await personajes.insertOne(c);
    res.status(201).send(c);
})

app.put('/characters/:id', async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const existe = await personajes.findOne({_id: new ObjectId(id)});
    if (!existe) return res.status(404).send('Character does not exist');
    if (!data || data == {}) return res.sendStatus(400);
    const existe2 = await personajes.findOne({name: data.name});
    if (existe2) return res.sendStatus(400);
    if (data.level > 99 || data.level < 1) return res.status(400).send('Level must be between 1 and 99');
    await personajes.updateOne({_id: new ObjectId(id)}, {$set: data});
    res.sendStatus(204);
})

app.delete('/characters/:id', async (req, res) => {
    const id = req.params.id;
    const resultado = await personajes.deleteOne({_id: new ObjectId(id)});
    if (resultado.deletedCount == 0) return res.sendStatus(404);
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