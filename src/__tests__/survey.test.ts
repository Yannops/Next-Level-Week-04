import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe("Surveys", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })
    it("deverá criar um novo survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: "title teste",
            description: "description teste"
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("deverá buscar todos os surveys", async () => {
        await request(app).post("/surveys").send({
            title: "title teste",
            description: "description teste"
        });
        
        const response = await request(app).get("/surveys");
        expect(response.body.lenght).toBe(2);
    })
})
