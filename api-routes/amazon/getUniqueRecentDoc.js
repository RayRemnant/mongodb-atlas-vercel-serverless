import handler from "../../lib/handler.js";

export default async (req, res) => {
	const { filter } = req.body;

	if (!filter || !filter.asin) {
		return res.status(400).json({ error: "asin query parameter is required" });
	}

	const collection = await handler({
		body: { databaseName: "codex", collectionName: "amazon" },
	});

	// If region is not specified, return the most recent document for each region
	const aggregationPipeline = [
		{ $match: filter },
		{ $addFields: { timestamp: { $toDate: "$_id" } } },
		{ $sort: { region: 1, timestamp: -1 } },
		{
			$group: {
				_id: "$region",
				doc: { $first: "$$ROOT" }
			}
		},
		{ $replaceRoot: { newRoot: "$doc" } }
	];
	const result = await collection.aggregate(aggregationPipeline).toArray();

	res.send(result);
};
