// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var bodyParser = require('body-parser');

// extra modules to integrate subscription service
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const routes = require('./routes');
const bbird = require('bluebird');
var mongoose   = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';

//Configure mongoose's promise to global promise
mongoose.Promise = bbird; 

// configure app to use bodyParser()
// this will let us get the data from a POST

// defining the express app
var app = express();                 // define our app using express

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

if(!isProduction) {
  app.use(errorHandler());
}

var port = process.env.PORT || 8080;        // set our port

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true }); // connect to our database
mongoose.set('debug', true);

//Error handlers & middlewares
if(!isProduction) {
  app.use(errorHandler({log: errorNotification}))
}

function errorNotification (err, str, req) {
  var title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}

// START THE SERVER
// =============================================================================
app.listen(port, () => console.log('Server running on http://localhost:8080/'));