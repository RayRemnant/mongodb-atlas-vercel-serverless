import getCollection from "../../lib/getCollection.js";

export default async (req, res) => {
	const { origin, destination } = req.body;

	try {
		// Get the origin collection
		const originCollection = await getCollection(
			origin.databaseName,
			origin.collectionName
		);

		// Retrieve data from the origin collection
		const originData = await originCollection.find({}).toArray();

		// Get the destination collection
		const destinationCollection = await getCollection(
			destination.databaseName,
			destination.collectionName
		);

		// Delete existing data in the destination collection
		await destinationCollection.deleteMany({});

		// Insert data from the origin collection into the destination collection
		await destinationCollection.insertMany(originData);

		res.status(200).json({ message: "Data transferred successfully." });
	} catch (error) {
		console.error("Error transferring data:", error);
		res
			.status(500)
			.json({ error: "An error occurred while transferring data." });
	}
};
