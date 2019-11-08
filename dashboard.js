// Dashboard

// Modules
var fs = require('fs');

// Additional modules
var ref = require('./references');

// Login credentials kept in a separate file
var credentials = JSON.parse(fs.readFileSync("credentials.json").toString())

function login(req, res) {
 	if (!req.body.username || !req.body.password) {
		res.send('Login failed');
	} else if(req.body.username === credentials.username && req.body.password === credentials.password) {
		req.session.user = credentials.username;
		req.session.admin = true;
		res.send("login success!<br><br><a href='/dashboard'>Dashboard</a><br><a href='/all_images'>See all Images</a>");
	}
	else {res.send("Wrong username or password. <a href='/login'>Log in</a>")}
}

function login_get() {
	return '<form action="login" method="POST">Name: <input type="text" name="username"><br>Password: <input type="text" name="password"><br><input type="submit" value="Submit"></form>';
}

function render_image_data(im,num) {
	var font_change = {"Not Done":"<font color='red'>", "Revision Needed":"<font color='orange'>", "Done":"<font color='green'>"}[im["status"]]
	var result = "<big><b>" + (num) + ") " + im["filename"] + "</b></big><br>"+font_change+"Status: "+im["status"]+"</font><br><br>" + im["details"] + "<br><br>";
	if ("table" in im) {
		result += "<table><tr><td>"+im["table"][0].join("</td><td>")+"</td></tr>";
		for (var i=1; i<im["table"].length; i++) {
			result += "<tr><td>"+im["table"][i].join("</td><td>")+"</td></tr>";
		}
		result += "</table><br>";
	}
	if ("references" in im) {
		result += "<b>References</b><br><br>"
		for (var i=0; i<im["references"].length; i++) {
			result += ref.make_reference(im["references"][i]) + "<br><br>";
		}
	}
	if ("source_file" in im) {
		result += "<font color='#777777'>Source file: " + im["source_file"] + "</font><br><br>";
	}
	return result + "<br>";
}

function dashboard() {
	// Upload form does not appear to be working.
	//var result = '<form action="/file_upload" enctype="multipart/form-data" method="post"><input type="file" name="upload" multiple><input type="submit" value="Upload"></form><br><br>';
	var result = "<h3>Images to be made or revised</h3>"
	var todo = JSON.parse(fs.readFileSync(__dirname+'/todo.json','utf8'));
	var count = 1;
	for (var i=0; i<todo.length; i++) {
		if (todo[i]["status"] != "Done") {
			result += render_image_data(todo[i],count);
			count += 1;
		}
	}
	return result;
}

function all_images() {
	var result = "<h3>All images: current and under development</h3>"
	var todo = JSON.parse(fs.readFileSync(__dirname+'/todo.json','utf8'));
	for (var i=0; i<todo.length; i++) {
		result += render_image_data(todo[i],i+1);
	}
	return result;
}

// Does not appear to be working
function file_upload(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/HTML/' + file.name;
    });

    form.on('file', function (name, file){
		var files_to_review = fs.readFileSync(__dirname+'/files_to_review.txt').toString('utf8');
		files_to_review += "\n" + file.name;
		fs.writeFileSync(__dirname+'/files_to_review.txt',files_to_review);
    });
	
	res.send("File uploaded. <a href='/dashboard'>Dashboard</a>");
}

module.exports = {
	login: login,
	login_get: login_get,
	dashboard: dashboard,
	all_images: all_images,
	file_upload: file_upload
};