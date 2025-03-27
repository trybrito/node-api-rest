import type { FastifyInstance } from 'fastify'
import { knex } from '../database.ts'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { checkIfSessionIdExists } from '../middlewares/checkIfSessionIdExists.ts'

export async function transactionsRoutes(app: FastifyInstance) {
	// fastify plugins must be async functions
	app.get(
		'/',
		{
			preHandler: [checkIfSessionIdExists],
		},
		async (req, _) => {
			const { sessionId } = req.cookies

			const transactions = await knex('transactions')
				.where({
					session_id: sessionId,
				})
				.select('*')

			return { transactions }
		},
	)

	app.get(
		'/:id',
		{
			preHandler: [checkIfSessionIdExists],
		},
		async (req, _) => {
			const { sessionId } = req.cookies

			const getTransactionParamsSchema = z.object({
				id: z.string().uuid(),
			})

			const { id } = getTransactionParamsSchema.parse(req.params)

			const transaction = await knex('transactions')
				.where({
					id,
					session_id: sessionId,
				})
				.first()

			return { transaction }
		},
	)

	app.get(
		'/summary',
		{
			preHandler: [checkIfSessionIdExists],
		},
		async (req, __) => {
			const { sessionId } = req.cookies

			const summary = await knex('transactions')
				.where({ session_id: sessionId })
				.sum('amount', {
					as: 'amount',
				})
				.first()

			return { summary }
		},
	)

	app.post('/', async (req, res) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['debit', 'credit']),
		})

		const body = createTransactionBodySchema.parse(req.body)
		const { title, amount, type } = body

		let sessionId = req.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			res.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
			})
		}

		await knex('transactions').insert({
			id: randomUUID(),
			session_id: sessionId,
			title,
			amount: type === 'credit' ? amount : amount * -1,
		})

		return res.status(201).send()
	})
}
