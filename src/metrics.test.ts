import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { User, UserHandler } from './user'
import { LevelDB } from "./leveldb"

const dbPathMetrics: string = 'db/testmetrics'
const dbPathUser: string = 'db/testuser'
const dbUser: UserHandler = new UserHandler('./db/testuser')
const dbMet: MetricsHandler = new MetricsHandler('./db/testmetrics')


describe('Metrics', function () {
  before(function () {
    try {
      LevelDB.clear(dbPathMetrics)
      LevelDB.clear(dbPathUser)
    } catch (err) {
    }
  })

  after(function () {
    dbMet.db.close()
    dbUser.db.close()
  })

  describe('#Save user', function () {
    it('Save new user', function (done) {
      // this.timeout(10000);
      let user = new User("Mads", "Mads@hotmail.com", "Mads123", false);
      dbUser.save(user, function (err: Error | null, result?: string) {
        console.log('err', err);
        console.log("result", result);
        expect(result).to.be.string
        expect(result).to.be.a('string', 'ok');
        done()
      })
    }).timeout(500);
  })

  describe('#Get user', function () {
    it('Get the created user', function (done) {
      // this.timeout(10000);
      var username = "Mads";
      dbUser.get(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.include.all.keys('username', 'password', 'email');
        expect({ username: result?.username, email: result?.email }).to.deep.equal({ username: 'Mads', email: 'Mads@hotmail.com' });
        done()
      })
    }).timeout(500);
  })

  describe('#Edit user', function () {
    it('Edit existing user', function (done) {
      // this.timeout(10000);
      let user = new User("Balsam", "Balsam@hotmail.com", "Balsam", false);
      dbUser.save(user, function (err: Error | null, result?: string) {
        expect(result).to.be.string
        expect(result).to.be.a('string', 'ok');
        done()
      })
    }).timeout(500);
  })

  describe('#Get the edited user', function () {
    it('Get the user', function (done) {
      // this.timeout(10000);
      var username = "Balsam";
      dbUser.get(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.include.all.keys('username', 'password', 'email');
        expect({ username: result?.username, email: result?.email }).to.deep.equal({ username: 'Balsam', email: 'Balsam@hotmail.com' });
        done()
      })
    }).timeout(500);
  })

  describe('#Delete user', function () {
    it('Delete user', function (done) {
      // this.timeout(10000);
      var username = "Balsam";

      dbUser.delete(username, function (err: Error | null, result?: User) {
        expect(result).to.not.be.undefined
        expect(result).to.be.a('string', 'User ' + username + ' deleted');
        done()
      })
    }).timeout(500);
  })

  describe('#Save metrics', function () {
    it('Should save a new metrics', function (done) {
      // this.timeout(10000);
      let metric1 = new Metric("Mad", "	1576662571", 12);
      let metricArray = [] as any;
      metricArray.push(metric1)

      dbMet.save(metricArray, (err: Error | null, result?: Metric[]) => {
        expect(result).to.not.be.undefined
        expect(result).to.be.ok
        done()
      })
    }).timeout(500);
  })


  describe('#Get users metric', function () {
    it('Get metric by username', function (done) {
      // this.timeout(10000);
      let username = "Mad";

      dbMet.getByUsername(username, function (err: Error | null, result?: Metric[]) {
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
        expect(result).to.have.deep.members([{ username: 'Mad', timestamp: '\t1576662571', value: '12' }]);
        done()
      })
    }).timeout(500);
  })

  describe('#Delete metric', function () {
    it('Delete users metric by username and timestamp', function (done) {
      // this.timeout(10000);
      let username = "Mad";
      let timestamp = "\t1576662571";
      let value = "";
      dbMet.deleteById(username, timestamp, value, function (err: Error | null, result?: Metric[]) {
        expect(result).to.not.be.undefined
        expect(result).to.be.ok
        done()
      })
    }).timeout(500);
  })

})