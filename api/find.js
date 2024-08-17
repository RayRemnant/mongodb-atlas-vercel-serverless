import handler from "../lib/handler";

export default async (req, res) => {
	const collection = await handler(req);
	const { filter } = req.body;

	const results = await collection.find(filter).toArray();

	res.status(200).json(results);
};
