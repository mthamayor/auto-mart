/**
 * Unit tests for the signup endpoint
 */

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockUser from './__mock__/mockUser';
import mockOrders from './__mock__/mockOrders';

chai.use(chaiHttp);

describe('Users auth endpoint test', () => {
  describe('route POST /api/v1/order', () => {
    // Create a new user and store the response
    let newUser;
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .send(mockUser.validUser2)
        .end((err, res) => {
          newUser = res.body.data;
          done();
        });
    });

    it('should raise 400 error with invalid or no buyer', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          carId: mockOrders.validCarId,
          priceOffered: mockOrders.validPriceOffered,
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
            'buyer id is undefined or invalid',
            'buyer id is undefined or invalid',
          );

          done();
        });
    });
    it('should raise 404 error with non existent buyer', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: mockOrders.nonExistingBuyer,
          carId: mockOrders.validCarId,
          priceOffered: mockOrders.validPriceOffered,
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
            'buyer does not exist',
            'buyer does not exist',
          );

          done();
        });
    });
    it('should raise 400 error with invalid or no car id', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: newUser.id,
          priceOffered: mockOrders.validPriceOffered,
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
            'car id is undefined or invalid',
            'car id is undefined or invalid',
          );

          done();
        });
    });
    it('should raise 400 error with invalid or no price', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: newUser.id,
          carId: mockOrders.validCarId,
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
            'price is undefined or invalid',
            'price is undefined or invalid',
          );

          done();
        });
    });
    it('should raise 404 error with non existing car ad', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: mockOrders.adCreatorId,
          carId: mockOrders.nonExistingAdId,
          priceOffered: mockOrders.validPriceOffered,
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
            'car not found',
            'car not found',
          );

          done();
        });
    });
    it('should raise 409 error with ad creator making purchase order', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: mockOrders.adCreatorId,
          carId: mockOrders.validCarId,
          priceOffered: mockOrders.validPriceOffered,
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          assert.strictEqual(
            res.body.status,
            409,
            'Status code should be 409',
          );
          assert.strictEqual(
            res.body.error,
            'you cannot create purchase order for ad you created',
            'you cannot create purchase order for ad you created',
          );

          done();
        });
    });
    it('should raise 201 with valid inputs', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: newUser.id,
          carId: mockOrders.validCarId,
          priceOffered: mockOrders.validPriceOffered,
        })
        .end((err, res) => {
          const { data, status } = res.body;

          expect(res).to.have.status(201);
          expect(data).to.have.property('id');
          expect(data).to.have.property('car_id');
          expect(data).to.have.property('created_on');
          expect(data).to.have.property('price_offered');

          assert.strictEqual(
            status,
            201,
            'Status code should be 201',
          );
          done();
        });
    });
    it('should raise 409 with valid duplicate purchase order', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          buyer: newUser.id,
          carId: mockOrders.validCarId,
          priceOffered: mockOrders.validPriceOffered,
        })
        .end((err, res) => {
          const { error, status } = res.body;

          expect(res).to.have.status(409);
          assert.strictEqual(status, 409, 'Status code should be 201');
          assert.strictEqual(
            error,
            'you already created a purchase order',
            'you already created a purchase order',
          );
          done();
        });
    });
  });
});
