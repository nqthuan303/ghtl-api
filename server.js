var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var passport	= require('passport');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var clientRouter = require('./routes/client.router');
var userRouter = require('./routes/user.router');
var orderLogRouter = require('./routes/orderLog.router');
var districtRouter = require('./routes/district.router');
var orderStatusRouter = require('./routes/orderStatus.router');
var orderRouter = require('./routes/order.router');
var provinceRouter = require('./routes/province.router');
var wardRouter = require('./routes/ward.router');

var env = process.env.NODE_ENV || 'dev';

var conn = 'mongodb://localhost:27017/giaohangtienloi';
var port = 3000;

if(env !== 'dev'){
  conn = 'mongodb://nqthuan303:thuan1602@ds031632.mlab.com:31632/giaohangtienloi';
  port = process.env.PORT;
}

mongoose.connect(conn);


var app = express();

//View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static Folder
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api/client', clientRouter);
app.use('/api/user', userRouter);
app.use('/api/orderlog', orderLogRouter);
app.use('/api/district', districtRouter);
app.use('/api/orderStatus', orderStatusRouter);
app.use('/api/order', orderRouter);
app.use('/api/province', provinceRouter);
app.use('/api/ward', wardRouter);

app.use('/', function (req, res) {
  res.render("index.html");
});


app.listen(port, function(){
  console.log('server started on port '+ port);
});
