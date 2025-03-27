import type { FastifyInstance } from 'fastify'
import { knex } from '../database.ts'
import z from 'zod'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
	// fastify plugins must be async functions
	app.get('/', async () => {
		const transactions = await knex('transactions').select('*')

		return { transactions }
	})

	app.get('/:id', async (req) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid(),
		})

		const { id } = getTransactionParamsSchema.parse(req.params)

		const transaction = await knex('transactions')
			.where({
				id,
			})
			.first()

		return { transaction }
	})

	app.get('/summary', async () => {
		const summary = await knex('transactions')
			.sum('amount', {
				as: 'amount',
			})
			.first()

		return { summary }
	})

	app.post('/', async (req, res) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['debit', 'credit']),
		})

		const body = createTransactionBodySchema.parse(req.body)
		const { title, amount, type } = body

		await knex('transactions').insert({
			id: randomUUID(),
			title,
			amount: type === 'credit' ? amount : amount * -1,
		})

		return res.status(201).send()
	})
}
