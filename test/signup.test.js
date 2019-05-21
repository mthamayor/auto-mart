/**
 * Unit tests for the signup endpoint
 */

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockUser from './__mock__/mockUser';

chai.use(chaiHttp);

describe('Users endpoint test', () => {
  describe('route POST /api/v1/auth/signup', () => {
    it('should return 201 status & should create a user with correct params', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.validUser)
        .end((err, res) => {
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

          done();
        });
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
});
