import amqp from 'amqplib/callback_api';
import config from './../../config/default.json';
import globalMsg from './../../config/error-msg-en.json';

export default class ESB {
     constructor() {
     }

    connect() {
      let RabbitMQUrl = this.buildUrl();

      if (RabbitMQUrl !== '') {
        return new Promise((resolve, reject) => {
          amqp.connect(RabbitMQUrl, function (error, connection) {
            if (error) {
              reject(error);
            }
            else {
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
      if (config.RabbitMQ.port === '') {
        hasErrors = true;
        ErrorMsg = globalMsg.RabbitMQ.Error.PortEmpty;
      }
      if (!hasErrors) {
        ESBUrl = 'amqp://' + config.RabbitMQ.username + ':' + config.RabbitMQ.password + '@' + config.RabbitMQ.host + ':' + config.RabbitMQ.port;
      }
      else {
        throw ErrorMsg;
      }
      return ESBUrl;
    }
}
