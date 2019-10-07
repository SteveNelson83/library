const User = require('../src/models/user.js');
const chai = require('chai');

describe('/users', () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });

  describe('POST /users', () => {
    it('creates a new user in the database', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          forename: 'Bobby',
          surname: 'Davro',
          email: 'bobbyd69@bobbys.com',
          password: 'iambobby69',
        })
        .end((error, res) => {
          expect(error).to.equal(null);
          expect(res.status).to.equal(201);

          User.findById(res.body._id, (err, user) => {
            expect(err).to.equal(null);
            expect(user.forename).to.equal('Bobby');
            expect(user.surname).to.equal('Davro');
            expect(user.email).to.equal('bobbyd69@bobbys.com');
            expect(res.body).not.to.have.property('password');
            done();
          });
        });
    });
    it('API validates email address', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          forename: 'Bobby',
          surname: 'Davro',
          email: 'bobbyd',
          password: 'iambobby69',
        })
        .end((error, res) => {
          expect(res.body.errors.email).to.equal('Invalid email address');
          expect(res.status).to.equal(400);

          User.countDocuments({}, (error, count) => {
            expect(count).to.equal(0);
          });
          done();
        });
    });
    it('API validates password', (done) => {
      chai.request(server)
        .post('/users')
        .send({
          forename: 'Bobby',
          surname: 'Davro',
          email: 'bobbyd69@bobby.com',
          password: 'bobby',
        })
        .end((error, res) => {
          console.log(res.body);
          expect(res.body.errors.password).to.equal('Password must be at least 8 characters long');
          expect(res.status).to.equal(400);

          User.countDocuments({}, (error, count) => {
            expect(count).to.equal(0);
          });
          done();
        });
    })
  });
});
