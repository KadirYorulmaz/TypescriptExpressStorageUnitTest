import express = require('express')
const app = express()
import bodyparser = require('body-parser'); 


let ejs = require('ejs');
import path = require('path');
app.use(express.static(path.join(__dirname, '/public')))
// import metrics = require('./metrics.js');
import {MetricsHandler} from './metrics';

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));


const port: string = process.env.PORT || '8080'

// app.get('/metrics.json', (req, res) => {
  
    // MetricsHandler.get((err, data)=>{
    //     if(err) throw err
    //     res.status(200).json(data)
    // });
  // })

  const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

  app.post('/metrics/:id', (req: any, res: any) => {
    // console.log('hello', req);
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
      if (err) throw err
      res.status(200).send('OK')
    })
  })

  app.get('/metrics/:id', (req: any, res: any) => {
    // console.log('hello', req);
    dbMet.getById(req.params.id, (err: Error | null, result: any) => {
      if (err) throw err
      // console.log(result);
      res.status(200).send(result)
    })
  })

  app.get('/metrics/', (req: any, res: any) => {

    dbMet.getAll((err: Error | null, result: any) => {
      if (err) throw err
      console.log(result);
      res.status(200).send(result)
    })

  })

  app.delete('/metrics/:id', (req: any, res: any) => {
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
   

    dbMet.deleteById(req.params.id, (err: Error | null, result: any) => {
      if (err) throw err
      console.log(result);
      res.status(200).send(result)
    })

  })

  // app.get('/metrics/:id', (req: any, res: any) => {
  //   dbMet.getAll((err: Error | null, result: any) => {
  //     if (err) throw err
  //     res.status(200).send()
  //   })
  // })

  app.get('/hello/:name', (req, res) => 
    res.render('hello.ejs', {name: req.params.name})
  )


  // app.get('/', (req: any, res: any) => {
//   res.write('Hello world')
//   res.end()
// })

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