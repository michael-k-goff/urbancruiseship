var express = require('express')
var app = express();
var fs = require('fs')

var solutions = JSON.parse(fs.readFileSync("solutions.json").toString())
var wrapper = fs.readFileSync('wrapper.txt').toString().split('****')
var dropdownmenu = ""
for (i = 0; i < solutions.length; i++) { 
	dropdownmenu += "<li><a href=\"/topic/" +solutions[i].url+ "\">"+solutions[i].name+"</a></li>"
}
wrapper = [wrapper[0],wrapper[1]+dropdownmenu + wrapper[2], wrapper[3]]

function get_nav_bar(page) {
	var sep1 = "&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;"
	var sep2 = "<br>";
	var nav_bar = [page == "Home" ? "Home" : "<a href=\"/\">Home</a>", sep1];
	nav_bar = nav_bar.concat([page == "About" ? "About" : "<a href=\"/about\">About</a>", sep1]);
	for (i = 0; i < solutions.length; i++) {
		nav_bar = nav_bar.concat([page==solutions[i].url ? solutions[i].name : "<a href=\"/topic/" +solutions[i].url+ "\">"+solutions[i].name+"</a>"])
		if (i<solutions.length-1) {
			nav_bar = nav_bar.concat( (i==1 || i ==3) ? sep2 : sep1);
		}
	}
	return "<center style=\"font-size:20px\">" + nav_bar.join("") + "</center>";
}

// This is an alternative to get_nav_bar
function get_header(page) {
	var ret_value = "<table style=\"margin-left:20%; margin-right:20%\"><tr style=\"font-size:16px\">";
	ret_value += "<td style=\"vertical-align:middle\"> <a href=\"/\"><img class=\"img-responsive img-portfolio img-hover\" src=\"/logo.png\" width=\"90%\" height=\"50%\" alt=\"Urban Cruise Ship\" title=\"Home\"></a> </td>";
	ret_value += "<td style=\"width:15%; vertical-align:top\">";
	ret_value += page == "Home" ? "<b>Home</b>" : "<a href=\"/\">Home</a>";
	ret_value += "<br>";
	ret_value += page == "About" ? "<b>About</b>" : "<a href=\"/about\">About</a>";
	//ret_value += "<br>";
	//ret_value += page == "Summary" ? "<b>Solutions</b>" : "<a href=\"/summary\">Solutions</a>";
	ret_value += "</td><td style=\"width:25%; vertical-align:top\">";
	for (i = 0; i < solutions.length; i++) {
		ret_value += page==solutions[i].url ? ("<b>"+solutions[i].name+"</b>") : "<a href=\"/topic/" +solutions[i].url+ "\">"+solutions[i].name+"</a>";
		if (i<solutions.length-1) {
			ret_value += "<br>";
		}
	}
	ret_value += "</td></tr></table>";
	return ret_value;
}

app.set('port', (process.env.PORT || 80)) // For the deployed app, set the port to 80
app.use(express.static(__dirname + '/HTML'))

app.get('/', function(request, response) {
	var content = fs.readFileSync('index.txt').toString()
	response.send(wrapper[0] + "Urban Cruise Ship" + wrapper[1] + get_header("Home") + content + wrapper[2])
})

app.get('/about', function(request, response) {
	var content = fs.readFileSync('about.txt').toString()
	response.send(wrapper[0] + "About Us - Urban Cruise Ship" + wrapper[1] + get_header("About") + content + wrapper[2])
})

/*
app.get('/solutions', function(request,response) {
	var content = fs.readFileSync('solutions.txt').toString()
	response.send(wrapper[0] + content + wrapper[1])
})

app.get('/comingsoon', function(request,response) {
	var content = fs.readFileSync('comingsoon.txt').toString()
	response.send(wrapper[0] + content + wrapper[1])
})
*/

app.get('/summary', function(request, response) {
	var data = JSON.parse(fs.readFileSync('summary.json').toString());
	data.references.sort(function(a,b) {
	    if(a.author.toLowerCase() < b.author.toLowerCase()) return -1;
	    if(a.author.toLowerCase() > b.author.toLowerCase()) return 1;
	    if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
	    if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
	    return 0;
	})
	var ref_ids = {}
	for (var i=0; i<data.references.length; i++) {
		ref_ids[data.references[i].ref] = i+1
	}
	var content = ""
	content += "<h1 style=\"margin-left:20%; margin-right:20%\">"+data.title+"</h1>"
	title = data.title + " - Urban Cruise Ship"
	content += render_sections(data, ref_ids);

	//var content = fs.readFileSync('summary.txt').toString()
	response.send(wrapper[0] + "Our Research - Urban Cruise Ship" + wrapper[1] + get_header("Summary") + content + wrapper[2])
})

app.get('/topic/:name', function(request,response) {
	// Find the solution
	var content = "Oops! This category was not found."
	var title = "Urban Cruise Ship"
	for (var i=0; i<solutions.length; i++) {
		if (solutions[i].url == request.params.name) {
			if (solutions[i].notdone) {
				content = fs.readFileSync('comingsoon.txt').toString()
			}
			else {
				var ref_ids = {};
				if ("references" in solutions[i]) {
					solutions[i].references.sort(function(a,b) {
				    	if(a.author.toLowerCase() < b.author.toLowerCase()) return -1;
				   		if(a.author.toLowerCase() > b.author.toLowerCase()) return 1;
				    	if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
				    	if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
				    	return 0;
					})
					for (var j=0; j<data.references.length; j++) {
						ref_ids[data.references[j].ref] = j+1
					}
				}
				content = "<h1 style=\"margin-left:20%; margin-right:20%\">"+solutions[i].name+"</h2>\n";
				if ("intro" in solutions[i]) {
					content += "<p style=\"margin-left:20%; margin-right:20%\">" + solutions[i].intro + "</p>";
					content += "<br>";
				}
				for (var j=0; j<solutions[i].solutions.length; j++) {
					content += "<a href = \"/solution/"+solutions[i].solutions[j].url+"\" style=\"margin-left:20%; margin-right:20%\">"+solutions[i].solutions[j].name+"</a><br>"
				}
				content += "<br>";
				if ("sections" in solutions[i]) {
					content += render_sections(solutions[i], ref_ids);
				}
				title = solutions[i].name + " - Urban Cruise Ship"
			}
		}
	}
	response.send(wrapper[0] + title + wrapper[1] + get_header(request.params.name) + content + wrapper[2])
})

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

