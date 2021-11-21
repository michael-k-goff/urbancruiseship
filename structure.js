// Main pages

// Modules
var fs = require('fs');

// Additional modules
var content_generator = require('./content');
var ref = require('./references');
var header = require('./header');
var wrapper = require('./wrapper');

var solutions = JSON.parse(fs.readFileSync("solutions.json").toString());
var multi_solutions = JSON.parse(fs.readFileSync("multi_solutions.json").toString());

function solution(name) { // Now obsolete
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

function multi_solution(site, name) {
	// Find the site
	var site_num = 0;
	for (var i=0; i<multi_solutions.length; i++) {
		if (multi_solutions[i].site == site) {
			site_num = i;
		}
	}
	// Read and process the JSON file
	var data = JSON.parse(fs.readFileSync('solutions/'+name+'.json').toString());
	var ref_ids = ref.sort_references(data.references);
	
	// Prepare the HTML
	var content = ""
	if ("parent_link" in data) {
		content += "<br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/site/"+site+"\">"+multi_solutions[site_num]["name"]+"</a> / <a href=\"/topic/"+site+"/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<h1 style=\"margin-left:20%; margin-right:20%\">"+data.title+"</h1>"
	title = data.title + " - " + multi_solutions[site_num]["name"] + " - Urban Cruise Ship"
	content += content_generator.render_sections(data, ref_ids);
	if ("parent_link" in data) {
		content += "<br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/site/"+site+"\">"+multi_solutions[site_num]["name"]+"</a> / <a href=\"/topic/"+site+"/"+data.parent_link+"\">"+data.parent_name+"</a>.</p>"
	}
	content += "<div style=\"margin-left:20%; margin-right:20%\"><br><br><h3>References</h3>";
	content += ref.reference_list(data.references);
	content += "</div>";
	return wrapper.wrap(content, title, name,{"site":site});
}

function topic(name) { // Now obsolete
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
				content = "<div style=\"margin-left:20%; margin-right:20%\"><img src=\"/"+solutions[i].icon+"\" alt="+solutions[i].name+" style=\"height:60px;\"></div>";
				if ("intro" in solutions[i]) {
					content += "<br><p style=\"margin-left:20%; margin-right:20%\">" + solutions[i].intro + "</p>";
				}
				content += "<br>";
				for (var j=0; j<solutions[i].solutions.length; j++) {
					if (solutions[i].solutions[j].name.split('(').length == 1) {
						content += "<h6><a href = \"/solution/"+solutions[i].solutions[j].url+"\" style=\"margin-left:20%; margin-right:20%\">"+solutions[i].solutions[j].name+"</a></h6>";
					}
					else {
						content += "<h6 style=\"margin-left:20%; margin-right:20%\">"+solutions[i].solutions[j].name+"</h6>";
					}
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

function multi_topic(site,topic) {
	// Find the site
	var site_num = 0;
	for (var i=0; i<multi_solutions.length; i++) {
		if (multi_solutions[i].site == site) {
			site_num = i;
		}
	}
	// Find the solution
	var content = "Oops! This category was not found."
	var title = "Urban Cruise Ship"
	for (var i=0; i<multi_solutions[site_num]["topics"].length; i++) {
		if (multi_solutions[site_num]["topics"][i].url == topic) {
			if (multi_solutions[site_num]["topics"][i].notdone) {
				content = fs.readFileSync('comingsoon.txt').toString()
			}
			else {
				var ref_ids = ("references" in multi_solutions[site_num]["topics"][i]) ? ref.sort_references(multi_solutions[site_num]["topics"][i].references) : {};
				content = "<div style=\"margin-left:20%; margin-right:20%\"><img src=\"/"+multi_solutions[site_num]["topics"][i].icon+"\" alt="+multi_solutions[site_num]["topics"][i].name+" style=\"height:60px;\"></div>";
				content += "<br><p style=\"margin-left:20%; margin-right:20%\">Back to <a href=\"/site/"+site+"\">"+multi_solutions[site_num].name+"</a>.</p>"
				if ("intro" in multi_solutions[site_num]["topics"][i] && multi_solutions[site_num]["topics"][i].intro.length > 0) {
					content += "<br><p style=\"margin-left:20%; margin-right:20%\">" + multi_solutions[site_num]["topics"][i].intro + "</p>";
					content += "<br>";
				}
				for (var j=0; j<multi_solutions[site_num]["topics"][i].solutions.length; j++) {
					if (multi_solutions[site_num]["topics"][i].solutions[j].name.split('(').length == 1) {
						content += "<h6><a href = \"/solution/"+site+"/"+multi_solutions[site_num]["topics"][i].solutions[j].url+"\" style=\"margin-left:20%; margin-right:20%\">"+multi_solutions[site_num]["topics"][i].solutions[j].name+"</a></h6>";
					}
					else {
						content += "<h6 style=\"margin-left:20%; margin-right:20%\">"+multi_solutions[site_num]["topics"][i].solutions[j].name+"</h6>";
					}
				}
				content += "<br>";
				if ("content" in multi_solutions[site_num]["topics"][i]) { // Generally preferred over including content directly in the solutions object.
					// Read and process the JSON file
					var data = JSON.parse(fs.readFileSync('solutions/'+ multi_solutions[site_num]["topics"][i].content+'.json').toString());
					var ref_ids = ref.sort_references(data.references);
					content += content_generator.render_sections(data, ref_ids);
					content += "<div style=\"margin-left:20%; margin-right:20%\"><br><br><h3>References</h3>";
					content += ref.reference_list(data.references);
				}
				// The following is for sections with content defined in the solutions object.
				// It is preferred to have this in a separate file; see the 'content' field above.
				if ("sections" in multi_solutions[site_num]["topics"][i]) {
					content += content_generator.render_sections(multi_solutions[site_num]["topics"][i], ref_ids);
				}
				title = multi_solutions[site_num]["topics"][i].name + " - " + multi_solutions[site_num].name + " - Urban Cruise Ship"
			}
		}
	}
	return wrapper.wrap(content, title, topic, {"site":site});
}

function main() {
	var content = fs.readFileSync('index.txt').toString();
	return wrapper.wrap(content, "Urban Cruise Ship", "Main");
}

// For the broad metasite
function overall_main() {
	var content = fs.readFileSync('main_index.txt').toString().split("****");
	let site_list = "<div style='display: grid; grid-template-columns: 1fr 1fr 1fr;'>";
	let site_list_dev = "<div style='display: grid; grid-template-columns: 1fr 1fr 1fr;'>";
	for (var i=0; i<multi_solutions.length; i++) {
		if (multi_solutions[i].done) {
			site_list += "<div style='width:200px' class=\"main-solution-box\"><a href=\"site/"+multi_solutions[i].site+"\"><img class=\"img-hover\" src=\""+multi_solutions[i].icon+"\" alt=\""+multi_solutions[i].name+"\" title=\""+multi_solutions[i].name+"\" style=\"width:200px;\"></a>";
			site_list += "<p style='width:200px; padding-left:3px; margin-top:-12px; padding-top:-12px; margin-bottom:-12px; padding-bottom:-12px;'><br>"+multi_solutions[i].blurb+"</p><br></div>";
		}
		else {
			site_list_dev += "<div style='width:200px' class=\"main-solution-box\"><img class=\"img-hover\" src=\""+multi_solutions[i].icon+"\" alt=\""+multi_solutions[i].name+"\" title=\""+multi_solutions[i].name+"\" style=\"width:200px;\">";
			site_list_dev += "<p style='width:200px; padding-left:3px; margin-top:-12px; padding-top:-12px; margin-bottom:-12px; padding-bottom:-12px;'><br>"+multi_solutions[i].blurb+"</p><br></div>";
		}
	}
	site_list += "</div>";
	site_list_dev += "</div>";
	return wrapper.wrap(content[0]+site_list+content[1]+site_list_dev+content[2], "Urban Cruise Ship", "Main",{"main":1});
}

// For each individual site
function site(website) {
	var content = fs.readFileSync('site_index.txt').toString();
	// Figure out where the data is about this site
	var site_num = 0;
	for (var i=0; i<multi_solutions.length; i++) {
		if (multi_solutions[i].site == website) {
			site_num = i;
		}
	}
	// Fill in the introductory text
	contents = content.split("***");
	content = contents[0]+multi_solutions[site_num]["blurb"]+contents[1]; // This was 'intro' rather than 'blurb'. Now 'intro' is not being used.
	// Set up the links and icons
	var topics = multi_solutions[site_num]["topics"];
	var site_list = "";
	for (i=0; i<topics.length; i++) {
		site_list += "<a href=\"/topic/"+website+"/"+topics[i].url+"\"><img class=\"img-hover\" src=\"/"+topics[i].icon+"\" alt=\""+topics[i].name+"\" title=\""+topics[i].name+"\" style=\"height:40px;\"></a>";
	}
	site_list += "<br></div><br><br>";
	return wrapper.wrap(content+site_list, multi_solutions[site_num].name + " - Urban Cruise Ship", "Home",{"site":website});
}

function about() {
	var content = fs.readFileSync('about.txt').toString();
	return wrapper.wrap(content, "About Us - Urban Cruise Ship", "About",{"main":1});
}

function standards() {
	var content = fs.readFileSync('standards.txt').toString();
	return wrapper.wrap(content, "Our Standards - Urban Cruise Ship", "Standards",{"main":1});
}

function team() {
	var content = fs.readFileSync('team.txt').toString();
	return wrapper.wrap(content, "The Crew - Urban Cruise Ship", "Team",{"main":1});
}

function activities() {
	var content = fs.readFileSync('activities.txt').toString();
	return wrapper.wrap(content, "Activities - Urban Cruise Ship", "Activities",{"main":1});
}

module.exports = {
	solution: solution,
	multi_solution:multi_solution,
	topic: topic,
	multi_topic:multi_topic,
	main: main,
	overall_main: overall_main,
	site: site,
	about: about,
	standards: standards,
	team: team,
	activities: activities
}