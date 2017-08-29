var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes')
var mongoose = require('mongoose')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)

var app = express();
var dbUrl = 'mongodb://localhost/hblog'
mongoose.connect(dbUrl)
// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');

//session for db
app.use(session({
  secret: 'hblog',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//   next()
// });

//router
router(app)


//moment
app.locals.moment = require("moment")

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });



module.exports = app;
