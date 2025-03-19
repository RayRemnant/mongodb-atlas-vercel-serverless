import getCollection from "./getCollection.js";

export default async (req) => {
	const { databaseName, collectionName } = req.body;
	return await getCollection(databaseName, collectionName);
};
