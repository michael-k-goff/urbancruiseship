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
var kaya = require('./kaya');

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

//app.get('/', function(request, response) {response.send(structure.main())});
//app.get('/about', function(request, response) {response.send(structure.about())});
//app.get('/standards', function(request, response) {response.send(structure.standards())});
//app.get('/team', function(request, response) {response.send(structure.team())});
//app.get('/activities',function(request,response) {response.send(structure.activities())});
//app.get('/topic/:name', function(request,response) {response.send(structure.topic(request.params.name))});
//app.get('/solution/:name', function(request,response) {response.send(structure.solution(request.params.name))});
app.get('/login', function(req,res) {res.send(dashboard.login_get())});
app.post('/login', function (req, res) {dashboard.login(req,res)});
app.get('/dashboard',auth,function (req,res) {res.send(dashboard.dashboard())});
app.get('/all_images',auth,function (req,res) {res.send(dashboard.all_images())});
app.post('/file_upload',auth,function(req,res) {dashboard.file_upload()}); // Currently not working
app.get('/kaya', function(req, res) {kaya.kaya(req, res)});
// Following are some new pages as part of a proposed redesign (started May 21, 2020). Remove the /x portion if and when they become official.
//app.get('/',function (req,res) {res.send(structure.overall_main())});
app.get('/site/:site',function(req,res) {res.send(structure.site(req.params.site))});
app.get('/topic/:site/:topic', function(req,res) {res.send(structure.multi_topic(req.params.site, req.params.topic))});
app.get('/solution/:site/:name',function(req,res) {res.send(structure.multi_solution(req.params.site, req.params.name))});
// Starting here is the redesign starting on October 27, 2021.
app.get('/', (req,res)=>res.send( fs.readFileSync('index.html').toString() ));
app.get('/about', (req,res)=>res.send( fs.readFileSync('about.html').toString() ));
app.get('/team', (req,res)=>res.send( fs.readFileSync('team.html').toString() ));
app.get('/standards', (req,res)=>res.send( fs.readFileSync('standards.html').toString() ));
app.get('/activities', (req,res)=>res.send( fs.readFileSync('activities.html').toString() ));

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
})
