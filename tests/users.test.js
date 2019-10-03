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
            // eslint-disable-next-line no-console
            console.log(res.body);
            expect(err).to.equal(null);
            expect(user.forename).to.equal('Bobby');
            expect(user.surname).to.equal('Davro');
            expect(user.email).to.equal('bobbyd69@bobbys.com');
            expect(res.body).not.to.have.property('password');
            done();
          });
        });
    });
  });
});
