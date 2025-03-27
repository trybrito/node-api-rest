import fastify from 'fastify'
import { env } from './env/index.ts'
import { transactionsRoutes } from './routes/transactions.routes.ts'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, {
	prefix: 'transactions',
})
