/*global describe, it, before */

import chai from 'chai';
import ESB from '../src/ESB/esb';

chai.expect();

const expect = chai.expect;

let esb;

describe('Rabbitmq Connection', () => {
  before(() => {
    esb = new ESB();
  });
  describe('Validation and Connection Url', () => {
    it('should return the Connection Url', () => {
      expect(esb.buildUrl()).to.be.equal('amqp://guest:guest@localhost:1441');
    });
  });
  describe('Checking Rabbitmq connection', () => {

  });
});
