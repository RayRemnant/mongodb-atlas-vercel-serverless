import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req)

	const filterById = { _id: { $in: documentIds.map(id => ObjectId(id)) } };

	const { acknowledged, modifiedCount } = await collection.updateMany(filterById, {
		$currentDate: {
			lastUpdate: true
		}
	}, { upsert: true })

	res.status(200).json({ acknowledged, insertedId })
}