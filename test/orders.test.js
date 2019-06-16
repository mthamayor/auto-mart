/**
 * Unit tests for the signup endpoint
 */

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockUser from './__mock__/mockUser';
import mockOrders from './__mock__/mockOrders';
import { usersHelper, carsHelper } from '../server/api/models';
import mockCars from './__mock__/mockCars';

chai.use(chaiHttp);

describe('Users order endpoint test', () => {
  let user1;
  let user2;
  let carCreated;
  let carCreated2;
  // create multiple users
  before(async () => {
    await carsHelper.clearCars();
    await usersHelper.removeAllUsers();

    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser);
    user1 = res.body.data;
  });
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser2);
    user2 = res.body.data;
  });
  before(async () => {
    // user 1 creates an ad
    const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;
    const res = await chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('owner', user1.id)
      .field('state', mockCars.validState)
      .field('price', mockCars.validPrice)
      .field('model', mockCars.validModel)
      .field('manufacturer', mockCars.validManufacturer)
      .field('bodyType', mockCars.validBodyType)
      .field('name', mockCars.validName)
      .field('email', user1.email);
    carCreated = res.body.data;
  });

  // create a sold advert
  before(async () => {
    // user 1 creates second advert
    const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;
    const res = await chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('owner', user1.id)
      .field('state', mockCars.validState)
      .field('price', mockCars.validPrice)
      .field('model', mockCars.validModel)
      .field('manufacturer', mockCars.validManufacturer)
      .field('bodyType', mockCars.validBodyType)
      .field('name', mockCars.validName)
      .field('email', user1.email);
    carCreated2 = res.body.data;
  });
  before(async () => {
    await chai
      .request(app)
      .patch(`/api/v1/car/${carCreated2.id}/status`)
      .set('Authorization', `Bearer ${user1.token}`)
      .type('form')
      .send();
  });

  // Clean up db after all test suites
  after(async () => {
    await usersHelper.removeAllUsers();
    await carsHelper.clearCars();
  });
  describe('route POST /api/v1/order', () => {
    it('should raise 400 error with invalid or no car id', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
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
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: carCreated.id,
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
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: 1837381,
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
    it('should raise 403 error with making purchase order on sold car', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: carCreated2.id,
          priceOffered: mockOrders.validPriceOffered,
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          assert.strictEqual(
            res.body.status,
            403,
            'Status code should be 403',
          );
          assert.strictEqual(
            res.body.error,
            'car has already been sold',
            'car has already been sold',
          );

          done();
        });
    });
    it('should raise 409 error with ad creator making purchase order', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          carId: carCreated.id,
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
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: carCreated.id,
          priceOffered: mockOrders.validPriceOffered,
        })
        .end((err, res) => {
          const { data, status } = res.body;
          expect(res).to.have.status(201);
          expect(data).to.have.property('id');
          expect(data).to.have.property('car_id');
          expect(data).to.have.property('created_on');
          expect(data).to.have.property('price_offered');

          assert.strictEqual(status, 201, 'Status code should be 201');
          done();
        });
    });
    it('should raise 409 with valid duplicate purchase order', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          carId: carCreated.id,
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
  describe('route POST /api/v1/order/:order_id/price', () => {
    it('should raise 400 error with invalid param order_id', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/1s/price')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          newPrice: mockOrders.validnewPrice,
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
            'order id is undefined or invalid',
            'order id is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 400 error with invalid or no new price', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/1/price')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);

          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'new price is undefined or invalid',
            'new price is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 403 error when trying to edit another user\'s order', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/1/price')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          newPrice: mockOrders.validNewPrice,
        })
        .end((err, res) => {
          expect(res).to.have.status(403);

          assert.strictEqual(
            res.body.status,
            403,
            'Status code should be 403',
          );
          assert.strictEqual(
            res.body.error,
            "you cannot edit another user's order",
            "you cannot edit another user's order",
          );
          done();
        });
    });
    it('should raise 404 error when purchase order does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/10101/price')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          newPrice: mockOrders.validNewPrice,
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
            'purchase order does not exist',
            'purchase order does not exist',
          );
          done();
        });
    });
    it('should raise 204 when order is successfully edited', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/1/price')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          newPrice: mockOrders.validNewPrice,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          const { data } = res.body;
          expect(data).to.have.property('id');
          expect(data).to.have.property('car_id');
          expect(data).to.have.property('status');
          expect(data).to.have.property('old_price_offered');
          expect(data).to.have.property('new_price_offered');
          assert.strictEqual(
            res.body.status,
            201,
            'Status code should be 201',
          );
          done();
        });
    });
  });
});
