import handler from "../lib/handler.js";

export default async (req, res) => {
	const collection = await handler(req);

	const { filter, upsert, data: update } = req.body;

	console.log(filter, update);

	const { acknowledged, insertedId } = await collection.updateOne(
		filter,
		{
			$set: {
				...update,
			},
		},
		{ upsert }
	);

	res.status(200).json({ acknowledged, insertedId });
};
