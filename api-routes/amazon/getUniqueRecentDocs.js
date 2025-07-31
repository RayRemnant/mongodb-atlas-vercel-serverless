import handler from "../../lib/handler.js";

export default async (req, res) => {
	const collection = await handler({
		body: { databaseName: "codex", collectionName: "amazon" },
	});

	const { collectionName, timestamp = -1 } = req.body;

	//get unique values from all asin fields in ssd-data collection
	const asinArray = collectionName
		? await (
				await handler({
					body: { databaseName: "codex", collectionName },
				})
		  ).distinct("asin")
		: [];

	// Aggregation pipeline to group by "asin" and "region" and select the document with the most recent "lastUpdated"
	const aggregationPipeline = [
		{
			$match: {
				// match asins present in asinArray (if provided)
				asin: asinArray ? { $in: asinArray } : { $exists: true },
				//if that status field is present it means that the page does not exists or redirects
				status: { $exists: false },
			},
		},
		{
			$addFields: {
				timestamp: { $toDate: "$_id" },
			},
		},
		{
			$sort: { timestamp },
		},
		{
			$group: {
				_id: { asin: "$asin", region: "$region" }, // Group by both "asin" and "region"
				document: { $first: "$$ROOT" },
			},
		},
		{
			$replaceRoot: { newRoot: "$document" },
		},
	];

	const uniqueDocuments = await collection
		.aggregate(aggregationPipeline)
		.toArray();
	//console.log(uniqueDocuments);
	res.send(uniqueDocuments);
};
