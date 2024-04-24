import handler from "../lib/handler";
import { ObjectId } from "mongodb";

export default async (req, res) => {
	//if called from replaceMany, collection is passed
	const collection = req.body.collection || (await handler(req));

	console.log("COLL ", collection);
	const { filter, data: doc } = req.body;

	const responseData = await collection.replaceOne(filter, doc, {
		upsert: true,
	});

	console.log(`replaceOne OK`);

	res ? res.status(200).json(responseData) : "";
};
