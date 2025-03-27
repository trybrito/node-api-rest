import type { FastifyRequest, FastifyReply } from 'fastify'

export async function checkIfSessionIdExists(
	req: FastifyRequest,
	res: FastifyReply,
) {
	const { sessionId } = req.cookies

	if (!sessionId) {
		return res.status(401).send({
			error: 'Unauthorized.',
		})
	}
}
