// Main pages

// Modules
var fs = require('fs');

// Additional modules
var content_generator = require('./content');
var ref = require('./references');
var header = require('./header');
var wrapper = require('./wrapper');

var solutions = JSON.parse(fs.readFileSync("solutions.json").toString());

function solution(name) {
	// Read and process the JSON file
	var data = JSON.parse(fs.readFileSync('solutions/'+name+'.json').toString());
	var ref_ids = ref.sort_references(data.references);
	
	// Prepare the HTML
	var content = ""
	if ("parent_link" in data) {
		content += "<br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/topic/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<h1 style=\"margin-left:20%; margin-right:20%\">"+data.title+"</h1>"
	title = data.title + " - Urban Cruise Ship"
	content += content_generator.render_sections(data, ref_ids);
	if ("parent_link" in data) {
		content += "<br><br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/topic/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<div style=\"margin-left:20%; margin-right:20%\"><br><br><h3>References</h3>";
	content += ref.reference_list(data.references);
	content += "</div>";
	return wrapper.wrap(content, title, name);
}

function topic(name) {
	// Find the solution
	var content = "Oops! This category was not found."
	var title = "Urban Cruise Ship"
	for (var i=0; i<solutions.length; i++) {
		if (solutions[i].url == name) {
			if (solutions[i].notdone) {
				content = fs.readFileSync('comingsoon.txt').toString()
			}
			else {
				var ref_ids = ("references" in solutions[i]) ? ref.sort_references(solutions[i].references) : {};
				content = "<div style=\"margin-left:20%; margin-right:20%\"><img src=\"/"+solutions[i].icon+"\" alt="+solutions[i].name+" style=\"height:60px;\"></div>"
				if ("intro" in solutions[i]) {
					content += "<br><p style=\"margin-left:20%; margin-right:20%\">" + solutions[i].intro + "</p>";
				}
				content += "<br>";
				for (var j=0; j<solutions[i].solutions.length; j++) {
					content += "<a href = \"/solution/"+solutions[i].solutions[j].url+"\" style=\"margin-left:20%; margin-right:20%\">"+solutions[i].solutions[j].name+"</a><br>"
				}
				content += "<br>";
				if ("sections" in solutions[i]) {
					content += content_generator.render_sections(solutions[i], ref_ids);
				}
				title = solutions[i].name + " - Urban Cruise Ship"
			}
		}
	}
	return wrapper.wrap(content, title, name);
}

function main() {
	var content = fs.readFileSync('index.txt').toString();
	return wrapper.wrap(content, "Urban Cruise Ship", "Home");
}

function about() {
	var content = fs.readFileSync('about.txt').toString();
	return wrapper.wrap(content, "About Us - Urban Cruise Ship", "About");
}

module.exports = {
	solution: solution,
	topic: topic,
	main: main,
	about: about
}