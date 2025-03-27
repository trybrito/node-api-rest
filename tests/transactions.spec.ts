import { describe, beforeEach, expect, it, beforeAll, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app.ts'
import request from 'supertest'

describe('Transactions routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(() => {
		execSync('npm run knex migrate:rollback --all')
		execSync('npm run knex migrate:latest')
	})

	it('should be able to create a new transaction', async () => {
		const response = await request(app.server).post('/transactions').send({
			title: 'New Transaction',
			amount: 5000,
			type: 'credit',
		})

		expect(response.status).toEqual(201)
	})

	it('should be able to list all transactions', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'New Transaction',
				amount: 5000,
				type: 'credit',
			})

		const cookies = createTransactionResponse.get('Set-Cookie') ?? []

		const listTransactionResponse = await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies)
			.expect(200)

		expect(listTransactionResponse.body.transactions.length).toBeGreaterThan(0)
		expect(listTransactionResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: 'New Transaction',
				amount: 5000,
			}),
		])
	})
})
