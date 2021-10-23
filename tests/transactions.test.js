import app from '../src/app.js'
import supertest from 'supertest'
import { getFakeUsers } from '../src/utils/faker.js'
import db from '../src/database/database.js'

const fakeUsers = getFakeUsers()
let token; 

beforeAll(async () => {
    await db.insertUser(fakeUsers[0])
    const user = await db.findUserByEmail(fakeUsers[0].email)
    token = await db.insertSession(user.rows[0].id)
})

describe('rota GET /transactions', () => {

    it('should return 400 when not sending token', async () => {
        const result = await supertest(app)
            .get('/transactions')

        expect(result.status).toEqual(400)
    })

    it('should return 401 when token not found', async () => {
        const result = await supertest(app)
            .get('/transactions')
            .set('Authorization', `Bearer token-falsiane`)

        expect(result.status).toEqual(401)
    })

    it('should return 200 when getting transactions', async () => {
        const result = await supertest(app)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toEqual(200)
    })
})

describe('rota POST /transactions', () => {

    it('should return 400 when not sending token', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .send(body)

        expect(result.status).toEqual(400)
    })

    it('should return 400 when invalid body', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: 'true-soqnao' // should be boolean
        }
        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(result.status).toEqual(400)
    })

    it('should return 401 when token not found', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer token-falsiane`)
            .send(body)

        expect(result.status).toEqual(401)
    })

    it('should return 201 when transaction posted', async () => {
        const body = {
            value: 30,
            description: "not much at all",
            entry: true
        }

        const result = await supertest(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(body)

        expect(result.status).toEqual(201)
    })

})