// Module for generating references text

// Given a block of text with inline references, replace them with the appropriate numbers
function add_references(text_block, ref_ids, refs) {
	text_blocks = text_block.split("[")
	text = text_blocks[0]
	for (var k=1; k<text_blocks.length; k++) {
		halves = text_blocks[k].split("]")
		ref = ref_ids[halves[0]]
		if (!ref) {ref = "???"}
		text += ("<a href=\"#"+halves[0]+"\" title=\""+make_reference_light(refs[ref-1])+"\">[" + ref.toString() + "]</a>" + halves[1])
	}
	return text;
}

// Generate text for references at the end of a section
function make_reference(ref) {
	var result = ref.author;
	if (ref.author[ref.author.length-1] != ".") {result += "."}
	result += " "
	if (ref.isbook) {result += "<i>"}
	else {result += "\""}
	if (ref.url) {
		result += "<a href = \"" +ref.url + "\">"
	}
	result += ref.title
	if (ref.url) {result += "</a>"}
	if (ref.isbook) {result += "</i>. "}
	else {result += "\". "}
	if (ref.journal) {
		result += ref.journal
		if (ref.journal[ref.journal.length-1] != ".") {result += "."}
		result += " "
	}
	if (ref.date) {result += "<b>"+ref.date+"</b>."}
	return result;
}

// Generate text for an inline reference
function make_reference_light(ref) {
	var result = ref.author;
	if (ref.author[ref.author.length-1] != ".") {result += "."}
	result += " "
	result += ref.title + ". "
	if (ref.date) {result += ref.date+"."}
	return result;
}

function sort_references(references) {
	references.sort(
		function(a,b) {
			if(a.author.toLowerCase() < b.author.toLowerCase()) return -1;
			if(a.author.toLowerCase() > b.author.toLowerCase()) return 1;
			if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
			if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
			return 0;
		}
	);
	var ref_ids = {};
	for (var j=0; j<references.length; j++) {
		ref_ids[references[j].ref] = j+1
	}
	return ref_ids;
}

function reference_list(references) {
	var content = "";
	for (var i=0; i<references.length; i++) {
		content += "<p id=\""+references[i].ref+"\">[" + (i+1) + "] " + make_reference(references[i]) + "</p>";
	}
	return content;
}

module.exports = {
	add_references: add_references,
	make_reference: make_reference,
	make_reference_light: make_reference_light,
	sort_references: sort_references,
	reference_list: reference_list
}