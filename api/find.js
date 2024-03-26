import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req)

	const results = await collection.findOne({})

	res.status(200).json(results);
}