const fs = require("fs")
const path = require("path");
const { logger, sendFile } = require("../helper");
const views = require("./views");
const ve = require("../viewEngine");

const engine = new ve ({viewDir: path.resolve("views"), layout: "main.l"});

module.exports = function(req, res) {
	logger(req, res);
	const { url } = req;
	const filePath = path.resolve("public", url.slice(1));

	if (fs.existsSync(filePath)) {
		if (fs.statSync(filePath).isFile())  return sendFile(filePath, res);
	}
	if(views.hasOwnProperty(url)) return engine.render(res, views[url].view)

	res.statusCode = 404;
	res.end();
}