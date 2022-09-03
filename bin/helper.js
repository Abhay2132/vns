const fs = require("fs");
const mime = require("./mime.json");

function logger(req, res) {
	const { url, method } = req;
	const time = Date.now();
	res.on("finish", () => {
		console.log(url, method, res.statusCode, (Date.now() - time).toFixed(2) + "ms");
	})
}

function sendFile(filePath, res) {
	if (!fs.existsSync(filePath)) {
		res.statusCode = 404;
		return res.end();
	}
	try {

		var ext = filePath.split("/").at(-1).split("?").at(0).split(".").at(-1);
		const size = fs.statSync(filePath).size;
		const contentType = mime[ext] || "application/octet-stream";

		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.log({ err })
				statusCode = 500;
				return res.end();
			}
			const content = data.toString() || '';

			res.statusCode = 200;
			res.setHeader("Content-Type", contentType)
			res.setHeader("Content-Length", size)
			res.end(content);
		})
	} catch (e) { console.error({ e, filePath }) }
}

module.exports = {
	logger,
	sendFile
}