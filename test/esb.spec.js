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
      expect(esb.buildUrl()).to.be.equal('amqp://guest:guest@us00206474.ericsson.se:4369');
    });
  });
  describe('Checking Rabbitmq connection', () => {
      it('should return the connection', () => {
        return esb.connect().then(function(data){
          console.log(data);
          done();
        })
    //    esb.connect().should.eventually.equal("test").notify(done);
      })
  });
});