function render_sections(data, ref_ids) {
	var content = "";
	for (var i=0; i<data.sections.length;i++) {
		if (data.sections[i].name) {
			content += "<h3 style=\"margin-left:20%; margin-right:20%\">"+data.sections[i].name+"</h3>\n"
		}
		for (var j=0;j<data.sections[i].content.length;j++){
			text = ""
			if (data.sections[i].content[j][0] == "-") {
				blocks = data.sections[i].content[j].split("-")
				if (blocks.length == 2) {
					text = "<center><img src=\"/" + blocks[1] + "\" style=\"width: 50%; height: 50%\"></center>"
				}
				else {
					text = "<center><img src=\"/" + blocks[1] + "\" style=\"width: "+blocks[2]+"%; height: 20%\"></center>"
				}
			}
			else if (data.sections[i].content[j][0] == "!") {
				var blocks = data.sections[i].content[j].split("!");
				text = "<center style=\"font-size:11px\">"+add_references(blocks[1],ref_ids, data.references)+"</center>";
			}
			else if (data.sections[i].content[j][0] == "|") {
				blocks = data.sections[i].content[j].split("|")
				text = "<ul><li style=\"margin-left:20%; margin-right:20%\">"
				for (var l=1; l<blocks.length-1; l++) {
					text += add_references(blocks[l],ref_ids, data.references)
					text += "</li><li style=\"margin-left:20%; margin-right:20%\">"
				}
				text += add_references(blocks[blocks.length-1],ref_ids, data.references)
				text += "</li></ul>"
			}
			else if (data.sections[i].content[j][0] == "?") {
				text += "<div style=\"margin-left:20%; margin-right:20%\"><table class='table'>"
				rows = data.sections[i].content[j].split("?")
				for (var l=1; l<rows.length; l++) {
					if (l==1) {
						text += "<thead><tr>"
					}
					else if (l==2) {
						text += "<tbody><tr>"
					}
					else {
						text += "<tr>"
					}
					cells = rows[l].split("|")
					for (var ll=0; ll<cells.length; ll++) {
						if (l==1) {
							text += "<th>"+add_references(cells[ll],ref_ids, data.references)+"</th>"
						}
						else {
							text += "<td>"+add_references(cells[ll],ref_ids, data.references)+"</td>"
						}
					}
					if (l==1) {
						text += "</tr></thead>"
					}
					else if (l==rows.length-1) {
						text += "</tr></tbody>"
					}
					else {
						text += "</tr>"
					}
				}
				text += "</table></div>"
			}
			else {
				text = add_references(data.sections[i].content[j],ref_ids, data.references)
			}
			content += "<p style=\"margin-left:20%; margin-right:20%\">"+text+"</p>"
		}
	}
	return content;
}

app.get('/solution/:name', function(request,response) { // Parse and prepare the web page for the solution
	// Read and process the JSON file
	var data = JSON.parse(fs.readFileSync('solutions/'+request.params.name+'.json').toString())
	data.references.sort(function(a,b) {
	    if(a.author.toLowerCase() < b.author.toLowerCase()) return -1;
	    if(a.author.toLowerCase() > b.author.toLowerCase()) return 1;
	    if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
	    if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
	    return 0;
	})
	var ref_ids = {}
	for (var i=0; i<data.references.length; i++) {
		ref_ids[data.references[i].ref] = i+1
	}
	
	// Prepare the HTML
	var content = ""
	if ("parent_link" in data) {
		content += "<br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/topic/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<h1 style=\"margin-left:20%; margin-right:20%\">"+data.title+"</h1>"
	title = data.title + " - Urban Cruise Ship"
	content += render_sections(data, ref_ids);
	if ("parent_link" in data) {
		content += "<br><br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/topic/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<div style=\"margin-left:20%; margin-right:20%\"><br><br><h3>References</h3>"
	for (var i=0; i<data.references.length; i++) {
		content += "<p id=\""+data.references[i].ref+"\">[" + (i+1) + "] " + make_reference(data.references[i]) + "</p>";
	}
	content += "</div>"
	response.send(wrapper[0] + title + wrapper[1] + get_header(request.params.name) + content + wrapper[2])
})

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
	if (ref.isbook) {result += "</i>. "}
	else {result += "\". "}
	if (ref.url) {result += "</a>"}
	if (ref.journal) {
		result += ref.journal
		if (ref.journal[ref.journal.length-1] != ".") {result += "."}
		result += " "
	}
	if (ref.date) {result += "<b>"+ref.date+"</b>."}
	return result;
}

function make_reference_light(ref) {
	var result = ref.author;
	if (ref.author[ref.author.length-1] != ".") {result += "."}
	result += " "
	result += ref.title + ". "
	if (ref.date) {result += ref.date+"."}
	return result;
}

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
})
