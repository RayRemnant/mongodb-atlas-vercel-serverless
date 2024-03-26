import getCollection from "./getCollection";

export default async (req) => {
	if (req.method == "POST") {
		const { databaseName, collectionName } = req.body
		return await getCollection(databaseName, collectionName)
	}
}