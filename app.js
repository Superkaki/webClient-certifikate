/*
 * load dependencies
 */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mustacheExpress = require('mustache-express');
const i18n = require("i18n");
const errorHandler = require('errorhandler');
const minifyHTML = require('express-minify-html');

loadEnvironmentVariables();
loadMultilanguage();

/**
 * Create Express server.
 */
let app = express();

/**
 * Express configuration.
 */
configureExpress();

// view engine setup
// Register '.mustache' extension with The Mustache Express
app.engine('.mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
// init i18n module for this loop
app.use(i18n.init);

/*
 * load routes
 */
const index = require('./routes/index');

app.use('/', index);

// register helper as a locals function wrapped as mustache expects
app.use(function (req, res, next) {
  // mustache helper
  res.locals.__ = function () {
    return function (text, render) {
      return i18n.__.apply(req, arguments);
    };
  };
  next();
});

loadErrorHandler();

function configureExpress() {
  console.log("Configuring express...");

  let minimize = false;
  if (minimize) {
    app.use(minifyHTML({
      override:      true,
      exception_url: false,
      htmlMinifier: {
          removeComments:            true,
          collapseWhitespace:        true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes:     true,  
          removeEmptyAttributes:     true,
          minifyJS:                  false
      }
    }));
  }
}

function loadMultilanguage() {
  i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'es'],
    // you may alter a site wide default locale
    defaultLocale: 'es',
    // sets a custom cookie name to parse locale settings from  - defaults to NULL
    cookie: 'lang',
    // where to store json files - defaults to './locales' relative to modules directory
    directory: './locales',
    // whether to write new locale information to disk - defaults to true
    updateFiles: false,
    // what to use as the indentation unit - defaults to "\t"
    indent: "\t",
    // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
    extension: '.json',
  });
}

function loadEnvironmentVariables(){
  /**
   * Load environment variables from .env file, where API keys and passwords are configured.
   */
  dotenv.load({ path: '.env' });
}

function loadErrorHandler() {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (process.env.ENABLE_DEFAULT_ERROR_HANDLER=='true') {
    console.log("     Loading default error handler");
    /**
     * Default Error Handler.
     */
     app.use(errorHandler());
  }
  else{
    console.log("     Loading custom error handler");
    /*
     * custom error handler
     */
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.locals.developmentMode = process.env.DEVELOPMENT=="true";

      console.log("Showing error with development mode?: "+res.locals.developmentMode);

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
}

let port = require('./conf/conf.json').port;
app.listen(port);
console.log("Magic happens at localhost:" + port);

module.exports = app;
