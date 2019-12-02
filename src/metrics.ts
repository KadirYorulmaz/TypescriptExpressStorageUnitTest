
import WriteStream from 'level-ws'
import { LevelDB } from './leveldb';
import { read, ReadStream } from 'fs';

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

//   export class MetricsHandler {
//     static get(callback: (error: Error | null, result?: Metric[]) => void) {
//       const result = [
//         new Metric('2013-11-04 14:00 UTC', 12),
//         new Metric('2013-11-04 14:30 UTC', 15)
//       ]
//       callback(null, result)
//     }
//   }

export class MetricsHandler {
  public db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    console.log('key: ',key);
    // console.log('Metrics: ',metrics);
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }


  public getAll(callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []

    this.db.createReadStream()
      .on('data', function (data) {
        // console.log(data.key, '=', data.value)
        // callback(null, data);

        let timestamp: string = data.key.split(':')[1]
        let metric: Metric = new Metric(timestamp, data.value);
        // let metric: Metric = new Metric(data.key, data.value);
        metrics.push(metric)
        // metrics.push(data)
      })
      .on('error', function (err) {
        callback(err, null);
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics);
        console.log('Stream ended')
      })
  }

  public getById(key: any, callback: (error: Error | null, result: any | null) => void) {
    

    
    let metrics: Metric[] = []

    this.db.createReadStream()
      .on('data', function (data) {
        console.log(key);
        console.log(data.value);
        if (data.value === key) {
          let timestamp: string = data.key.split(':')[1]
          let metric: Metric = new Metric(timestamp, data.value);
          // let metric: Metric = new Metric(data.key, data.value);
          console.log(metric);
          console.log(data.key);
          metrics.push(metric)
          // metrics.push(data)
        }
      })
      .on('error', function (err) {
        callback(err, null);
        console.log('Oh my!', err)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics);
        console.log('Stream ended')
      })
  }


  public deleteById(key: number, callback: (error: Error | null, result: any | null) => void) {
        // console.log('m: ',metrics);

      var ws = WriteStream(this.db)
      // console.log(ws);
      ws.on('error', function (err) {
        console.log('Oh my!', err)
      })
      ws.on('close', function () {
        console.log('Stream closed')
      })
      
      ws.write({ type: 'del', key: 'Metric { timestamp: 1, value: 85 }'})

      // key: `metric:${key}:${m.timestamp}`, value: m.value }

      // ws.write({ type: 'del', key: ourKey })
      // metrics.forEach((m: Metric) => {
      //   console.log('m: ',metrics);
      //   ws.write({ type: 'del', key: '10'})
      
      //   // stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
      // })

      
      ws.on('end', function () {
        console.log('Stream closed2')
         callback(null, null);
      })
  

      this.db.del('metrics', function(err){
         console.log("Hello"); 
      })
  }

}