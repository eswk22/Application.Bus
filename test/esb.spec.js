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
      expect(esb.buildUrl()).to.be.equal('amqp://guest:guest@localhost');
    });
  });
  describe('Rabbitmq connection', () => {
    it('should return the connection', (done) => {
      return esb.connect().then(function (data) {
        expect(esb.Connection).to.not.be.undefined;
        done();
      });
    });
    it('should return the channel', (done) => {
      return esb.connect().then(function (data) {
        esb.createChannel(data).then(function (data) {
          expect(esb.Channel).to.not.be.undefined;
          done();
        });
         //    esb.connect().should.eventually.equal("test").notify(done);
      });
    });
    it('should return the queue', (done) => {
      return esb.connect().then(function (connection) {
        esb.createChannel(connection).then(function (channel) {
          esb.createQueue(channel);
          done();
        });
         //    esb.connect().should.eventually.equal("test").notify(done);
      });
    });
  });
});
