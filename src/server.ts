import fastify from 'fastify'
import { knex } from './database.ts'
import { env } from './env/index.ts'

const app = fastify()

app.get('/hello', async () => {
	const transactions = await knex('transactions').select('*')

	return transactions
})

app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log(`Server is running at http://localhost:${env.PORT}`)
	})
