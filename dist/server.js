"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var ejs = require('ejs');
var path = require("path");
app.use(express.static(path.join(__dirname, '/public')));
// import metrics = require('./metrics.js');
var metrics_1 = require("./metrics");
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var port = process.env.PORT || '8080';
// app.get('/metrics.json', (req, res) => {
// MetricsHandler.get((err, data)=>{
//     if(err) throw err
//     res.status(200).json(data)
// });
// })
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.post('/metrics/:id', function (req, res) {
    // console.log('hello', req);
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send('OK');
    });
});
app.get('/metrics/:id', function (req, res) {
    // console.log('hello', req);
    dbMet.getById(req.params.id, function (err, result) {
        if (err)
            throw err;
        // console.log(result);
        res.status(200).send(result);
    });
});
app.get('/metrics/', function (req, res) {
    dbMet.getAll(function (err, result) {
        if (err)
            throw err;
        console.log(result);
        res.status(200).send(result);
    });
});
app.delete('/metrics/:id', function (req, res) {
    // let receivedMetric;
    //  async () =>{
    //   await dbMet.getById(req.params.id, (err: Error | null, result: any) =>{
    //     console.log("Hello1");
    //     receivedMetric = result;
    //     console.log("Hello2");
    //     console.log(receivedMetric);
    //     console.log("Hello3");
    //   })
    //  }
    dbMet.deleteById(req.params.id, function (err, result) {
        if (err)
            throw err;
        console.log(result);
        res.status(200).send(result);
    });
});
// app.get('/metrics/:id', (req: any, res: any) => {
//   dbMet.getAll((err: Error | null, result: any) => {
//     if (err) throw err
//     res.status(200).send()
//   })
// })
app.get('/hello/:name', function (req, res) {
    return res.render('hello.ejs', { name: req.params.name });
});
// app.get('/', (req: any, res: any) => {
//   res.write('Hello world')
//   res.end()
// })
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
// https://inspector.swagger.io/builder
// https://ejs.co/
// https://github.com/adaltas/ece-nodejs/tree/2019-fall-5-modules
// https://www.gatsbyjs.org/
// https://blog.bitsrc.io/benchmarking-angular-react-and-vue-for-small-web-applications-e3cbd62d6565
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
var dbUser = new user_1.UserHandler('./db/users');
var authRouter = express.Router();
authRouter.get('/login', function (req, res) {
    res.render('login');
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
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
app.use(authRouter);
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
// app.use('/user', userRouter)
// })
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.username });
});
// https://d3js.org/
