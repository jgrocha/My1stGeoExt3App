//Add App to global namespace. We wil store any global variables we would like to be accessible from other modules

if(!global['App']) {
    global.App = {};
}

var express = require('express'),
    path = require('path'),
    direct = require('extdirect'),
    //db = require('./server-db'),
    pg = require('pg'),
    nconf = require('nconf');

nconf.env().file({
    file: './server-config.json'
});

var serverConfig = nconf.get("ServerConfig"),
    directConfig = nconf.get("ExtDirectConfig"),
    ClientConfig = nconf.get("ClientConfig");

//Middleware
var favicon = require('serve-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    errorHandler = require('errorhandler');

var app = express();
global.App.env = app.get('env');

global.App.postgres = pg;
if (global.App.env === 'development') {
    global.App.connection = serverConfig.dbdevelopment;
} else {
    global.App.connection = serverConfig.dbproduction;
}

console.log(global.App.env);
console.log(global.App.connection);

pg.on('error', function() {
    // https://github.com/brianc/node-postgres/issues/821
    console.log('PostgreSQL server error');
});


//Configure
app.set('port', process.env.PORT || serverConfig.port);

//app.use(favicon(__dirname + serverConfig.webRoot + '/favicon.ico'));

app.use(logger(serverConfig.logger));

app.use(methodOverride());

if(serverConfig.enableSessions) {
    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: serverConfig.sessionSecret
    }));
}

if(serverConfig.enableCompression) {
    app.use(compression()); //Performance - we tell express to use Gzip compression
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

if(serverConfig.enableUpload) {
    app.use(multer({dest: serverConfig.fileUploadFolder}));
}
app.use(express.static(path.join(__dirname, serverConfig.webRoot)));

//CORS Supports
if(serverConfig.enableCORS){

    app.use( function(req, res, next) {
        var ac = serverConfig.AccessControl;
        res.header('Access-Control-Allow-Origin', ac.AllowOrigin); // allowed hosts
        res.header('Access-Control-Allow-Methods', ac.AllowMethods); // what methods should be allowed
        res.header('Access-Control-Allow-Headers', ac.AllowHeaders); //specify headers
        res.header('Access-Control-Allow-Credentials', ac.AllowCredentials); //include cookies as part of the request if set to true
        res.header('Access-Control-Max-Age', ac.MaxAge); //prevents from requesting OPTIONS with every server-side call (value in seconds)

        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
        }
        else {
            next();
        }
    });
}

//Warm up Direct
var directApi = direct.initApi(directConfig);
var directRouter = direct.initRouter(directConfig);

//Routes
//GET method returns API
app.get(directConfig.apiUrl, function(req, res) {
    try{
        directApi.getAPI(
            function(api){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(api);
            }, req, res
        );
    }catch(e){
        console.log(e);
    }
});

// Ignoring any GET requests on class path
app.get(directConfig.classRouteUrl, function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({success:false, msg:'Unsupported method. Use POST instead.'}));
});

// POST request process route and calls class
app.post(directConfig.classRouteUrl, function(req, res) {
    directRouter.processRoute(req, res);
});

//Dev
if (app.get('env') === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

app.listen(app.get('port'), function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});