import amqp from 'amqplib/callback_api';
import config from './../../config/default.json';
import globalMsg from './../../config/error-msg-en.json';

export default class ESB {
     constructor() {
       this._connection = null;
     }
    get Connection() {
      return this._connection;
    }
    get Channel() {
      return this._channel;
    }     
    connect() {
      let RabbitMQUrl = this.buildUrl();

      if (RabbitMQUrl !== '') {
        return new Promise((resolve, reject) => {
          amqp.connect(RabbitMQUrl, (error, connection) => {
            if (error) {
              reject(error);
            }
            else {
              this._connection = connection;
              resolve(connection);
            }
          });
        });
      }
    }

    buildUrl() {
      let hasErrors = false;
      let ErrorMsg = '';
      let ESBUrl = '';

      if (config.RabbitMQ.host === '') {
        hasErrors = true;
        ErrorMsg = globalMsg.RabbitMQ.Error.UsernameEmpty;
      }
      if (config.RabbitMQ.username === '') {
        hasErrors = true;
        ErrorMsg = globalMsg.RabbitMQ.Error.PasswordEmpty;
      }
      if (config.RabbitMQ.password === '') {
        hasErrors = true;
        ErrorMsg = globalMsg.RabbitMQ.Error.HostEmpty;
      }
      if (!hasErrors) {
        ESBUrl = 'amqp://' + config.RabbitMQ.username + ':' + config.RabbitMQ.password + '@' + config.RabbitMQ.host;
      }
      else {
        throw ErrorMsg;
      }
      if (config.RabbitMQ.port && config.RabbitMQ.port !== 0) {
        ESBUrl += ':' + config.RabbitMQ.port;
      }
      return ESBUrl;
    }

    createChannel(connection) {
      return new Promise((resolve, reject) => {
        connection.createChannel((error, channel) => {
          if (error) {
            reject(error);
          }
          else {
            this._channel = channel;
            resolve(channel);
          }
        });
      });
    }

    createQueue(channel) {
      return new Promise((resolve, reject) => {
        try {
          let exchanges = config.RabbitMQ.Exchanges;
          let myQueues = config.RabbitMQ.myQueues;

          for (let exchange in exchanges) {
            channel.assertExchange(exchange.name, exchange.type, { durable: exchange.durable });
            for (let queue in exchange.queues) {
              let q = myQueues.find((x) => x.Queue === queue.name);
             
              if (q) {
                channel.assertQueue(queue.name, { durable: queue.durable, noAck: queue.Acknowledge}, (err, que) => {
                  channel.bindQueue(que, exchange, queue.Keyword);
                });;
              }
            }
          }
          resolve(exchanges);
        }
        catch (error) {
          reject(error);
        }
      });
    }

    start() {
      return new Promise((resolve, reject) => {
        try {
          this.connect().then((conn) => {
            this._connection = conn;
          }).createChannel(this._connection).then((ch) => {
            this._channel = ch;
          }).createQueue(this._channel).then((queue) => {
            resolve(globalMsg.RabbitMQ.Message.QueueCreated);
          });
        }
        catch (error) {
          reject(error);
        }
      });
    }

    send(key, message) {
      if (!this._connection) {
        throw globalMsg.RabbitMQ.Error.ConnectionNotAvail;
      }
      if (!this._channel) {
        throw globalMsg.RabbitMQ.Error.ConnectionNotLive;
      }
      this._channel.publish('', key, new Buffer(message), {persistent: true});
    }

    consume(Queue, callback) {
      if (!this._connection) {
        throw globalMsg.RabbitMQ.Error.ConnectionNotAvail;
      }
      if (!this._channel) {
        throw globalMsg.RabbitMQ.Error.ConnectionNotLive;
      }
      this._channel.consume(Queue, callback);
    }

    closeChannel() {
      try {
        this._channel.close();
      }
      catch (error) {
        throw error;
      }
    }
}
