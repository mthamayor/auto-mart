/**
 * Unit tests for the GET cars endpoint
 */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);

describe('Test miscellaneous routes', () => {
  describe('GET /', () => {
    chai
      .request(app)
      .get('/')
      .type('form')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
  describe('GET /api/v1', () => {
    chai
      .request(app)
      .get('/api/v1')
      .type('form')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });
});
