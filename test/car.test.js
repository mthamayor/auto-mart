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
  before((done) => {
    dbCarsHelper.clearDB();
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
    const fileUrl = `${__dirname}/__mock__/__img__/toyota-avalon.jpg`;
    it('should raise 400 error with no attached file', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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

    it('should raise 400 error with no or invalid owner', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
        .end((err, res) => {
          expect(res).to.have.status(400);

          const { error } = res.body;
          assert.strictEqual(
            error,
            'owner undefined or invalid',
            'The owner should be valid',
          );
          done();
        });
    });

    it('should raise 400 error with no attached state', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('state', mockCars.invalidState)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
        .end((err, res) => {
          expect(res).to.have.status(400);

          done();
        });
    });

    it('should raise 400 error with undefined price', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.invalidPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('email', mockCars.validEmail)
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
    it('should raise 400 error with invalid or no email', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
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
            'email is not valid',
            'email is not valid',
          );
          done();
        });
    });
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
    it('should raise 201 and successfully create the ad', (done) => {
      chai
        .request(app)
        .post('/api/v1/car')
        .set('Authorization', 'Bearer d432dd24')
        .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
        .type('form')
        .field('owner', mockCars.validOwner)
        .field('state', mockCars.validState)
        .field('price', mockCars.validPrice)
        .field('model', mockCars.validModel)
        .field('manufacturer', mockCars.validManufacturer)
        .field('bodyType', mockCars.validBodyType)
        .field('name', mockCars.validName)
        .field('email', mockCars.validEmail)
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
            email, manufacturer, model, price,
          } = data;

          assert.strictEqual(
            email,
            mockCars.validEmail,
            'email is not valid',
          );
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
  describe('route POST /api/v1/car/:car_id/price', () => {
    it('should raise 400 error user is undefined', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          newPrice: mockCars.validNewPrice,
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
            'user is required',
            'user is required',
          );
          done();
        });
    });
    it('should raise 400 error when carId is undefined', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1as/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user2.id,
          newPrice: mockCars.validNewPrice,
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
    it('should raise 400 error newPrice is undefined', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user2.id,
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
            'newPrice is undefined or invalid',
            'newPrice is undefined or invalid',
          );
          done();
        });
    });
    it('should raise 404 error if car advert does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/2/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user2.id,
          newPrice: mockCars.validNewPrice,
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
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user2.id,
          newPrice: mockCars.validNewPrice,
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
            "you cannot edit another user's advert",
            "you cannot edit another user's advert",
          );
          done();
        });
    });
    it("should raise 403 error if trying to edit another user's ad", (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user1.id,
          newPrice: mockCars.validNewPrice,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          const { data } = res.body;
          assert.strictEqual(
            res.body.status,
            201,
            'Status code should be 201',
          );
          assert.strictEqual(data.status, 'sold', "advert status shoulb be 'sold'");
          done();
        });
    });
    it('should raise 409 error if trying to edit sold car', (done) => {
      chai
        .request(app)
        .patch('/api/v1/car/1/status')
        .set('Authorization', 'Bearer d432dd24')
        .type('form')
        .send({
          user: user1.id,
          newPrice: mockCars.validNewPrice,
        })
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
});
