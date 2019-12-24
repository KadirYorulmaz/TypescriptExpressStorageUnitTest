import express = require('express');
import bodyparser = require('body-parser');
import path = require('path');
import { MetricsHandler, Metric } from './metrics';
const app = express()

let ejs = require('ejs');
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


const port: string = process.env.PORT || '8080'
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.get('/hello/:name', (req, res) =>
  res.render('hello.ejs', { name: req.params.name })
)

app.get('/hello', (req, res) =>
  res.render('hello.ejs', { name: req.params.name })
)

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})


import session = require('express-session')
import levelSession = require('level-session-store')

const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

import { UserHandler, User } from './user'
import { ok } from 'assert';
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()


let user1 = new User('sergei', 'sergei@h.dk', 'sergei', false);
dbUser.save(user1, (err: Error | null, result?: any) => {
  console.log(result);
})
// TODO : DATE SKAL VÆRE TIMESTAMP
let user1Metric1 = new Metric(user1.username, '1577232000000', 1);
let user1Metric2 = new Metric(user1.username, '1577318400000', 2);
let user1Metric3 = new Metric(user1.username, '1577404800000', 3);
let user1Metric4 = new Metric(user1.username, '1577491200000', 4);
let user1Metric5 = new Metric(user1.username, '1577664000000', 2);


let metricsUser: Metric[] = []

metricsUser.push(user1Metric1);
metricsUser.push(user1Metric2);
metricsUser.push(user1Metric3);
metricsUser.push(user1Metric4);
metricsUser.push(user1Metric5);


dbMet.save(metricsUser, (error: Error | null, result: any) => {
  console.log(result);
})



let user2 = new User('gregor', 'gregor@h.dk', 'gregor', false);
dbUser.save(user2, (err: Error | null, result?: any) => {
  console.log(result);
})
// TODO : DATE SKAL VÆRE TIMESTAMP
let user2Metric1 = new Metric(user2.username, '1577232000000', 1);
let user2Metric2 = new Metric(user2.username, '1577318400000', 2);
let user2Metric3 = new Metric(user2.username, '1577404800000', 3);
let user2Metric4 = new Metric(user2.username, '1577491200000', 4);
let user2Metric5 = new Metric(user2.username, '1577664000000', 2);


let metricsUser2: Metric[] = []

metricsUser2.push(user2Metric1);
metricsUser2.push(user2Metric2);
metricsUser2.push(user2Metric3);
metricsUser2.push(user2Metric4);
metricsUser2.push(user2Metric5);

dbMet.save(metricsUser2, (error: Error | null, result: any) => {
  console.log(result);
})




authRouter.get('/login', (req: any, res: any) => {
  res.render('login', { emptyfields: "" })
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})


app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) res.render('login', { emptyfields: "Something went wrong try again please" })
    else if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result

      dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
        if (err) throw err
        req.session.user.metrics = result
        console.log('req.session.user.metrics', req.session.user.metrics);
        console.log('req.session.user' + req.session.user);
        res.redirect('/')
      })
    }
  })
})


app.post('/signup', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      let user = new User(req.body.username, req.body.email, req.body.password, false);

      dbUser.save(user, function (err: Error | null) {
        if (err) next(err)
        else res.redirect('login');
      })
    }
  })
})


app.use(authRouter)

const userRouter = express.Router()
app.use('/user', userRouter)

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
      // } else res.status(200).json(result)
    } else res.status(200).json(result)
  })
})

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  console.log('req.session.user.metrics:  ', req.session.user.metrics);
  res.render('index', {
    username: req.session.user.username,
    email: req.session.user.email,
    metrics: req.session.user.metrics
  })
})


app.post('/metrics', authCheck, (req: any, res: any) => {
  let toStringTimestamp;

  var valid = (new Date(req.body.timestamp)).getTime() > 0; // true
  console.log(valid);

  if (valid) {
    let timestamp = +new Date(req.body.timestamp);
    toStringTimestamp = timestamp.toString();
  } else {
    toStringTimestamp = req.body.timestamp;
  }


  let metric = new Metric(req.session.user.username, toStringTimestamp, req.body.value);
  let metricArray = [] as any;
  metricArray.push(metric)
  dbMet.save(metricArray, (err: Error | null) => {
    if (err) throw err

    dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
      if (err) throw err
      console.log(result);
      req.session.user.metrics = result

      res.render('index', {
        username: req.session.user.username,
        email: req.session.user.email,
        metrics: req.session.user.metrics
      })
    })
  })
})

app.get('/metrics', authCheck, (req: any, res: any) => {
  dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
    if (err) throw err
    res.status(200).send(result)
  })
})

app.delete('/metrics/:timestamp/:value', authCheck, (req: any, res: any) => {
  console.log('FROM SERVER', req.params.timestamp);
  console.log('FROM SERVER', req.params.value);
  dbMet.deleteById(req.session.user.username, req.params.timestamp, req.params.value, (err: Error | null, result: any) => {
    if (err) throw err
    dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
      if (err) throw err
      console.log("After delete: ", result);
      req.session.user.metrics = result
      res.status(200).send(ok)
    })
  })
})

userRouter.get('/', authCheck, (req: any, res: any, next: any) => {
  dbUser.get(req.session.user.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
      // } else res.status(200).json(result)
    } else res.status(200).json(result)
  })
})


userRouter.post('/edit', authCheck, (req: any, res: any, next: any) => {
  console.log(req.body);
  let user = new User(req.body.username, req.body.email, req.body.password, false);
  console.log(user);
  dbUser.save(user, function (err: Error | null) {
    if (err) next(err)

    dbUser.get(req.body.username, (err: Error | null, result?: User) => {
      if (err) next(err)
      if (result === undefined || !result.validatePassword(req.body.password)) {
        res.redirect('/login')
      } else {

        req.session.loggedIn = true
        req.session.user = result

        dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
          if (err) throw err

          req.session.user.metrics = result
          console.log('req.session.user.metrics', req.session.user.metrics);
          console.log('req.session.user' + req.session.user);
          res.render('index', {
            username: req.session.user.username,
            email: req.session.user.email,
            metrics: req.session.user.metrics
          })
        })
      }
    })
  })
})

userRouter.post('/delete', authCheck, (req: any, res: any, next: any) => {
  dbUser.delete(req.session.user.username, function (err: Error | null, result?: User) {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/login')
  })
})