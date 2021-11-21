// Wrap content for the various pages

var fs = require('fs');
var header = require('./header');
var wrapper = fs.readFileSync('wrapper.txt').toString().split('****');

function wrap(content, title, name, header_data={}) {
	// Earlier cities color: FF4848
	const color = {
		"energy":"EDA531",
		"foodwater":"59DF00",
		"cities":"FF8484",
		"habitat":"03EBA6",
		"waste":"C0A545",
		"oceans":"06DCFB",
		"space":"000000", // Was 872187
		"internalization":"FFE920",
		"history":"B2C7D1"
	};
	return wrapper[0] + title + wrapper[1] + ("site" in header_data?color[header_data.site]:"FFF") + wrapper[2] + header.get_header(name, header_data) + content + wrapper[3];
	//return wrapper[0] + title + wrapper[1] + header.get_header(name, header_data) + content + wrapper[2];
}

module.exports = {
	wrap: wrap
};