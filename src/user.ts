import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { ok } from "assert"
var passwordHash = require('password-hash');


export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username
        this.email = email
       
        if (!passwordHashed) {
            this.setPassword(password)
            console.log('###############################');
        } else this.password = password
        console.log("I wanna know: ", this.getPassword());
    }

    static fromDb(username: string, value: any): User {
        console.log(username);
        console.log(value);
        const [password, email] = value.split(":")
        return new User(username, email, password)
    }

    public setPassword(toSet: string): void {
        console.log('toSet', toSet);
          this.password = passwordHash.generate(toSet);
          console.log(this.password);
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        return passwordHash.verify(toValidate, this.password)
    }
}


export class UserHandler {
    public db: any

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        console.log("Users:", username);
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            console.log('data*************', data);
            if (err) callback(err)
            else if (data === undefined) callback(null, data)
            else callback(null, User.fromDb(username, data))
        })
    }

    public save(user: User, callback: (err: Error | null) => void) {
    
        console.log('user', user);
        console.log('Password',user.getPassword())
        // this.db.put(`user:${user.username}`, `${user.getPassword}:${user.email}`, (err: Error | null) => {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }

    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
    }



    public getAll(callback: (error: Error | null, result: any | null) => void) {
        let user: User[] = []
    
        this.db.createReadStream()
          .on('data', function (data) {
            // console.log(data.key, '=', data.value)
            // callback(null, data);
            console.log(data);
            // let timestamp: string = data.key.split(':')[1]
            // let metric: Metric = new Metric(timestamp, data.value);
            // let metric: Metric = new Metric(data.key, data.value);
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
            callback(null, user);
            console.log('Stream ended')
          })
      }
    



    constructor(path: string) {
        this.db = LevelDB.open(path)
    }
}