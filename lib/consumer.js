const amqp = require('amqplib');
const config = require('config');

const queueUrl = config.get('messageQueue.url');

const QUEUE = 'hello';

class Consumer {
  constructor() {
    this.counter = 0;
  }

  async connect() {
    // it is a good practice to have separate connections for consumer and producer to avoid back pressure from affecting consumption speed
    // that could lead to eventual death spiral
    this.connection = await amqp.connect(queueUrl);

    // Channels should be long-lived if possible, e.g. reuse the same channel per thread of publishing. Don’t open a channel for each time you are publishing.
    this.channel = await this.connection.createChannel();

    this.channel.assertQueue(QUEUE, {durable: false});

    const self = this;
    this.channel.consume(QUEUE, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      self.counter++;
    }, {noAck: true});
  }

  async disconnect() {
    if (this.connection) {
      this.connection.close();
    }
  }
}

module.exports = Consumer;
