/**
 * Unit tests for the signup endpoint
 */

import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockUser from './__mock__/mockUser';
import mockOrders from './__mock__/mockOrders';
import { usersHelper, carsHelper, ordersHelper } from '../server/api/models';
import mockCars from './__mock__/mockCars';

chai.use(chaiHttp);

describe('Users order endpoint test', () => {
  let user1;
  let user2;
  let carCreated;
  let carCreated2;
  let order1;
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
      .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('owner', user1.id)
      .field('state', mockCars.validState)
      .field('price', mockCars.validPrice)
      .field('model', mockCars.validModel)
      .field('manufacturer', mockCars.validManufacturer)
      .field('body_type', mockCars.validBodyType)
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
      .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('owner', user1.id)
      .field('state', mockCars.validState)
      .field('price', mockCars.validPrice)
      .field('model', mockCars.validModel)
      .field('manufacturer', mockCars.validManufacturer)
      .field('body_type', mockCars.validBodyType)
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
    await ordersHelper.clearOrders();
  });
  describe('route POST /api/v1/order', () => {
    it('should raise 400 error with invalid or no car id', (done) => {
      chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          price: mockOrders.validPriceOffered,
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
          car_id: carCreated.id,
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
          car_id: 1837381,
          price: mockOrders.validPriceOffered,
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
          car_id: carCreated2.id,
          price: mockOrders.validPriceOffered,
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
    it('should raise 201 with valid inputs', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          car_id: carCreated.id,
          price: mockOrders.validPriceOffered,
        });
      const { data, status } = res.body;
      expect(res).to.have.status(201);
      expect(data).to.have.property('id');
      expect(data).to.have.property('car_id');
      expect(data).to.have.property('created_on');
      expect(data).to.have.property('price_offered');

      order1 = data;
      assert.strictEqual(status, 201, 'Status code should be 201');
      assert.strictEqual(data.price_offered, mockOrders.validPriceOffered, 'Price should be equal');
    });
    it('should raise 409 with valid duplicate purchase order', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          car_id: carCreated.id,
          price: mockOrders.validPriceOffered,
        });
      const { error, status } = res.body;

      expect(res).to.have.status(409);
      assert.strictEqual(status, 409, 'Status code should be 409');
      assert.strictEqual(
        error,
        'you already created a purchase order',
        'you already created a purchase order',
      );
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
          price: mockOrders.validnewPrice,
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
        .patch(`/api/v1/order/${order1.id}/price`)
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
        .patch(`/api/v1/order/${order1.id}/price`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          price: mockOrders.validNewPrice,
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
          price: mockOrders.validNewPrice,
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
    it('should raise 201 when order is successfully edited', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/order/${order1.id}/price`)
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({
          price: mockOrders.validNewPrice,
        });
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

      assert.strictEqual(
        data.old_price_offered,
        order1.price_offered,
        'Old price offered does not match',
      );

      assert.strictEqual(
        data.new_price_offered,
        mockOrders.validNewPrice,
        'New price offered does not match',
      );
    });
  });
  describe('route POST /api/v1/order/:order_id/reject', () => {
    it('should raise 400 error with invalid param order_id', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/1s/reject')
        .set('Authorization', `Bearer ${user1.token}`)
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
            'order id is undefined or invalid',
            'order id is undefined or invalid',
          );
          done();
        });
    });

    it('should raise 403 error when not owner of car ad', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/order/${order1.id}/reject`)
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(403);

          assert.strictEqual(
            res.body.status,
            403,
            'Status code should be 403',
          );
          assert.strictEqual(
            res.body.error,
            'only the owner of the ad can accept or reject purchase orders',
            'only the owner of the ad can accept or reject purchase orders',
          );
          done();
        });
    });
    it('should raise 404 error when purchase order does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/order/10101/reject')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(404);

          assert.strictEqual(
            res.body.status,
            404,
            'Status code should be 404',
          );
          assert.strictEqual(
            res.body.error,
            'order not found',
            'order not found',
          );
          done();
        });
    });
    it('should raise 200 when order is successfully rejected', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/order/${order1.id}/reject`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      const { data } = res.body;
      expect(data).to.have.property('id');
      expect(data).to.have.property('buyer');
      expect(data).to.have.property('car_id');
      expect(data).to.have.property('status');
      expect(data).to.have.property('price');
      expect(data).to.have.property('price_offered');
      expect(data).to.have.property('created_on');
      assert.strictEqual(res.body.status, 200, 'Status code should be 200');

      assert.strictEqual(
        data.status,
        'rejected',
        'purchase order status should be rejected',
      );

      assert.strictEqual(data.buyer, user2.id, 'Buyer should be equal');
    });
  });
  describe('route PATCH /api/v1/order/:order_id/accept', () => {
    it('should raise 200 when order is successfully accepted', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/order/${order1.id}/accept`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      const { data } = res.body;
      expect(data).to.have.property('id');
      expect(data).to.have.property('buyer');
      expect(data).to.have.property('car_id');
      expect(data).to.have.property('status');
      expect(data).to.have.property('price');
      expect(data).to.have.property('price_offered');
      expect(data).to.have.property('created_on');
      assert.strictEqual(res.body.status, 200, 'Status code should be 200');

      assert.strictEqual(
        data.status,
        'accepted',
        'purchase order status should be accepted',
      );

      assert.strictEqual(data.buyer, user2.id, 'Buyer should be equal');
    });

    it('should raise 403 when order is sold', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/order/${order1.id}/accept`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
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
    });
  });
  describe('Users GET api/v1/order/user/my-orders', () => {
    it('should raise 401 when authorization token not provided', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/order/user/my-orders')
        .type('form')
        .send();
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      const { status, error } = res.body;
      assert.strictEqual(status, 401, 'Status should be 401');
      assert.strictEqual(
        error,
        'authorization token not provided',
        'authorization token not provided',
      );
    });

    it('should raise 401 when wrong authorization token is provided', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/order/user/my-orders')
        .set('Authorization', 'Bearer dfaslfdsoaeoes')
        .type('form')
        .send();
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      const { status, error } = res.body;
      assert.strictEqual(status, 401, 'Status should be 401');
      assert.strictEqual(
        error,
        'user not authenticated, invalid authorization token provided',
        'user not authenticated, invalid authorization token provided',
      );
    });

    it("should raise 200 when the user's orders are successfully returned", async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/order/user/my-orders')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');
      const { data, status } = res.body;
      expect(data).to.be.an('array');
      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });
});
