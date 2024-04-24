import handler from "../lib/handler";
import replaceOne from "./replaceOne";

export default async (req, res) => {
	const collection = await handler(req);

	const docs = req.body.data;

	docs.forEach((doc, index, array) => {
		replaceOne(
			{
				body: {
					collection,
					data: doc,
					filter: { _id: doc._id },
					databaseName: req.body.databaseName,
					collectionName: req.body.collectionName,
				},
			},
			//if last iteration, pass the res to respond to the client
			index === array.length - 1 ? res : undefined
		);
	});
};
