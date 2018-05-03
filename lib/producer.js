const amqp = require('amqplib');
const config = require('config');

const queueUrl = config.get('messageQueue.url');

const QUEUE = 'hello';

class Producer {
  async connect() {
    this.connection = await amqp.connect(queueUrl);
    this.channel = await this.connection.createChannel();
    this.channel.assertQueue(QUEUE, {durable: false});
  }

  async disconnect() {
    if (this.connection) {
      this.connection.close();
    }
  }

  produce() {
    this.channel.sendToQueue(QUEUE, Buffer.from('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
  }
}

module.exports = Producer;
