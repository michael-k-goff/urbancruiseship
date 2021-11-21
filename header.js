var fs = require('fs');
var solutions = JSON.parse(fs.readFileSync("solutions.json").toString());
var multi_solutions = JSON.parse(fs.readFileSync("multi_solutions.json").toString());

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
function get_header(page, header_data={}) {
	let logo = "logo.png";
	let link_dest = "/";
	let sitename = null;
	if (header_data.site) {
		for (let i=0; i<multi_solutions.length; i++) {
			if (multi_solutions[i].site === header_data.site) {
				logo = multi_solutions[i].icon; // Comment out this line to use the same logo on all sites.
				link_dest = "/site/"+multi_solutions[i].site;
				sitename = multi_solutions[i].name;
			}
		}
	} 
	var ret_value = "<table style=\"margin-left:20%; margin-right:20%\"><tr style=\"font-size:16px\">";
	ret_value += "<td style=\"vertical-align:middle\"> <a href=\""+link_dest+"\"><img class=\"img-responsive img-portfolio img-hover\" src=\"/"+logo+"\" width=\"100%\" height=\"70%\" alt=\"Urban Cruise Ship\" title=\"Home\"></a> </td>";
	ret_value += "<td style=\"width:15%; vertical-align:top; padding-left: 10px;\">";
	
	ret_value += page == "Main" ? "<b>Home</b>" : "<a href=\"/\">Home</a>";
	ret_value += "<br>";
	if (sitename) {
		ret_value += page == "Home" ? "<b>"+sitename+"</b>" : "<a href=\"/site/"+header_data.site+"\">"+sitename+"</a>";
		ret_value += "<br>";
	}
	else {
		//ret_value += page == "Main" ? "<b>Home</b>" : "<a href=\"/\">Home</a>";
		//ret_value += "<br>";
	}
	ret_value += page == "About" ? "<b>About</b>" : "<a href=\"/about\">About</a>";
	ret_value += "<br>";
	ret_value += page == "Standards" ? "<b>Standards</b>" : "<a href=\"/standards\">Standards</a>";
	ret_value += "<br>";
	ret_value += page == "Team" ? "<b>The Crew</b>" : "<a href=\"/team\">Crew</a>";
	ret_value += "<br>";
	ret_value += page == "Activities" ? "<b>Activities</b>" : "<a href=\"/activities\">Activities</a>";
	//ret_value += "<br>";
	//ret_value += page == "Summary" ? "<b>Solutions</b>" : "<a href=\"/summary\">Solutions</a>";
	ret_value += "</td><td style=\"width:25%; vertical-align:top\">";
	if (header_data["main"]) {
		for (i = 0; i < multi_solutions.length; i++) {
			if (multi_solutions[i].done) {
				ret_value += page==multi_solutions[i].site ? ("<b>"+multi_solutions[i].name+"</b>") : "<a href=\"site/" +multi_solutions[i].site+ "\">"+multi_solutions[i].name+"</a>";
			}
			else {
				ret_value += "<i>"+multi_solutions[i].name+"</i>";
			}
			if (i<multi_solutions.length-1) {
				ret_value += "<br>";
			}
		}
	}
	else if (header_data["site"]) {
		var site_num = 0;
		for (var i=0; i<multi_solutions.length; i++) {
			if (multi_solutions[i].site == header_data["site"]) {
				site_num = i;
			}
		}
		var topics = multi_solutions[site_num]["topics"];
		for (i = 0; i < topics.length; i++) {
			ret_value += page==topics[i].url ? ("<b>"+topics[i].name+"</b>") : "<a href=\"/topic/" +header_data["site"]+"/"+topics[i].url+ "\">"+topics[i].name+"</a>";
			if (i<topics.length-1) {
				ret_value += "<br>";
			}
		}
	}
	else {
		for (i = 0; i < solutions.length; i++) {
			ret_value += page==solutions[i].url ? ("<b>"+solutions[i].name+"</b>") : "<a href=\"/topic/" +solutions[i].url+ "\">"+solutions[i].name+"</a>";
			if (i<solutions.length-1) {
				ret_value += "<br>";
			}
		}
	}
	ret_value += "</td></tr></table>";
	return ret_value;
}

module.exports = {
	get_nav_bar: get_nav_bar,
	get_header: get_header
}