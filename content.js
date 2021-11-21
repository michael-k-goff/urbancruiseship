// Module for generating textual content

// Modules
var fs = require('fs');

// Additional modules
var ref = require('./references');
var end = require('./endeavors');

function render_paragraph_image(para, data, ref_ids, suppress_margins) {
	blocks = para.split("-")
	if (fs.existsSync(__dirname + '/HTML/'+blocks[1])) {
		if (blocks.length == 2) {
			if (suppress_margins) {
				return "<center><img src=\"/" + blocks[1] + "\" style=\"width: 30%; height: 30%\"></center>";
			}
			else {
				return "<center><img src=\"/" + blocks[1] + "\" style=\"width: 65%; height: 50%\"></center>";
			}
		}
		else {
			if (suppress_margins) {
				let num = parseInt(blocks[2])+20;
				return "<center><img src=\"/" + blocks[1] + "\" style=\"width: "+(num)+"%; height: 20%\"></center>";
			}
			else {
				return "<center><img src=\"/" + blocks[1] + "\" style=\"width: "+blocks[2]+"%; height: 20%\"></center>";
			}
		}
	}
	else {
		return "<center><font color='red'> Image Under Development: "+blocks[1]+"</font></center>"
	}
}

function render_paragraph_caption(para, data, ref_ids, suppress_margin) {
	var blocks = para.split("!");
	if (suppress_margin) {
		return "<center style=\"font-size:12px; margin-left:15%; margin-right:15%\">"+ref.add_references(blocks[1],ref_ids, data.references)+"</center>";
	}
	else {
		return "<center style=\"font-size:12px; margin-left:30%; margin-right:30%\">"+ref.add_references(blocks[1],ref_ids, data.references)+"</center>";
	}
}

function render_paragraph_quote(para, data, ref_ids) {
	var blocks = para.split("~");
	return "<center style=\"margin-left:32%; margin-right:32%\"><i>"+ref.add_references(blocks[1],ref_ids, data.references)+"</i></center>";
}

function render_paragraph_list(para, data, ref_ids, suppress_margins) {
	blocks = para.split("|");
	var text;
	if (suppress_margins) {
		text = "<ul><li style=\"margin-left:10%; margin-right:10%\">";
	}
	else {
		text = "<ul><li style=\"margin-left:20%; margin-right:20%\">";
	}
	for (var l=1; l<blocks.length-1; l++) {
		text += ref.add_references(blocks[l],ref_ids, data.references)
		if (suppress_margins) {
			text += "</li><li style=\"margin-left:10%; margin-right:10%\">";
		}
		else {
			text += "</li><li style=\"margin-left:20%; margin-right:20%\">"
		}
	}
	text += ref.add_references(blocks[blocks.length-1],ref_ids, data.references)
	text += "</li></ul>";
	return text;
}

function render_paragraph_table(para, data, ref_ids) {
	var text = "<div style=\"margin-left:20%; margin-right:20%\"><table class='endeavor-table'>";
	var rows = para.split("?");
	for (var l=1; l<rows.length; l++) {
		if (l==1) {
			text += "<thead class=\"endeavor-left-th\"><tr>";
		}
		else if (l==2) {
			text += "<tbody><tr>";
		}
		else {
			text += "<tr>";
		}
		cells = rows[l].split("|");
		for (var ll=0; ll<cells.length; ll++) {
			if (l==1) {
				text += "<th class=\"endeavor-left-th\">"+ref.add_references(cells[ll],ref_ids, data.references)+"</th>";
			}
			else {
				text += "<td class=\"endeavor-left-td\">"+ref.add_references(cells[ll],ref_ids, data.references)+"</td>";
			}
		}
		if (l==1) {
			text += "</tr></thead>";
		}
		else if (l==rows.length-1) {
			text += "</tr></tbody>";
		}
		else {
			text += "</tr>";
		}
	}
	text += "</table></div>";
	return text;
}

function render_paragraph_solution(para, data, ref_ids) {
	var blocks = para.split("@");
	let title_block = ref.add_references(blocks[1],ref_ids, data.references).split("!");
	let result = "";
	if (title_block.length === 1) {
		result = "<button type=\"button\" class=\"collapsible one-line-solution\">Solution: "+title_block[0]+"</button>";
	}
	else {
		result = "<button type=\"button\" class=\"collapsible two-line-solution\">Problem:&nbsp&nbsp&nbsp"+ title_block[0]+"<br>Solution:&nbsp&nbsp&nbsp"+title_block[1]+"</button>";
	}
	result += "<div class=\"content content-contracted content-shrinking\">"
	for (let i=2; i<blocks.length; i++) {
		//result += "<p>"+ref.add_references(blocks[i],ref_ids, data.references)+"</p>"
		result += render_paragraph(blocks[i],data, ref_ids, true);
	}
	result += "<a href=\"#\" onclick=\"return false;\">Back to the main section</a>";
	result += "</div>"
	return result;
}

function render_paragraph(para, data, ref_ids, suppress_margins=false) {
	var text = "";
	if (para[0] == "-") {
		text = render_paragraph_image(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "!") {
		text = render_paragraph_caption(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "|") {
		text = render_paragraph_list(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "?") {
		text = render_paragraph_table(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "~") {
		text = render_paragraph_quote(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "@") {
		text = render_paragraph_solution(para, data, ref_ids, suppress_margins);
	}
	else if (para[0] == "#") {
		text = end.render_paragraph_endeavors(para, data, ref_ids, suppress_margins);
	}
	else {
		text = ref.add_references(para,ref_ids, data.references, suppress_margins)
	}
	if (para[0] === "#") {
		return text;
	}
	else if (suppress_margins) {
		return "<p>"+text+"</p>";
	}
	else {
		return "<p style=\"margin-left:20%; margin-right:20%\">"+text+"</p>\n\n";
	}
}

function render_section(data, section, ref_ids) {
	content = "";
	if (section.name) {
		content += "<h3 style=\"margin-left:20%; margin-right:20%\">"+section.name+"</h3>\n"
	}
	for (var j=0;j<section.content.length;j++){
		content += render_paragraph(section.content[j], data, ref_ids);
	}
	return content;
}

function render_sections(data, ref_ids) {
	var content = "";
	for (var i=0; i<data.sections.length;i++) {
		content += render_section(data, data.sections[i], ref_ids)
	}
	return content;
}

module.exports = {
	render_paragraph: render_paragraph,
	render_section: render_section,
	render_sections: render_sections
};