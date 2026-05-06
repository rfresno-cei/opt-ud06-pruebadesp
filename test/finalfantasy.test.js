const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../app');
const mongoose = require('mongoose');
const Character = require('../models/Character');

describe("Tests de Final Fantasy con mocks", () => {
    afterEach(() => {
        sinon.restore();
    })
    
    it("GET /characters", async () => {
        sinon.stub(Character, "find").resolves([
            {_id: 1, name: "Cloud", job: "Fighter", weapon: "Sword", level: 20, __v: 0},
            {_id: 2, name: "Tifa", job: "Monk", weapon: "Gloves", level: 18, __v: 0}
        ])
        const res = await request(app).get('/characters');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);
        expect(res.body[0].name).to.equal("Cloud");
    })

    it("POST /characters with correct character", async () => {
        sinon.stub(Character, "findOne").resolves(undefined);
        sinon.stub(Character, "create").resolves({
            _id: 1, name: "Cloud", job: "Fighter", weapon: "Sword", level: 20, __v: 0
        })
        const res = await request(app).post('/characters').send({
            name: "Cloud", job: "Fighter", weapon: "Sword", level: 20
        });
        expect(res.body.job).to.equal('Fighter');
        expect(res.body.weapon).to.equal('Sword');
        expect(res.status).to.equal(201);
    })

    it("POST /characters with incorrect character", async () => {
        sinon.stub(Character, "findOne").resolves(undefined);
        const err = new mongoose.Error.ValidationError();
        err.addError("name", new mongoose.Error.ValidatorError({message: 'Name is mandatory'}));
        sinon.stub(Character, "create").rejects(err);
        const res = await request(app).post('/characters').send({
            job: "Fighter", weapon: "Sword", level: 20
        });
        expect(res.status).to.equal(400);
        expect(res.text).to.include('Name is mandatory');
    })
})