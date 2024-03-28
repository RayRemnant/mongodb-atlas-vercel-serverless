import handler from "../lib/handler";
import replaceOne from "./replaceOne"

export default async (req, res) => {

	const docs = req.body.data;

	docs.forEach(doc => {
		replaceOne({
			body: {
				data: doc,
				databaseName: req.body.databaseName,
				collectionName: req.body.collectionName
			}
		})
	})

	res.status(200).json(responseData);
};
