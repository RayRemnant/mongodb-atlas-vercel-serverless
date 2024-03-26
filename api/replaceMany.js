import handler from "../lib/handler";
import replaceOne from "./replaceOne"

export default async (req, res) => {

	req.body.data.forEach(doc => {
		replaceOne({
			req: {
				body: {
					data: doc
				}
			}
		})
	})

	res.status(200).json(responseData);
};
