import express = require('express');
import bodyparser = require('body-parser');
import path = require('path');
import { MetricsHandler, Metric } from './metrics';
const app = express()

let ejs = require('ejs');
app.use(express.static(path.join(__dirname, '/public')))
// import metrics = require('./metrics.js');
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


const port: string = process.env.PORT || '8080'
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

// app.get('/metrics.json', (req, res) => {

// MetricsHandler.get((err, data)=>{
//     if(err) throw err
//     res.status(200).json(data)
// });
// })


// app.post('/metrics/:id', authCheck, (req: any, res: any) => {
//   // console.log('hello', req);
//   console.log('req.body', req.body);
//   console.log(req.session);
//   console.log(req.session.username);
//   let metric = new Metric(req.body.timestamp, req.body.value,  req.session.username);
//   let metricArray = [] as any;
//   metricArray.push(metric)
//   dbMet.save(req.params.id, metricArray, (err: Error | null) => {
//   // dbMet.save(req.params.id, req.body, (err: Error | null) => {
//     if (err) throw err
//     res.status(200).send('OK')
//   })
// })


// app.get('/metrics/', (req: any, res: any) => {

//   dbMet.getAll((err: Error | null, result: any) => {
//     if (err) throw err
//     console.log(result);
//     res.status(200).send(result)
//   })

// })

app.delete('/metrics/:id', (req: any, res: any) => {

  dbMet.deleteById(req.params.id, (err: Error | null, result: any) => {
    if (err) throw err
    console.log(result);
    res.status(200).send(result)
  })

})

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




// https://inspector.swagger.io/builder
// https://ejs.co/
// https://github.com/adaltas/ece-nodejs/tree/2019-fall-5-modules
// https://www.gatsbyjs.org/
// https://blog.bitsrc.io/benchmarking-angular-react-and-vue-for-small-web-applications-e3cbd62d6565


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

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
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
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {

      req.session.loggedIn = true
      req.session.user = result

      dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
        if (err) throw err
        // console.log(result);
        // res.status(200).send(result)
        req.session.user.metrics = result
        console.log('req.session.user.metrics',req.session.user.metrics);
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
        else res.status(201).send("user persisted")
      })
    }
  })
})


app.use(authRouter)

const userRouter = express.Router()
app.use('/user', userRouter)

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } else {
      let user = new User(req.body.username, req.body.email, req.body.password, false);
      dbUser.save(req.body, function (err: Error | null) {

        if (err) next(err)

        else res.status(201).send("user persisted")
      })
    }
  })
})

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
  console.log('req.session.user.metrics:  ',req.session.user.metrics);
  res.render('index', {
    username: req.session.user.username,
    email: req.session.user.email,
    metrics : req.session.user.metrics 
  })
})


app.post('/metrics/:id', authCheck, (req: any, res: any) => {
  // console.log('hello', req);
  console.log('req.body', req.body);
  console.log(req.session);
  console.log('req.session.user.username', req.session.user.username);
  let metric = new Metric(req.session.user.username, req.body.timestamp, req.body.value);
  let metricArray = [] as any;
  metricArray.push(metric)
  dbMet.save(req.params.id, metricArray, (err: Error | null) => {
    // dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('OK')
  })
})

app.get('/metrics', authCheck, (req: any, res: any) => {
  // console.log('hello', req);
  dbMet.getByUsername(req.session.user.username, (err: Error | null, result: any) => {
    if (err) throw err
    // console.log(result);
    res.status(200).send(result)
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

// https://d3js.org/