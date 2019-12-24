"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var path = require("path");
var metrics_1 = require("./metrics");
var app = express();
var ejs = require('ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var port = process.env.PORT || '8080';
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.get('/hello/:name', function (req, res) {
    return res.render('hello.ejs', { name: req.params.name });
});
app.get('/hello', function (req, res) {
    return res.render('hello.ejs', { name: req.params.name });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
var session = require("express-session");
var levelSession = require("level-session-store");
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
var user_1 = require("./user");
var assert_1 = require("assert");
var dbUser = new user_1.UserHandler('./db/users');
var authRouter = express.Router();
var user1 = new user_1.User('sergei', 'sergei@h.dk', 'sergei', false);
dbUser.save(user1, function (err, result) {
    console.log(result);
});
var user1Metric1 = new metrics_1.Metric(user1.username, '1577232000000', 1);
var user1Metric2 = new metrics_1.Metric(user1.username, '1577318400000', 2);
var user1Metric3 = new metrics_1.Metric(user1.username, '1577404800000', 3);
var user1Metric4 = new metrics_1.Metric(user1.username, '1577491200000', 4);
var user1Metric5 = new metrics_1.Metric(user1.username, '1577664000000', 2);
var metricsUser = [];
metricsUser.push(user1Metric1);
metricsUser.push(user1Metric2);
metricsUser.push(user1Metric3);
metricsUser.push(user1Metric4);
metricsUser.push(user1Metric5);
dbMet.save(metricsUser, function (error, result) {
    console.log(result);
});
var user2 = new user_1.User('gregor', 'gregor@h.dk', 'gregor', false);
dbUser.save(user2, function (err, result) {
    console.log(result);
});
var user2Metric1 = new metrics_1.Metric(user2.username, '1577232000000', 1);
var user2Metric2 = new metrics_1.Metric(user2.username, '1577318400000', 2);
var user2Metric3 = new metrics_1.Metric(user2.username, '1577404800000', 3);
var user2Metric4 = new metrics_1.Metric(user2.username, '1577491200000', 4);
var user2Metric5 = new metrics_1.Metric(user2.username, '1577664000000', 2);
var metricsUser2 = [];
metricsUser2.push(user2Metric1);
metricsUser2.push(user2Metric2);
metricsUser2.push(user2Metric3);
metricsUser2.push(user2Metric4);
metricsUser2.push(user2Metric5);
dbMet.save(metricsUser2, function (error, result) {
    console.log(result);
});
authRouter.get('/login', function (req, res) {
    res.render('login', { emptyfields: "" });
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
app.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            res.render('login', { emptyfields: "Something went wrong try again please" });
        else if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            dbMet.getByUsername(req.session.user.username, function (err, result) {
                if (err)
                    throw err;
                req.session.user.metrics = result;
                console.log('req.session.user.metrics', req.session.user.metrics);
                console.log('req.session.user' + req.session.user);
                res.redirect('/');
            });
        }
    });
});
app.post('/signup', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            var user = new user_1.User(req.body.username, req.body.email, req.body.password, false);
            dbUser.save(user, function (err) {
                if (err)
                    next(err);
                else
                    res.redirect('login');
            });
        }
    });
});
app.use(authRouter);
var userRouter = express.Router();
app.use('/user', userRouter);
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
            // } else res.status(200).json(result)
        }
        else
            res.status(200).json(result);
    });
});
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    console.log('req.session.user.metrics:  ', req.session.user.metrics);
    res.render('index', {
        username: req.session.user.username,
        email: req.session.user.email,
        metrics: req.session.user.metrics
    });
});
app.post('/metrics', authCheck, function (req, res) {
    var toStringTimestamp;
    var valid = (new Date(req.body.timestamp)).getTime() > 0; // true
    console.log(valid);
    if (valid) {
        var timestamp = +new Date(req.body.timestamp);
        toStringTimestamp = timestamp.toString();
    }
    else {
        toStringTimestamp = req.body.timestamp;
    }
    var metric = new metrics_1.Metric(req.session.user.username, toStringTimestamp, req.body.value);
    var metricArray = [];
    metricArray.push(metric);
    dbMet.save(metricArray, function (err) {
        if (err)
            throw err;
        dbMet.getByUsername(req.session.user.username, function (err, result) {
            if (err)
                throw err;
            console.log(result);
            req.session.user.metrics = result;
            res.render('index', {
                username: req.session.user.username,
                email: req.session.user.email,
                metrics: req.session.user.metrics
            });
        });
    });
});
app.get('/metrics', authCheck, function (req, res) {
    dbMet.getByUsername(req.session.user.username, function (err, result) {
        if (err)
            throw err;
        res.status(200).send(result);
    });
});
app.delete('/metrics/:timestamp/:value', authCheck, function (req, res) {
    console.log('FROM SERVER', req.params.timestamp);
    console.log('FROM SERVER', req.params.value);
    dbMet.deleteById(req.session.user.username, req.params.timestamp, req.params.value, function (err, result) {
        if (err)
            throw err;
        dbMet.getByUsername(req.session.user.username, function (err, result) {
            if (err)
                throw err;
            console.log("After delete: ", result);
            req.session.user.metrics = result;
            res.status(200).send(assert_1.ok);
        });
    });
});
userRouter.get('/', authCheck, function (req, res, next) {
    dbUser.get(req.session.user.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
            // } else res.status(200).json(result)
        }
        else
            res.status(200).json(result);
    });
});
userRouter.post('/edit', authCheck, function (req, res, next) {
    console.log(req.body);
    var user = new user_1.User(req.body.username, req.body.email, req.body.password, false);
    console.log(user);
    dbUser.save(user, function (err) {
        if (err)
            next(err);
        dbUser.get(req.body.username, function (err, result) {
            if (err)
                next(err);
            if (result === undefined || !result.validatePassword(req.body.password)) {
                res.redirect('/login');
            }
            else {
                req.session.loggedIn = true;
                req.session.user = result;
                dbMet.getByUsername(req.session.user.username, function (err, result) {
                    if (err)
                        throw err;
                    req.session.user.metrics = result;
                    console.log('req.session.user.metrics', req.session.user.metrics);
                    console.log('req.session.user' + req.session.user);
                    res.render('index', {
                        username: req.session.user.username,
                        email: req.session.user.email,
                        metrics: req.session.user.metrics
                    });
                });
            }
        });
    });
});
userRouter.post('/delete', authCheck, function (req, res, next) {
    dbUser.delete(req.session.user.username, function (err, result) {
        delete req.session.loggedIn;
        delete req.session.user;
        res.redirect('/login');
    });
});
//# sourceMappingURL=server.js.map