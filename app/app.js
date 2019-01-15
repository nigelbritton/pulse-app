/**
 * Created on 29/05/2018.
 */

'use strict';

let express = require('express'),
    debug = require('debug')('nodejs-express-handlebars-boilerplate'),
    path = require('path'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    createError = require('http-errors'),
    logger = require('morgan'),
    expressHandlebars = require('express-handlebars'),
    hbs = require('hbs');

let applicationStatus = {
    version: require('../package.json').version,
    name: require('../package.json').name,
    serverPort: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
    started: new Date()
};

let app = express(),
    expressApplicationLocalFunctions = require('./middleware/expressApplicationLocalFunctions'),
    routingPathsMiddleware = require('./middleware/routingPathsMiddleware'),
    indexRouter = require('./routes/index')(applicationStatus),
    apiRouter = require('./routes/api')(applicationStatus);

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHandlebars({defaultLayout: 'layout', extname: '.hbs', layoutsDir: __dirname + '/views', partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use('/static/', express.static(path.join(__dirname, 'public'), { maxAge: 3600 }));

app.locals = expressApplicationLocalFunctions;

app.use(function (req, res, next) {
    res.removeHeader("x-powered-by");
    res.setHeader('X-Frame-Options' , 'deny' );
    res.setHeader('X-Content-Type-Options' , 'nosniff' );
    res.setHeader('X-Permitted-Cross-Domain-Policies' , 'none' );
    res.setHeader('X-XSS-Protection' , '1; mode=block' );
    res.setHeader('Cache-Control', 'public, max-age=' + 3600);
    next();
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/status', function(req, res) {
    res.json( { status: 200, updated: new Date().getTime() } );
});

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(applicationStatus.serverPort, function () {
    debug('');
    debug('############################################################');
    debug('##          nodejs-express-handlebars-boilerplate         ##');
    debug('############################################################');
    debug('');
    debug('Version: ' + applicationStatus.version);
    debug('Started: ' + applicationStatus.started);
    debug('Running environment: ' + applicationStatus.environment);
    debug('Listening on port: ' + applicationStatus.serverPort);
    debug('View folder: ' + path.join(__dirname, 'views'));
    debug('Partials folder: ' + path.join(__dirname, 'views/partials'));
    debug('Public folder: ' + path.join(__dirname, 'public'));
    debug('');
    debug('Application ready and listening... ');
    debug('');
});