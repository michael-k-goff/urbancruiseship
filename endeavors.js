// Making endeavors

// Modules
var fs = require('fs');

// Additional modules
var ref = require('./references');

var data_out = require('./Endeavors/data-out.json')

get_value = (a, val) => {
	// val is either 'Cost' or 'Benefit'
	let str = a[val].toString();
	let init = str.split(' ')[0];
	let word = str.split('(')[1].split(' ')[0];
	let expo = {"thousands":10**3, "millions":10**6, "billions":10**9, "trillions":10**12, "US":1}[word]
	return init*expo
}

compare_endeavors = (a,b) => {
	return get_value(b,"Benefit")/get_value(b,"Cost") - get_value(a,"Benefit")/get_value(a,"Cost")
}

make_sets = (end_data) => {
	let result = [];
	let set_list = [];
	let have_misc = 0;
	for (let i=0; i<end_data.length; i++) {
		let end = end_data[i]["Set"];
		if (end != "Miscellaneous") {
			if (set_list.indexOf(end) == -1) {
				set_list = set_list.concat(end);
				result = result.concat({"end":end, "ends":[]});
			}
			let j = set_list.indexOf(end);
			result[j]["ends"] = result[j]["ends"].concat(end_data[i]);
		}
		else {
			have_misc =1;
		}
	}
	if (have_misc) {
		result = result.concat({"end":"Miscellaneous", "ends":[]})
		set_list = set_list.concat("Miscellaneous");
		let j = set_list.indexOf("Miscellaneous");
		for (i=0; i<end_data.length; i++) {
			let end = end_data[i]["Set"];
			if (end == "Miscellaneous") {
				result[j]["ends"] = result[j]["ends"].concat(end_data[i])
			}
		}
	}
	// Put the sets in an order
	for (i=0; i<result.length; i++) {
		result[i].ends.sort(compare_endeavors)
	}
	return result;
}

function render_image(image) {
	if (fs.existsSync(__dirname + '/HTML/'+image)) {
		return "<center><img src=\"/" + image + "\" style=\"width: 95%; height: 95%\"></center>";
	}
	else {
		return "<center><font color='red'> Image Under Development: "+image+"</font></center>"
	}
}

render_set = (i, para, data, ref_ids, suppress_margins) => {
	result += "<button class=\"collapsible one-line-solution\" style=\"width: 60%; margin-left: 20%; margin-right: 20%;\">"+sets[i]["end"]+"</button>";
	result += "<div class=\"content content-contracted endeavor-button\">"
	
	new_str = sets[i]["end"].replace(/ /g,"_").replace(/&/g,"").replace(/__/g,"_").toLowerCase();
	
	result += "<p class=\"endeavors-para\"><br>Total efficiency for these endeavors is as follows:</p>"
	result += render_image(new_str+"1"+".jpeg");
	
	result += "<p class=\"endeavors-para\"><br>Net returns on investment (ROI) for these endeavors is as follows:</p>"
	result += render_image(new_str+"2"+".jpeg");
	
	result += "<p class=\"endeavors-para\"><br>Costs and efficiencies for these endeavors is as follows:</p>"
	result += render_image(new_str+"3"+".jpeg");
	result += "<p class=\"endeavors-para\"><br>Abbreviated details of the endeavors are as follows:</p>"
	
	result += "<table class=\"endeavor-table\">"
	result += "<th class=\"endeavor-left-th\">Endeavor</th>"
	result += "<th class=\"endeavor2-th\">Cost</th>";
	result += "<th class=\"endeavor-th\">Cost Explanation</th>";
	result += "<th class=\"endeavor2-th\">Benefit</th>";
	result += "<th class=\"endeavor-th\">Benefit Explanation</th>";
	result += "<th class=\"endeavor-th endeavor-th-end\">Reference<s/th>";
	for (let j=0; j<sets[i]["ends"].length; j++) {
		result += "<tr>"
		result += "<td class=\"endeavor-left-td\">" + sets[i]["ends"][j]["Endeavor"] + "</td>";
		result += "<td class=\"endeavor2-td\">" + sets[i]["ends"][j]["Cost"] +"</td>";
		result += "<td class=\"endeavor-td\">" + sets[i]["ends"][j]["Cost Explanation"] +"</td>";
		result += "<td class=\"endeavor2-td\">" + sets[i]["ends"][j]["Benefit"] +"</td>";
		result += "<td class=\"endeavor-td\">" + sets[i]["ends"][j]["Benefit Explanation"] +"</td>";
		result += "<td class=\"endeavor-td\">" + ref.add_references(sets[i]["ends"][j]["References"], ref_ids, data.references) +"</td>";
		result += "</tr>";
	}
	result += "</table>"
	
	result += "</div>"
	result += "<br><br>\n"
}

render_paragraph_endeavors = (para, data, ref_ids, suppress_margins) => {
	sets = make_sets(data_out);
	result = "";
	for (let i=0; i<sets.length; i++) {
		render_set(i, para, data, ref_ids, suppress_margins)
	}
	return result;
}

module.exports = {
	render_paragraph_endeavors: render_paragraph_endeavors
}