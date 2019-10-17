// Wrap content for the various pages

var fs = require('fs');
var header = require('./header');
var wrapper = fs.readFileSync('wrapper.txt').toString().split('****');

function wrap(content, title, name) {
	return wrapper[0] + title + wrapper[1] + header.get_header(name) + content + wrapper[2];
}

module.exports = {
	wrap: wrap
};