// console.clear();
(function() {
	const http = require("http");
	const port = process.env.PORT || 8080;
	const router = require("./bin/router");

	http.createServer(router)
		.listen(port, () => console.log("Server is online at localhost:%i", port));
})()

module.exports = () => console.log();