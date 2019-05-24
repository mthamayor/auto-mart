/**
 * Unit tests for the signup endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockCars from './__mock__/mockCars';


chai.use(chaiHttp);

describe('Users car endpoint test', () => {
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
        .field('owner', mockCars.validOwner)
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
});
