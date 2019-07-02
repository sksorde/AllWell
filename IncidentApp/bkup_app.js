var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var fileUpload = require('express-fileupload');		
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost/incident')
//    .then(() => console.log('connection successful'))
//    .catch((err) => console.error(err));

var connection = mongoose.connect('mongodb://localhost/inc', function (err) {
    if (err) { console.log(err) }
    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    admin.buildInfo(function (err, info) {
        console.log(info.version);
        console.log('connection successful');
    });
});

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());	
app.use(express.static(path.join(__dirname, 'public')));
app.use("/includes/", express.static(path.join(__dirname, 'views', 'includes')));
app.use("/controllers/", express.static(path.join(__dirname, 'controllers')));

app.use('/', index);
app.use('/incident', index);
//app.use('/admin', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
