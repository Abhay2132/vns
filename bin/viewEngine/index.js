const fs = require("fs")
const path = require("path");

module.exports = function({ ext, viewDir, layout }) {
	this.ext = ext;
	this.viewDir = viewDir;
	this.layout = path.resolve(viewDir, "layouts", layout);

	if (!fs.existsSync(viewDir)) throw new Error({ ENOENT: `viewDir '${viewDir}' does not exists !` })
	if (!fs.statSync(viewDir).isDirectory()) throw new Error({ ENODIR: `viewDir '${viewDir}' is not a Directory !` })
	if (!fs.existsSync(viewDir)) throw new Error({ ENOENT: `viewDir '${viewDir}' does not exists !` });

	fs.readFile(this.layout, (err, data) => {
		if (err) throw new Error(err)
		this.base = data.toString() || "";
	})

	this.render = function(res, view, data={}) {
		// view += ".v";
		const viewPath = path.join(this.viewDir, view);
		if (!fs.existsSync(viewPath)) throw new Error({ ENOVIEW: `view '${view}' does not exits ` });
		fs.readFile(viewPath, (err, data)=>{
			if (err) {
				res.statusCode = 500;
				return res.end()
			}
			const text = data.toString();
			const content = eval(`const _body_ = \`${text}\`; const content = \`${this.base}\`; content;`);
			
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.setHeader("Content-Length", content.length);

			res.end(content);
		})
	}
}