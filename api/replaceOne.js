import handler from "../lib/handler";
import { ObjectId } from 'mongodb'

export default async (req, res) => {
	const collection = await handler(req)

	const { filter, data: doc } = req.body

	const responseData = await collection.replaceOne(filter, {
		_id: new ObjectId(),
		...doc,
	}, { upsert: true })

	console.log(`replaceOne OK ${JSON.stringify(responseData)}`)

	res ? res.status(200).json(responseData) : "replaceMany"
}