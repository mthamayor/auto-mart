/**
 * Unit tests for the GET cars endpoint
 */

import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import mockCars from './__mock__/mockCars';
import { usersHelper, carsHelper } from '../server/api/models';
import mockUser from './__mock__/mockUser';


chai.use(chaiHttp);

describe('Users GET car endpoint test', () => {
  // create two users
  let user1;
  let user2;
  let car1;
  let car2;
  let car3;
  let car4;

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
  // Make user 2 an admin
  before(async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/auth/${user2.id}/admin`)
      .type('form')
      .send();
    user2 = res.body.data;
  });
  // Create multiple cars orders from user 1
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('state', 'new')
      .field('price', '1500000')
      .field('model', 'lx350')
      .field('manufacturer', 'lexus')
      .field('bodyType', 'jeep')
      .field('name', 'Lexus 350 2014 model');
    car1 = res.body.data;
  });
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('state', 'used')
      .field('price', '1000000')
      .field('model', 'LE2015')
      .field('manufacturer', 'toyota')
      .field('bodyType', 'car')
      .field('name', 'Toyota baseus LE2015 with AC');
    car2 = res.body.data;
  });
  before(async () => {
    const res = await chai
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
      .field('name', mockCars.validName);
    car3 = res.body.data;
  });
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/car')
      .set('Authorization', `Bearer ${user1.token}`)
      .attach('imageArray', fileUrl, 'toyoto-avalon.jpg')
      .type('form')
      .field('state', 'used')
      .field('price', '450000')
      .field('model', '2010')
      .field('manufacturer', 'hyundai')
      .field('bodyType', 'car')
      .field('name', 'Hyundai Utility family bus');
    car4 = res.body.data;
  });
  // Mark car4 as sold
  before(async () => {
    const res = await chai
      .request(app)
      .patch(`/api/v1/car/${car4.id}/status`)
      .set('Authorization', `Bearer ${user1.token}`)
      .type('form')
      .send();
    const { data } = res.body;
    car4 = data;
  });

  describe('Users GET api/v1/car', () => {
    it('should raise 401 if user token is not provided', (done) => {
      chai
        .request(app)
        .get('/api/v1/car')
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 401, 'Status should be 401');
          assert.strictEqual(
            error,
            'you do not have permission to access this route',
            'you do not have permission to access this route',
          );
          done();
        });
    });
    it('should raise 401 if invalid token is provided', (done) => {
      chai
        .request(app)
        .get('/api/v1/car')
        .set('Authorization', 'Bearer adsfslwouw')
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 401, 'Status should be 401');
          assert.strictEqual(
            error,
            'invalid token provided. please provide a valid token',
            'invalid token provided. please provide a valid token',
          );
          done();
        });
    });
    it('should raise 403 if user is not an admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/car')
        .set('Authorization', `Bearer ${user1.token}`)
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { error, status } = res.body;
          assert.strictEqual(status, 403, 'Status should be 403');
          assert.strictEqual(
            error,
            'Forbidden: only admins can access this route',
            'Forbidden: only admins can access this route',
          );
          done();
        });
    });
    it('should raise 200 when all cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/car')
        .set('Authorization', `Bearer ${user2.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(4);

      assert.strictEqual(status, 200, 'Status should be 200');

      const returnedCar1 = data[0];
      assert.strictEqual(
        returnedCar1.status,
        car1.status,
        `Status should be ${car1.status}`,
      );

      const returnedCar2 = data[1];
      assert.strictEqual(
        returnedCar2.status,
        car2.status,
        `Status should be ${car2.status}`,
      );


      const returnedCar3 = data[2];
      assert.strictEqual(
        returnedCar3.status,
        car3.status,
        `Status should be ${car3.status}`,
      );

      const returnedCar4 = data[3];
      assert.strictEqual(
        returnedCar4.status,
        car4.status,
        `Status should be ${car4.status}`,
      );
    });
  });
  describe('Users GET api/v1/car?status=available', () => {
    it('should raise 200 when the available cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/car?status=available')
        .type('form')
        .send();

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(3);

      for (let i = 0; i < data.length; i += 1) {
        expect(data[i].status).to.eql('available');
      }
      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });

  describe('Users GET api/v1/car?status=available&min_price=​XXXValue​&max_price=​XXXValue', () => {
    it('should raise 400 when max_price is greater or equal to min_price', (done) => {
      const minPrice = 1200000;
      const maxPrice = 450000;
      chai
        .request(app)
        .get(
          `/api/v1/car?status=available&min_price=${minPrice}&max_price=${maxPrice}`,
        )
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { status, error } = res.body;
          assert.strictEqual(status, 400, 'Status code should be 400');
          assert.strictEqual(
            error,
            'min_price cannot be greater or equal to max price',
            'min_price cannot be greater or equal to max price',
          );
          done();
        });
    });
    it('should raise 400 when one of min_price or max_price is undefined', (done) => {
      const minPrice = 1200000;
      chai
        .request(app)
        .get(
          `/api/v1/car?status=available&min_price=${minPrice}`,
        )
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { status, error } = res.body;
          assert.strictEqual(status, 400, 'Status code should be 400');
          assert.strictEqual(
            error,
            'please specify both min_price and maxprice',
            'please specify both min_price and maxprice',
          );
          done();
        });
    });
    it('should raise 400 when max_price is not a valid number', (done) => {
      const minPrice = 1200000;
      const maxPrice = '450000sdfa';
      chai
        .request(app)
        .get(
          `/api/v1/car?status=available&min_price=${minPrice}&max_price=${maxPrice}`,
        )
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { status, error } = res.body;
          assert.strictEqual(status, 400, 'Status code should be 400');
          assert.strictEqual(
            error,
            'max_price is not a number',
            'max_price is not a number',
          );
          done();
        });
    });
    it('should raise 400 when min_price is not a valid number', (done) => {
      const maxPrice = 1200000;
      const minPrice = '450000sdfa';
      chai
        .request(app)
        .get(
          `/api/v1/car?status=available&min_price=${minPrice}&max_price=${maxPrice}`,
        )
        .type('form')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');

          const { status, error } = res.body;
          assert.strictEqual(status, 400, 'Status code should be 400');
          assert.strictEqual(
            error,
            'min_price is not a number',
            'min_price is not a number',
          );
          done();
        });
    });
    it('should raise 200 when the available cars are successfully returned', async () => {
      const maxPrice = 1200000;
      const minPrice = 450000;
      const res = await chai
        .request(app)
        .get(`/api/v1/car?status=available&min_price=${minPrice}&max_price=${maxPrice}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(2);

      for (let i = 0; i < data.length; i += 1) {
        const carX = data[i];
        expect(carX.status).to.eql('available');
        expect(parseFloat(carX.price, 10)).to.be.at.least(minPrice);
        expect(parseFloat(carX.price, 10)).to.be.at.most(maxPrice);
      }

      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });

  describe('Users GET api/v1/car?status=available&state=new', () => {
    it('should raise 200 when the available new cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/car?status=available&state=new')
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(2);

      for (let i = 0; i < data.length; i += 1) {
        expect(data[i].state).to.eql('new');
        expect(data[i].status).to.eql('available');
      }

      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });

  describe('Users GET api/v1/car?status=available&state=used', () => {
    it('should raise 200 when the available used cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/car?status=available&state=used')
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(1);

      for (let i = 0; i < data.length; i += 1) {
        expect(data[i].state).to.eql('used');
        expect(data[i].status).to.eql('available');
      }

      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });

  describe('Users GET api/v1/car?status=available&manufacturer=XXXValue', () => {
    const manufacturer = 'toyota';
    it('should raise 200 when the available used cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/car?status=available&manufacturer=${manufacturer}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(2);

      for (let i = 0; i < data.length; i += 1) {
        expect(data[i].manufacturer).to.eql(manufacturer);
        expect(data[i].status).to.eql('available');
      }

      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });
  describe('Users GET api/v1/car?body_type=bodyType', () => {
    const bodyType = 'car';
    it('should raise 200 when the available used cars are successfully returned', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/car?body_type=${bodyType}`)
        .set('Authorization', `${user2.token}`)
        .type('form')
        .send();
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');

      const { data, status } = res.body;
      expect(data).to.be.an('array');
      expect(data).to.have.length(3);
      for (let i = 0; i < data.length; i += 1) {
        expect(data[i].body_type).to.eql(bodyType);
      }
      assert.strictEqual(status, 200, 'Status should be 200');
    });
  });
  // Clean up db after all test suites
  after(async () => {
    await usersHelper.removeAllUsers();
    await carsHelper.clearCars();
  });
});
