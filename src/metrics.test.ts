import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { User, UserHandler } from './user'
import { LevelDB } from "./leveldb"


// const dbPath: string = 'db_test'
const dbPathMetrics: string = 'db/testmetrics'
const dbPathUser: string = 'db/testuser'
// const dbUser: UserHandler = new UserHandler('./db/users')
const dbUser: UserHandler = new UserHandler('./db/testuser')
// const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbMet: MetricsHandler = new MetricsHandler('./db/testmetrics')
// var dbUser: UserHandler 




describe('Metrics', function () {
  before(function () {
      try{
        LevelDB.clear(dbPathMetrics)
        LevelDB.clear(dbPathUser)
      }catch(err){
        
      }
    
    // dbMet = new MetricsHandler(dbPathMetrics)
    // dbUser = new MetricsHandler(dbPathUser)
  })

  after(function () {
    dbMet.db.close()
    dbUser.db.close()
  })

  describe('#Save', function () {
    it('Save new user', function (done) {
      this.timeout(10000);
      let user = new User("Mads", "Mads@hotmail.com", "Mads123", false);
      dbUser.save(user, function (err: Error | null, result?: string) {
        console.log('err',err);
        console.log("result", result);
        // expect(err).to.be.null
        // expect(result).to.not.be.string
        // expect(result).to.be.empty
        expect(result).to.be.string
        expect(result).to.be.a('string', 'ok');
        // expect(result).to.be.true
        done()
      })
    })
  })

describe('#get', function () {
    it('Get the user', function (done) {
      this.timeout(10000);
      var username = "Mads";
      dbUser.get(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.include.all.keys('username', 'password', 'email');
        expect({username: result?.username, email: result?.email}).to.deep.equal({username: 'Mads', email: 'Mads@hotmail.com'});
        done()
      })
    })
  })

  describe('#Edit user', function () {
    it('edit existing user', function (done) {
      this.timeout(10000);
      let user = new User("Balsam", "Balsam@hotmail.com", "Balsam", false);
      dbUser.save(user, function (err: Error | null, result?: string) {
        expect(result).to.be.string
        expect(result).to.be.a('string', 'ok');
        done()
      })
    })
  })

  describe('#get', function () {
    it('Get the user', function (done) {
      this.timeout(10000);
      var username = "Balsam";
      dbUser.get(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.include.all.keys('username', 'password', 'email');
        expect({username: result?.username, email: result?.email}).to.deep.equal({username: 'Balsam', email: 'Balsam@hotmail.com'});
        done()
      })
    })
  })


  describe('#Delete', function () {
    it('Delete user', function (done) {
      this.timeout(10000);
      var username = "Balsam";
      
      dbUser.delete(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.be.a('string', 'User ' + username +' deleted');
        done()
      })
    })
  })

  
// TODO: SKAL HENTE METRICS OG CHECKE IGEN EFTER GEM

  describe('#Save metrics', function () {
    it('should save a new metrics', function (done) {
      this.timeout(10000);
        let metric1 = new Metric("Mad", "	1576662571", 12);
        // let metric2 = new Metric("Mad", "	1576662572", 13);
        let metricArray = [] as any;
        metricArray.push(metric1)

        // metricArray.push(metric2)



        dbMet.save(metricArray, (err: Error | null, result?: Metric[]) => {
          this.timeout(10000);
                // expect(err).to.be.null
                expect(result).to.not.be.undefined
                // expect(result).to.be.empty
                expect(result).to.be.ok
                // expect(result).to.be.true

                // dbMet.getById(12,function (err: Error | null, result?: Metric[]) {
                //     //   console.log();
                //     // expect(err).to.be.null
                //     // expect(result).to.not.be.undefined
                //     // expect(result).to.be.empty
                //     // expect(result).to.be.true

                //     if(result)
                //     expect(result[0].value).to.equal(12)
                // })
                done()
        })
    })
  })
/*

  describe('#get', function () {
    it('Get by username', function (done) {
      this.timeout(10000);
      let username = "Mad";

      dbMet.getByUsername(username, function (err: Error | null, result?: Metric[]) {
        // expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
        // expect(result).to.eql([  ]);
        // expect(result).to.be.true
        done()
      })
    })
  })

  describe('#get', function () {
    it('Get all metrics', function (done) {
      this.timeout(10000);
      dbMet.getAll(function (err: Error | null, result?: Metric[]) {
        // expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
        // expect(result).to.eql([  ]);
        // expect(result).to.be.true
        done();
      })
    })
  })

  */

  
  
  
  
  
  
  
  
  
  // describe('#get', function () {
  //   it('Get all metrics', function (done) {
      
  //     dbMet.deleteById("Mad", "	1576662571", 12, function (err: Error | null, result?: Metric[]) {
  //       // expect(err).to.be.null
  //       expect(result).to.not.be.undefined
  //       expect(result).to.not.be.ok
  //       // expect(result).to.not.be.empty
  //       // expect(result).to.eql([  ]);
  //       // expect(result).to.be.true
  //       done()
  //     })
  //   })
  // })
  
  // describe('#get', function () {
  //   it('should get empty array on non existing group', function () {
  //     dbMet.getAll(function (err: Error | null, result?: Metric[]) {
  //       expect(err).to.be.null
  //       expect(result).to.not.be.undefined
  //       expect(result).to.be.empty
  //       // expect(result).to.be.true
  //     })
  //   })
  // })


  // describe('#get', function () {
  //   it('should get empty array on non existing group', function () {
  //     dbMet.getAll(function (err: Error | null, result?: Metric[]) {
  //       //   console.log();
  //       // expect(err).to.be.null
  //       // expect(result).to.not.be.undefined
  //       expect(result).to.be.empty
        
  //       // expect(result).to.be.true
  //     })
  //   })
  // })

  // describe('#post', function () {
  //   it('should save a new array in group', function () {

  //       var met: Metric[] = []
  //       met.push(new Metric('1235461', 12))

  //       dbMet.save('1', met, (err: Error | null, result?: Metric[]) => {
  //       // expect(err).to.be.null
  //               // expect(result).to.not.be.undefined
  //               // expect(result).to.be.empty
  //               // expect(result).to.be.true

  //               dbMet.getById(12,function (err: Error | null, result?: Metric[]) {
  //                   //   console.log();
  //                   // expect(err).to.be.null
  //                   // expect(result).to.not.be.undefined
  //                   // expect(result).to.be.empty
  //                   // expect(result).to.be.true

  //                   if(result)
  //                   expect(result[0].value).to.equal(12)
  //               })
  //       })
  //   })
  // })






})





// '#save' should save data

// '#save' should update existing data
// '#delete' should delete data
// '#delete' should not fail if data does not exist