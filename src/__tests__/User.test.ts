import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe("User", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations(); 
    })

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })
    it("deverá criar um novo usuário", async () => {
        const response = await request(app).post("/users").send({
            email: "teste@gmail.com",
            name: "teste"
        });
        expect(response.status).toBe(201);
    })

    it("não pode criar usuário com mesmo email e nome", async () => {
        const response = await request(app).post("/users").send({
            email: "teste@gmail.com",
            name: "teste"
        })

        expect(response.status).toBe(400);
    })
})
