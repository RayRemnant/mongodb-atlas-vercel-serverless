import { connectToDatabase } from "./connect.js";

export default async (databaseName, collectionName) => {
	const { database } = await connectToDatabase(databaseName);
	const collection = await database.collection(collectionName);
	return collection
}