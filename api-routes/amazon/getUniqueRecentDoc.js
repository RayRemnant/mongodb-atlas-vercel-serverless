import handler from "../../lib/handler.js";

export default async (req, res) => {
	const { asin } = req.body;

	if(!asin) {
		return res.status(400).json({ error: "asin query parameter is required" });
	}

	const collection = await handler({
		body: { databaseName: "codex", collectionName: "amazon" },
	});

	console.log("asin", asin)

	// Build filter object
	const filter = {
		asin,
		status: { $exists: false },
	};

	let result;


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
	result = await collection.aggregate(aggregationPipeline).toArray();

	res.send(result);
};
