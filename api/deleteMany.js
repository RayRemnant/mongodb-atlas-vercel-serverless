import handler from "../lib/handler.js";

export default async (req, res) => {
	const collection = await handler(req);

	const { acknowledged, insertedId } = await collection.deleteMany(
		req.body.query
	);

	res.status(200).json({ acknowledged, insertedId });
};
