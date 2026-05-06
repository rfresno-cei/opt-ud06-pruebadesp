const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const mongoose = require('mongoose');
const Character = require('../models/Character');

describe("Tests de Final Fantasy sin mocks", () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb');
    })

    beforeEach(async () => {
        await Character.deleteMany({});
    })

    after(async () => {
        await mongoose.connection.close();
    })
    
    it("GET /characters", async () => {
        await Character.create({name: "Cloud", job: "Fighter", weapon: "Sword", level: 20});
        const res = await request(app).get('/characters');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(1);
        expect(res.body[0].name).to.equal("Cloud");
    })

    it("POST /characters with correct character", async () => {
        const res = await request(app).post('/characters').send({
            name: "Cloud", job: "Fighter", weapon: "Sword", level: 20
        });
        expect(res.body.job).to.equal('Fighter');
        expect(res.body.weapon).to.equal('Sword');
        expect(res.status).to.equal(201);
    })

    it("POST /characters with incorrect character", async () => {
        const res = await request(app).post('/characters').send({
            job: "Fighter", weapon: "Sword", level: 20
        });
        expect(res.status).to.equal(400);
        expect(res.text).to.include('Name is mandatory');
    })
})