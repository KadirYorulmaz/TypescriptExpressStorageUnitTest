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
        } else this.password = password
    }

    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":")
        console.log([password, email]);
        return new User(username, email, password, true)
    }

    public setPassword(toSet: string): void {
          console.log('toSet', toSet);
          this.password = passwordHash.generate(toSet);
          console.log('Generated password: ', this.password);
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        let validate = passwordHash.verify(toValidate, this.password);
        console.log('validate: ', validate, toValidate, this.password);
        return validate
    }
}


export class UserHandler {
    public db: any
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err)
            else if (data === undefined) callback(null, data)
            else callback(null, User.fromDb(username, data))
        })
    }

    public save(user: User, callback: (err: Error | null, result?: any) => void) {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null, result?: any) => {
            callback(err, 'ok')
        })
    }

    public delete(username: string, callback: (err: Error | null, result?: any) => void) {
        this.db.del(`user:${username}`, (err: Error | null) => {
            callback(err, 'User ' + username +' deleted')
          });
    }



    public getAll(callback: (error: Error | null, result: any | null) => void) {
        let user: User[] = []
    
        this.db.createReadStream()
          .on('data', function (data) {
            console.log(data);
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