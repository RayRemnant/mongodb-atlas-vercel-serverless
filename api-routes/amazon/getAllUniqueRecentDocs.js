import handler from "../../lib/handler.js";

export default async (req, res) => {
		const { filter } = req.body;

    const collection = await handler({
        body: { databaseName: "codex", collectionName: "amazon" },
    });

    // Aggregation pipeline to group by "asin" and "region" and select the document with the most recent "createdAt"
	const aggregationPipeline = [
		{ $match: filter || {} }, // Apply the filter object if provided
		{ $sort: { asin: 1, region: 1, createdAt: -1 } }, // sort by asin, region, and most recent createdAt
		{
			$group: {
				_id: { asin: "$asin", region: "$region" },
				doc: { $first: "$$ROOT" }
			}
		},
		{ $replaceRoot: { newRoot: "$doc" } }
	];

    const uniqueDocuments = await collection
        .aggregate(aggregationPipeline)
        .toArray();

    res.send(uniqueDocuments);
};
