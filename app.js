let express = require('express');
let bodyParser = require('body-parser');

let config = require('./config/sys_config');

/******************** Start express service ******************/
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/******************** Allow cross origin ******************/
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers',
        'Origin, ' +
        'X-Requested-With, ' +
        'Content-Type, ' +
        'Accept, ' +
        'Key-Value, ' +
        'Access-Token, ' +
        'Device-Type'
    );
    next();
});

/******************** Load balancing response ******************/
app.get('/scaling', function (req, res) {
    return res.status(200).end();
});

/************************ Redirect to HTTPS ************************/
// app.use(function (req, res, next) {
//     if (req.get('x-forwarded-proto') === 'http' && process.env.NODE_ENV === 'production') {
//         return res.redirect('https://' + req.get('host') + req.url);
//     }
//     next();
// });

/******************** Print API requests ******************/
app.all('*', function (req, res, next) {
    console.log(req.url);
    if (process.env.NODE_ENV !== 'production') {
        console.log('req.body:' + JSON.stringify(req.body));
    }
    next();
});

/******************** Limiter check ******************/
let limiterCheck = require('./middleware/limiter');

app.post('*', limiterCheck.limiterCheck);

/******************** API requests needs to validate token ******************/
let tokenvalidate = require('./middleware/tokenValidate');
let client2c_regex_exempted = new RegExp('^/client2c/(?!((auth/*.*)|(search/*.*)|(app/*.*)|(mdseinfo/*.*)|(artwork/*.*)|(create/*.*)|(merchant/*.*)))');

if (config.node_env === 'staging' || config.node_env === 'production') {
    app.post(client2c_regex_exempted, tokenvalidate.tokenvalidation);
}

/************************* Mgmt request needs to validate auth level ***********************/
let mgmtUserAuthLevelCheck = require('./middleware/mgmtUserAuthLevelCheck');
let mgmtUserAuthLevelCheck_regex_exempted = new RegExp('^/mgmt/(?!((auth/*.*)))');

app.post(mgmtUserAuthLevelCheck_regex_exempted, mgmtUserAuthLevelCheck.mgmtUserAuthLevelCheck);

/******************** Store API logs ******************/
let apiLog = require('./middleware/apiLog');

if (config.node_env === 'staging' || config.node_env === 'production') {
    app.post(client2c_regex_exempted, apiLog.apiLog);
}

/******************** Route control ******************/
let client2c_route = require('./routes/client2c');

app.all('/client2c/*', client2c_route);

/******************** Production error handler ******************/
// catch 404 and reponse with error message
app.use(function (req, res) {
    let error = new Error('Not Found');
    // avoid auto reboot for aws health check
    error.status = 200;
    res.status(error.status).send(error.message);
});

// catch 500 and reponse with error message
app.use(function (req, res) {
    res.status(500).send('Internal Server Error');
});

/******************** MySQL connection and disconnection ******************/
let mysqlDB = require('./db/mysqlDB');

mysqlDB.connect();
process.on('SIGINT', function () {
    mysqlDB.end(function (error) {
        if (error) {
            return console.log(error);
        }
        console.log('MySQL connections gracefully shutdown through process termination');
        process.exit(0);
    });
});

// /******************** Realtime queue service ******************/
// let email_processer = require('./queue/realtimeQueueHelper/emailSender');

// email_processer.startMailProcess();

module.exports = app;