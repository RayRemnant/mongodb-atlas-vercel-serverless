import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req)

	const _id = req.body.data.id;


	const { acknowledged, insertedId } = await collection.updateOne({ _id }, {
		$currentDate: {
			lastUpdate: true
		}
	}, { upsert: true })

	res.status(200).json({ acknowledged, insertedId })
}