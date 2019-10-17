// Main includes
var express = require('express')
var app = express();
var session = require('express-session');
var myParser = require("body-parser");
var formidable = require('formidable');
var fs = require('fs');

// Additional modules
var structure = require('./structure');
var dashboard = require('./dashboard');

// Login credentials kept in a separate file
var credentials = JSON.parse(fs.readFileSync("credentials.json").toString())

app.use(session({
    secret: credentials.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(myParser.urlencoded({extended : true}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
	if (req.session && req.session.user === credentials.username && req.session.admin)
		return next();
	else
		return res.sendStatus(401);
};

app.set('port', (process.env.PORT || 80)) // For the deployed app, set the port to 80
app.use(express.static(__dirname + '/HTML'))

app.get('/', function(request, response) {response.send(structure.main())})
app.get('/about', function(request, response) {response.send(structure.about())})
app.get('/topic/:name', function(request,response) {response.send(structure.topic(request.params.name))})
app.get('/solution/:name', function(request,response) {response.send(structure.solution(request.params.name))})
app.get('/login', function(req,res) {res.send(dashboard.login_get())});
app.post('/login', function (req, res) {dashboard.login(req,res)});
app.get('/dashboard',auth,function (req,res) {res.send(dashboard.dashboard())});
app.get('/all_images',auth,function (req,res) {res.send(dashboard.all_images())});
app.post('/file_upload',auth,function(req,res) {dashboard.file_upload()}); // Currently not working

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
})
