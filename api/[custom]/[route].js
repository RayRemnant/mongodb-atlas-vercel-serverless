import getAllUniqueRecentDoc from "../../api-routes/amazon/getAllUniqueRecentDocs.js";
import getUniqueRecentDocs from "../../api-routes/amazon/getUniqueRecentDocs.js";
import getUniqueRecentDoc from "../../api-routes/amazon/getUniqueRecentDoc.js";
import duplicateCollection from "../../api-routes/custom/duplicateCollection.js";
import findTopSsd from "../../api-routes/custom/findTopSsd.js";

export default async function handler(req, res) {
	const { custom, route } = req.query;
	console.log(req.query);

	switch (custom) {
		case "amazon":
			switch (route) {
				case "getAllUniqueRecentDocs":
					return await getAllUniqueRecentDoc(req, res);
				case "getUniqueRecentDocs":
					return await getUniqueRecentDocs(req, res);
				case "getUniqueRecentDoc":
					return await getUniqueRecentDoc(req, res);
			}
		case "custom":
			switch (route) {
				case "duplicateCollection":
					return await duplicateCollection(req, res);
				case "findTopSsd":
					return await findTopSsd(req, res);
			}
		default:
			res.status(404).json(JSON.stringify({ custom, route }));
	}
}
