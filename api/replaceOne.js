import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req)

	const _id = req.body.data.id;

	const doc = req.body.data
	delete doc.id;

	const { acknowledged, insertedId } = await collection.replaceOne({ _id }, {
		_id,
		...doc,
		$currentDate: {
			lastUpdate: true
		}
	}, { upsert: true })

	console.log(`replaceOne OK - ${_id}`)

	res ? res.status(200).json({ acknowledged, insertedId }) : "replaceMany"
}