import getUniqueRecentDocs from "../../api-routes/amazon/getUniqueRecentDocs";
import duplicateCollection from "../../api-routes/custom/duplicateCollection";
import findTopSsd from "../../api-routes/custom/findTopSsd";

export default async function handler(req, res) {
	const { custom, route } = req.query;
	console.log(req.query);

	switch (custom) {
		case "amazon":
			switch (route) {
				case "getUniqueRecentDocs":
					return await getUniqueRecentDocs(req, res);
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
