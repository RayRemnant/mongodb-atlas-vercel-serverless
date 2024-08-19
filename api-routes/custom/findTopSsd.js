import handler from "../../lib/handler";

export default async (req, res) => {
	const collection = await handler(req);

	const totalCount = await collection.countDocuments({});

	var quarterCount = Math.ceil(totalCount * 0.3);

	// Find and sort documents by "score" parameter in descending order
	const results = await collection
		.find({})
		.sort({ score: -1 }) // Sort by "score" in descending order
		.limit(quarterCount)
		.toArray();

	res.status(200).json(results);
};
