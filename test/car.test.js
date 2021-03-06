/**
 * Unit tests for the cars endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockCars from './__mock__/mockCars';
import { usersHelper, carsHelper } from '../server/api/models';
import mockUser from './__mock__/mockUser';


chai.use(chaiHttp);

describe('Car endpoint test', () => {
  let user1;
  let user2;
  let car1;
  const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;

  before(async () => {
    await usersHelper.removeAllUsers();
    // create multiple users
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

  // Clean up db after all test suites
  after(async () => {
    await usersHelper.removeAllUsers();
    await carsHelper.clearCars();
  });

  describe('route POST /api/v1/car', () => {
    it('should raise 401 when authorization token not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', user1.id)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error } = res.body;
          assert.strictEqual(
            error,
            'authorization token not provided',
            'authorization token not provided',
          );
          done();
        });
    });
    it('should raise 401 with invalid authorization token', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer adsfljewos')
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', user1.id)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error } = res.body;
          assert.strictEqual(
            error,
            'user not authenticated, invalid authorization token provided',
            'user not authenticated, invalid authorization token provided',
          );
          done();
        });
    });
    it('should raise 400 error with no attached file', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);
          const { error } = res.body;
          assert.strictEqual(
            error,
            'please add between 1 and 6 images',
            'correct number of images should be added',
          );
          done();
        });
    });

    it('should raise 400 error with no attached state', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'vehicle state is undefined',
            'vehicle state was not defined',
          );

          done();
        });
    });

    it('should raise 400 error with an invalid state', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('state', mockCars.invalidState)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'vehicle state can only be new or used',
            'vehicle state can only be new or used',
          );

          done();
        });
    });

    it('should raise 400 error with no  price', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          done();
        });
    });

    it('should raise 400 error with undefined price', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'price is undefined',
            'price is undefined',
          );

          done();
        });
    });

    it('should raise 400 error with invalid price', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.invalidPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'price is not a number',
            'price is not a number',
          );

          done();
        });
    });

    it('should raise 400 error with invalid or no model', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'model undefined or invalid',
            'model undefined or invalid',
          );

          done();
        });
    });
    it('should raise 400 error with invalid or no manufacturer', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'manufacturer is undefined or invalid',
            'manufacturer is undefined or invalid',
          );

          done();
        });
    });
    it('should raise 400 error with invalid or no body type', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'body type is undefined or invalid',
            'body type is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 201 and successfully create the ad', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data } = res.body;
      expect(data).to.have.property('id');
      expect(data).to.have.property('created_on');
      expect(data).to.have.property('image_url');
      expect(data).to.have.property('status');
      expect(data).to.have.property('state');
      const {
        manufacturer, model, price,
      } = data;

      assert.strictEqual(
        manufacturer,
        mockCars.validManufacturer,
        'manufacturer should be valid',
      );
      assert.strictEqual(
        model,
        mockCars.validModel,
        'model should be valid',
      );
      assert.strictEqual(
        price,
        mockCars.validPrice,
        'price should be valid',
      );
    });
    it('should raise 201 and successfully create the ad with img_url field', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          state: mockCars.validState,
          price: mockCars.validPrice,
          model: mockCars.validModel,
          manufacturer: mockCars.validManufacturer,
          body_type: mockCars.validBodyType,
          img_url: 'https://google.com',
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data } = res.body;
      expect(data).to.have.property('id');
      expect(data).to.have.property('created_on');
      expect(data).to.have.property('image_url');
      expect(data).to.have.property('status');
      expect(data).to.have.property('state');
      expect(data).to.have.property('name');

      const { manufacturer, model, price } = data;

      assert.strictEqual(
        manufacturer,
        mockCars.validManufacturer,
        'manufacturer should be valid',
      );
      assert.strictEqual(
        model,
        mockCars.validModel,
        'model should be valid',
      );
      assert.strictEqual(
        price,
        mockCars.validPrice,
        'price should be valid',
      );
    });
  });
  describe('route POST /api/v1/car/:car_id/status', () => {
    before(async () => {
      await carsHelper.clearCars();
    });
    before(async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });
    it('should raise 400 error when carId is invalid', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1as/status')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({ status: 'sold' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          assert.strictEqual(
            res.body.status,
            400,
            'Status code should be 400',
          );
          assert.strictEqual(
            res.body.error,
            'car_id parameter is undefined or invalid',
            'car_id parameter is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 404 error if car advert does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/2183739/status')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({ status: 'sold' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          assert.strictEqual(
            res.body.status,
            404,
            'Status code should be 404',
          );
          assert.strictEqual(
            res.body.error,
            'car advert does not exist',
            'car advert does not exist',
          );
          done();
        });
    });
    it('should raise 403 error if trying to edit another user\'s ad', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}/status`)
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send({ status: 'sold' })
        .end((err, res) => {
          expect(res).to.have.status(403);
          assert.strictEqual(
            res.body.status,
            403,
            'Status code should be 403',
          );
          assert.strictEqual(
            res.body.error,
            "you cannot edit another user's advert",
            "you cannot edit another user's advert",
          );
          done();
        });
    });
    it('should raise 400 error if new status is undefined', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}/status`)
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
            'status is undefined or invalid',
            'status is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 201 when ad is successfully marked as sold', async () => {
      const res = await chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}/status`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({ status: 'sold' });
      expect(res).to.have.status(201);
      const { status, data } = res.body;
      assert.strictEqual(status, 201, 'Status code should be 201');
      assert.strictEqual(
        data.status,
        'sold',
        'Car status should be sold',
      );
    });
  });
  describe('route POST /api/v1/car/:car_id/price', () => {
    before(async () => {
      await carsHelper.clearCars();
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });
    it('should raise 400 error price is undefined', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}/price`)
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
            'price is undefined or invalid',
            'price is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 400 error with invalid car_id', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}saas/price`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          price: '1200000',
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
            'car_id parameter is undefined or invalid',
            'car_id parameter is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 201 when price is successfully updated', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/car/${car1.id}/price`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          price: '1200000',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          assert.strictEqual(
            res.body.status,
            201,
            'Status code should be 201',
          );

          done();
        });
    });
  });
  describe('route GET /api/v1/car/:car_id/', () => {
    before(async () => {
      await carsHelper.clearCars();
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });
    it('should raise 400 error car_id is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/car/1s')
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
            'car_id parameter is not a valid number',
            'car_id parameter is not a valid number',
          );
          done();
        });
    });
    it('should raise 404 error if car does not exist', (done) => {
      chai
        .request(app)
        .get('/api/v1/car/2')
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
            'car does not exist',
            'car does not exist',
          );
          done();
        });
    });
    it('should raise 200 when the car was successfully retrieved', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/car/${car1.id}`)
        .type('form')
        .send();
      const { data, status } = res.body;
      expect(res).to.have.status(200);
      expect(data).to.have.property('id');
      expect(data).to.have.property('owner');
      expect(data).to.have.property('created_on');
      expect(data).to.have.property('status');
      expect(data).to.have.property('price');
      expect(data).to.have.property('model');
      expect(data).to.have.property('state');
      expect(data).to.have.property('image_url');
      expect(data).to.have.property('body_type');
      assert.strictEqual(
        status,
        200,
        'Status code should be 200',
      );
    });
  });
  describe('route GET car/:car_id/orders', () => {
    before(async () => {
      await carsHelper.clearCars();
    });
    before(async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });

    it('should raise 200 when the orders for ad were successfully retrieved', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/car/${car1.id}/orders`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');
      const { data, status } = res.body;
      expect(data).to.be.a('array');
      assert.strictEqual(status, 200, 'status should be 200');
    });
  });

  describe('route GET car/:car_id/flags', () => {
    before(async () => {
      await carsHelper.clearCars();
    });
    before(async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });
    // Make user 1 an admin
    before(async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/auth/${user1.id}/admin`)
        .type('form')
        .send();
      user1 = res.body.data;
    });

    it('should raise 200 when the flags for ad were successfully retrieved', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/car/${car1.id}/flags`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');
      const { data, status } = res.body;
      expect(data).to.be.a('array');
      assert.strictEqual(status, 200, 'delete status should be 200');
    });
  });
  describe('route DELETE /api/v1/car/:car_id/', () => {
    before(async () => {
      await carsHelper.clearCars();
      const res = await chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('image_url', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('body_type', mockCars.validBodyType)
        .field('name', mockCars.validName);
      car1 = res.body.data;
    });
    // set user 1 as admin
    before(async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/auth/${user1.id}/admin`)
        .type('form')
        .send();
      user1 = res.body.data;
    });


    it('should raise 400 error car_id is invalid', (done) => {
      chai
        .request(app)
        .delete('/api/v1/car/1s')
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
            'car_id parameter is not a valid number',
            'car_id parameter is not a valid number',
          );
          done();
        });
    });
    it('should raise 404 error if car does not exist', (done) => {
      chai
        .request(app)
        .delete('/api/v1/car/103402')
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
            'car does not exist',
            'car does not exist',
          );
          done();
        });
    });
    it('should raise 200 when the car was successfully deleted', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/v1/car/${car1.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      assert.strictEqual(status, 200, 'delete status should be 200');
      assert.strictEqual(
        data,
        'Car Ad successfully deleted',
        'Car Ad successfully deleted',
      );
    });
  });
});
