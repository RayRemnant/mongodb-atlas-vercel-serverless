import handler from "../../lib/handler";

export default async function getUniqueDocuments(req, res) {
	const { region } = req.query; // Assuming the region parameter is passed in the query

	const collection = await handler(req);

	// Aggregation pipeline to group by "asin" and "region" and select the document with the most recent "lastUpdated"
	const aggregationPipeline = [
		{
			$match: {
				asin: { $exists: true },
				region: { $exists: true },
			},
		},
		{
			$addFields: {
				timestamp: { $toDate: "$_id" },
			},
		},
		{
			$sort: { timestamp: -1 },
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
	console.log(uniqueDocuments);
	res.send(uniqueDocuments);
}
