var fs = require('fs');
var solutions = JSON.parse(fs.readFileSync("solutions.json").toString());

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

module.exports = {
	get_nav_bar: get_nav_bar,
	get_header: get_header
}