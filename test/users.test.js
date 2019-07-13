/**
 * Unit tests for the Users endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { usersHelper, carsHelper, flagsHelper } from '../server/api/models';
import mockUser from './__mock__/mockUser';

chai.use(chaiHttp);

describe('Users Reset Password endpoint test', () => {
  // create two users
  let user1;

  before(async () => {
    await usersHelper.removeAllUsers();
    // create user
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser);
    user1 = res.body.data;
  });
  after(async () => {
    await usersHelper.removeAllUsers();
    await carsHelper.clearCars();
    await flagsHelper.clearFlags();
  });

  describe('Flag POST api/v1/users/:email/reset_password without form body', () => {
    it('should raise 400 if email is invalid or undefined', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/anifowose tobi @gmail.com/reset_password')
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 400, 'Status should be 400');
          assert.strictEqual(
            error,
            'email is undefined or invalid',
            'email is undefined or invalid',
          );
          done();
        });
    });

    it('should raise 404 if user does not exist', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${mockUser.validUser2.email}/reset_password`)
        .type('form')
        .send();
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      const { error, status } = res.body;
      assert.strictEqual(status, 404, 'Status should be 404');
      assert.strictEqual(error, 'user not found', 'user not found');
    });

    it('should raise 204 if password was successfully changed', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send();
      expect(res).to.have.status(204);
    });
  });

  describe('Flag POST api/v1/users/:email/reset_password with form body', () => {
    before(async () => {
      await usersHelper.removeAllUsers();
      // create user
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.validUser);
      user1 = res.body.data;
    });
    it('should raise 400 if password undefined', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send({
          password: '',
          new_password: 'MTHA.2JLSDF',
        });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');

      const { error, status } = res.body;
      assert.strictEqual(status, 400, 'Status should be 400');
      assert.strictEqual(
        error,
        'password is undefined',
        'password is undefined',
      );
    });

    it('should raise 403 if password does not match', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send({
          password: 'KHADS9_DSFJ',
          new_password: 'MTHA.049382',
        });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');

      const { error, status } = res.body;
      assert.strictEqual(status, 403, 'Status should be 403');
      assert.strictEqual(
        error,
        'invalid password provided',
        'invalid password provided',
      );
    });

    it('should raise 400 if new password is undefined', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send({
          password: `${mockUser.validUser.password}`,
          new_password: '',
        });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');

      const { error, status } = res.body;
      assert.strictEqual(status, 400, 'Status should be 400');
      assert.strictEqual(
        error,
        'new password is undefined',
        'new password is undefined',
      );
    });

    it('should raise 400 if new password is invalid', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send({
          password: `${mockUser.validUser.password}`,
          new_password: 'ds fa',
        });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');

      const { error, status } = res.body;
      assert.strictEqual(status, 400, 'Status should be 400');
      assert.strictEqual(
        error,
        'new password is not valid',
        'new password not valid',
      );
    });

    it('should raise 204 if password was successfully changed', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/users/${user1.email}/reset_password`)
        .type('form')
        .send({
          password: mockUser.validUser.password,
          new_password: 'REBEL_123245',
        });
      expect(res).to.have.status(204);
    });
  });
});
