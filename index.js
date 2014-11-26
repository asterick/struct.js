var pegjs = require("pegjs"),
	path = require("path"),
	fs = require("fs");

var filename = path.join(__dirname, "grammar", "struct.peg");

module.exports = pegjs.buildParser(fs.readFileSync(filename, 'utf8'), { cache: true });
