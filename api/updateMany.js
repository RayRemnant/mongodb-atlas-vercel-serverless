import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req)

	const { filter, data: update } = req.body;

	const { acknowledged, modifiedCount } = await collection.updateMany(filter, {
		$set: {
			...update
		}
	}, { upsert: true })

	res.status(200).json({ acknowledged, insertedId })
}