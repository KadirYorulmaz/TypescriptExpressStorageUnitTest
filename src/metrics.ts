
import WriteStream from 'level-ws'
import { LevelDB } from './leveldb';
import { read, ReadStream } from 'fs';
import { ok } from 'assert';

export class Metric {
  public username: string
  public timestamp: string
  public value: number


  constructor(u: string, ts: string, v: number, ) {
    this.username = u
    this.timestamp = ts
    this.value = v
   
  }

  static fromDb(username: string, values: any): Metric {
    console.log('values fromDb: ', values);
    const [timestamp, value] = values.split(":")
    console.log([username, value]);
    return new Metric(username, timestamp, value)
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

  public save(key: any, metrics: Metric[], callback: (error: Error | null, result: any | null) => void) {
    metrics.forEach((m: Metric) => {
      this.db.put(`${m.username}:${m.timestamp}`, `${m.value}`, (err: Error | null, result: any | null) => {
        console.log("HEllo JUST PUT");
        callback(err, ok)
       })
      // stream.write({ key: `metric:${key}:${m.timestamp}`, username: m.username, value: m.value })
    })
    // stream.end()
  }


  public getAll(callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []

    this.db.createReadStream()
      .on('data', function (data) {
        // console.log(data.key, '=', data.value)
        // callback(null, data);
        console.log('data',data);

        // let username: string = data.key.split(':')[1]
        // let metric: Metric = new Metric(username, data.timestamp, data.value);

        
        // let metric: Metric = new Metric(data.key, data.value);
        // metrics.push(Metric.fromDb(username, data))
        // metrics.push(metric)
        // console.log(metrics);
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
        // callback(null, metrics);
        callback(null, null);
        console.log('Stream ended')
      })
  }

  public getByUsername(username: any, callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []

    this.db.createReadStream()
      .on('data', function (data) {

        if (data.key.split(':')[0] === username) {
          let username: string = data.key.split(':')[0];
          let timestamp: string = data.key.split(':')[1];
          let metric: Metric = new Metric(username, timestamp, data.value);
          metrics.push(metric)

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


  public deleteById(username: number, timestamp: any, value: any, callback: (error: Error | null, result: any | null) => void) {
     
    this.db.del(username+':'+timestamp, (err: Error | null) => {
        callback(err, ok)
      });

  }

}
