import handler from "../lib/handler.js";

export default async (req, res) => {
	try {
	const collection = await handler(req);
	const { filter } = req.body;

	const results = await collection.find(filter).toArray();

	res.status(200).json(results);
	}catch(err){
		res.status(500).json({error: err.message});
	}
};
