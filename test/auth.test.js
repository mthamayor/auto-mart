/**
 * Unit tests for the signup endpoint
 */

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockUser from './__mock__/mockUser';
import { usersHelper } from '../server/api/models';

chai.use(chaiHttp);

describe('Users auth endpoint test', () => {
  let token;
  before(async () => {
    await usersHelper.removeAllUsers();
  });
  // Clean up db after all test suites
  after(async () => {
    await usersHelper.removeAllUsers();
  });
  describe('route POST /api/v1/auth/signup', () => {
    it('should return 201 status & should create a user with correct params', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.validUser);
      const { validUser } = mockUser;
      assert.strictEqual(
        res.body.data.first_name,
        validUser.firstName,
        'First name sent is correct',
      );
      assert.strictEqual(
        res.body.data.last_name,
        validUser.lastName,
        'Last name sent is correct',
      );
      assert.strictEqual(
        res.body.data.address,
        validUser.address,
        'Address sent is correct',
      );
      assert.strictEqual(
        res.body.data.email,
        validUser.email,
        'Email sent is correct',
      );

      expect(res).to.have.status(201);

      expect(res.body.data).to.have.property('token');
    });

    it('should raise 400 error with invalid or no password parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.invalidPasswordUser)
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'password is undefined or invalid',
            'password should be provided',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no address parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.invalidAddressUser)
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'address is undefined or invalid',
            'valid address should be provided',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no first name parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.invalidFirstnameUser)
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'first name is undefined or invalid',
            'valid first name should be provided',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no last name parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.invalidLastnameUser)
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'last name is undefined or invalid',
            'valid last name should be provided',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no email parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.invalidEmailUser)
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'email is undefined or invalid',
            'valid email should be provided',
          );

          done();
        });
    });

    it('should raise 409 error with duplicate user', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.validUser)
        .end((err, res) => {
          expect(res).to.have.status(409);

          assert.strictEqual(
            res.body.status,
            409,
            'Status code should be 409',
          );
          assert.strictEqual(
            res.body.error,
            'user already exists',
            'provide user with another email',
          );

          done();
        });
    });
  });

  // signin test
  describe('route POST /api/v1/auth/signin', () => {
    it('should return 200 status & should return a user', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });
      const { validUser } = mockUser;
      assert.strictEqual(
        res.body.data.first_name,
        validUser.firstName,
        'First name returned is correct',
      );
      assert.strictEqual(
        res.body.data.last_name,
        validUser.lastName,
        'Last name returned is correct',
      );
      assert.strictEqual(
        res.body.data.address,
        validUser.address,
        'Address returned is correct',
      );
      assert.strictEqual(
        res.body.data.email,
        validUser.email,
        'Email returned is correct',
      );

      expect(res).to.have.status(200);

      expect(res.body.data).to.have.property('token');
    });

    it('should raise 400 error with no password parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: mockUser.email,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'password is undefined',
            'password should be provided',
          );

          done();
        });
    });

    it('should raise 401 error with a wrong password parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: mockUser.email,
          password: mockUser.fakeUserPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);

          assert.strictEqual(
            res.body.status,
            401,
            'Status code should be 401',
          );
          assert.strictEqual(
            res.body.error,
            'invalid login credentials',
            'valid password should be provided',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no email parameter', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          password: mockUser.password,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'email is undefined or invalid',
            'valid email should be provided',
          );

          done();
        });
    });

    it('should raise 404 error when user does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .type('form')
        .send(
          {
            email: mockUser.fakeUserEmail,
            password: mockUser.password,
          },
        )
        .end((err, res) => {
          expect(res).to.have.status(404);

          assert.strictEqual(
            res.body.status,
            404,
            'Status code should be 404',
          );
          assert.strictEqual(
            res.body.error,
            'user does not exist',
            'provide an existing user',
          );

          done();
        });
    });
  });

  // forgot password test
  describe('route POST /api/v1/auth/forgot', () => {
    it('should return 200 status & should return a user', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/forgot')
        .type('form')
        .send({
          email: mockUser.email,
        });
      const { data } = res.body;
      ({ token } = data);
      expect(res).to.have.status(200);
      expect(data).to.have.property('token');
    });

    it('should raise 400 error with invalid email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgot')
        .type('form')
        .send({
          email: 'ann',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'email is invalid',
            'email is invalid',
          );

          done();
        });
    });
    it('should raise 404 error with user not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgot')
        .type('form')
        .send({
          email: 'toluanimashaun@gmail.com',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);

          assert.strictEqual(
            res.body.status,
            404,
            'Status code should be 404',
          );
          assert.strictEqual(
            res.body.error,
            'user not found',
            'user not found',
          );

          done();
        });
    });
  });
  // password reset test
  describe('route POST /api/v1/auth/reset', () => {
    it('should raise 400 error with undefined password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/reset')
        .type('form')
        .send({
          token,
          newPassword: '',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'new password is undefined',
            'new password is undefined',
          );
          done();
        });
    });

    it('should raise 400 error with invalid password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/reset')
        .type('form')
        .send({
          token,
          newPassword: '$hAMSD*',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'password is not valid',
            'password is not valid',
          );

          done();
        });
    });
    it('should raise 400 error with invalid token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/reset')
        .type('form')
        .send({
          token: 'lafdjsoje1234',
          newPassword: 'MTHA.3OSLDS',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'invalid password reset token provided',
            'invalid password reset token provided',
          );

          done();
        });
    });
    it('should return 200 status when password is successfully changed', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/reset')
        .type('form')
        .send({
          token,
          newPassword: 'ANIMASHAUN321',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { status, data } = res.body;
      assert.strictEqual(
        status,
        200,
        'Expected status to be 200',
      );
      assert.strictEqual(
        data,
        'Password successfully changed',
        'Expected password to be successfully changed',
      );
    });
  });
});
