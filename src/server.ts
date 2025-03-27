import fastify from 'fastify'
import { env } from './env/index.ts'
import { transactionsRoutes } from './routes/transactions.routes.ts'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
	prefix: 'transactions',
})

app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log(`Server is running at http://localhost:${env.PORT}`)
	})
