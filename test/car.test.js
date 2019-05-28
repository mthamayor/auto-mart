/**
 * Unit tests for the signup endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockCars from './__mock__/mockCars';
import dbCarsHelper from '../server/api/utils/dbCarsHelper';
import dbHelper from '../server/api/utils/dbHelper';
import mockUser from './__mock__/mockUser';


chai.use(chaiHttp);

describe('Users car endpoint test', () => {
  let user1;
  let user2;
  const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;
  before((done) => {
    dbHelper.removeAllUsers();
    // create multiple users
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser)
      .end((err, res) => {
        user1 = res.body.data;
        done();
      });
  });
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .type('form')
      .send(mockUser.validUser2)
      .end((err, res) => {
        user2 = res.body.data;
        done();
      });
  });

  // Clean up db after all test suites
  after((done) => {
    dbHelper.removeAllUsers();
    dbCarsHelper.clearDB();
    done();
  });

  describe('route POST /api/v1/car', () => {
    it('should raise 401 when authorization token not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', user1.id)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', user1.id)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('state', mockCars.invalidState)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.invalidPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('bodyType', mockCars.validBodyType)
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
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
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
    it('should raise 400 error with no or invalid vehicle name', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .end((err, res) => {
          expect(res).to.have.status(400);
          const { error } = res.body;
          assert.strictEqual(
            error,
            'vehicle name undefined or invalid',
            'vehicle name undefined or invalid',
          );
          done();
        });
    });
    it('should raise 201 and successfully create the ad', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('data');

          const { data } = res.body;
          expect(data).to.have.property('id');
          expect(data).to.have.property('created_on');
          expect(data).to.have.property('image_urls');
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
          done();
        });
    });
  });
  describe('route POST /api/v1/car/:car_id/status', () => {
    before((done) => {
      dbCarsHelper.clearDB();
      done();
    });
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end(() => {
          done();
        });
    });
    it('should raise 400 error when carId is invalid', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1as/status')
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
            'car_id parameter is undefined or invalid',
            'car_id parameter is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 404 error if car advert does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/2/status')
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
            'car advert does not exist',
            'car advert does not exist',
          );
          done();
        });
    });
    it('should raise 403 error if trying to edit another user\'s ad', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
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
            "you cannot edit another user's advert",
            "you cannot edit another user's advert",
          );
          done();
        });
    });
    it('should raise 201 when ad is successfully marked as sold', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(201);
          const { status, data } = res.body;
          assert.strictEqual(status, 201, 'Status code should be 201');
          assert.strictEqual(
            data.status,
            'sold',
            'Car status should be sold',
          );
          done();
        });
    });
    it('should raise 409 error if trying to edit sold car', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(409);
          const { error } = res.body;
          assert.strictEqual(
            res.body.status,
            409,
            'Status code should be 409',
          );
          assert.strictEqual(
            error,
            'the car has already been marked as sold',
            'the car has already been marked as sold',
          );
          done();
        });
    });
  });
  describe('route POST /api/v1/car/:car_id/price', () => {
    before((done) => {
      dbCarsHelper.clearDB();
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end(() => {
          done();
        });
    });
    it('should raise 400 error newPrice is undefined', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/price')
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
            'newPrice is undefined or invalid',
            'newPrice is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 201 when price is successfully updated', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/price')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send({
          newPrice: '1200000',
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
    before((done) => {
      dbCarsHelper.clearDB();
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .end(() => {
          done();
        });
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
    it('should raise 200 when the car was successfully retrieved', (done) => {
      chai
        .request(app)
        .get('/api/v1/car/1')
        .type('form')
        .send()
        .end((err, res) => {
          const { data, status } = res.body;
          expect(res).to.have.status(200);
          expect(data).to.have.property('id');
          expect(data).to.have.property('owner');
          expect(data).to.have.property('created_on');
          expect(data).to.have.property('status');
          expect(data).to.have.property('price');
          expect(data).to.have.property('model');
          expect(data).to.have.property('state');
          expect(data).to.have.property('image_url_list');
          expect(data).to.have.property('body_type');
          assert.strictEqual(
            status,
            200,
            'Status code should be 200',
          );

          done();
        });
    });
  });
});
