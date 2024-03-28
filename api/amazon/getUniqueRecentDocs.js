import handler from "../../lib/handler";

export default async function getUniqueDocuments(req, res) {

	const collection = await handler(req)

	// Aggregation pipeline to group by "asin" and select the document with the most recent "lastUpdated"
	const aggregationPipeline = [
		{
			$addFields: { // Add a new field "timestamp" containing the timestamp extracted from the "_id"
				timestamp: { $toDate: "$_id" }
			}
		},
		{
			$sort: { timestamp: -1 } // Sort by "timestamp" in descending order
		},
		{
			$group: {
				_id: "$asin", // Group by "asin"
				document: { $first: "$$ROOT" } // Select the first document in each group (which is the most recent)
			}
		},
		{
			$replaceRoot: { newRoot: "$document" } // Replace the root with the selected document
		}
	];

	const uniqueDocuments = await collection.aggregate(aggregationPipeline).toArray();
	console.log(uniqueDocuments)
	res.send(uniqueDocuments);
}