// Module for generating textual content

// Modules
var fs = require('fs');

// Additional modules
var ref = require('./references');

function render_paragraph_image(para, data, ref_ids) {
	blocks = para.split("-")
	if (fs.existsSync(__dirname + '/HTML/'+blocks[1])) {
		if (blocks.length == 2) {
			return "<center><img src=\"/" + blocks[1] + "\" style=\"width: 50%; height: 50%\"></center>"
		}
		else {
			return "<center><img src=\"/" + blocks[1] + "\" style=\"width: "+blocks[2]+"%; height: 20%\"></center>"
		}
	}
	else {
		return "<center><font color='red'> Image Under Development: "+blocks[1]+"</font></center>"
	}
}

function render_paragraph_caption(para, data, ref_ids) {
	var blocks = para.split("!");
	return "<center style=\"font-size:11px\">"+ref.add_references(blocks[1],ref_ids, data.references)+"</center>";
}

function render_paragraph_list(para, data, ref_ids) {
	blocks = para.split("|");
	var text = "<ul><li style=\"margin-left:20%; margin-right:20%\">"
	for (var l=1; l<blocks.length-1; l++) {
		text += ref.add_references(blocks[l],ref_ids, data.references)
		text += "</li><li style=\"margin-left:20%; margin-right:20%\">"
	}
	text += ref.add_references(blocks[blocks.length-1],ref_ids, data.references)
	text += "</li></ul>";
	return text;
}

function render_paragraph_table(para, data, ref_ids) {
	var text = "<div style=\"margin-left:20%; margin-right:20%\"><table class='table'>";
	var rows = para.split("?");
	for (var l=1; l<rows.length; l++) {
		if (l==1) {
			text += "<thead><tr>";
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
				text += "<th>"+ref.add_references(cells[ll],ref_ids, data.references)+"</th>";
			}
			else {
				text += "<td>"+ref.add_references(cells[ll],ref_ids, data.references)+"</td>";
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

function render_paragraph(para, data, ref_ids) {
	var text = "";
	if (para[0] == "-") {
		text = render_paragraph_image(para, data, ref_ids);
	}
	else if (para[0] == "!") {
		text = render_paragraph_caption(para, data, ref_ids);
	}
	else if (para[0] == "|") {
		text = render_paragraph_list(para, data, ref_ids);
	}
	else if (para[0] == "?") {
		text = render_paragraph_table(para, data, ref_ids);
	}
	else {
		text = ref.add_references(para,ref_ids, data.references)
	}
	return "<p style=\"margin-left:20%; margin-right:20%\">"+text+"</p>";
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