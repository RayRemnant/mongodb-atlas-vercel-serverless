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
	} = req.body;

	const { acknowledged, modifiedCount } = await collection.updateMany(
		filter,
		update,
		{ upsert: true }
	);

	res.status(200).json({ acknowledged, modifiedCount });
};
