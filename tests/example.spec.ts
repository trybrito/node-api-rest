import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { app } from '../src/app.ts'
import request from 'supertest'

beforeAll(async () => {
	await app.ready()
})

afterAll(async () => {
	await app.close()
})

describe('Transactions', () => {
	it('should create a new transaction', async () => {
		const response = await request(app.server).post('/transactions').send({
			title: 'New Transaction',
			amount: 5000,
			type: 'credit',
		})

		expect(response.status).toEqual(201)
	})
})
