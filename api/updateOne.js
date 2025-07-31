import handler from "../lib/handler.js";

export default async (req, res) => {
	const collection = await handler(req);

	const {
		filter,
		data,
		update = data
			? {
					$set: {
						...data,
					},
			  }
			: update,
		upsert
	} = req.body;

	const { acknowledged, insertedId, matchedCount, modifiedCount } = await collection.updateOne(
		filter,
		update,
		{ upsert }
	);

	res.status(200).json({ acknowledged, insertedId, matchedCount, modifiedCount });
};
