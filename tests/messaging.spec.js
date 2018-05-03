const assert = require('chai').assert;
const _ = require('lodash');
const { waitUtils } = require('testing-utils');

const Consumer = require('../lib/consumer');
const Producer = require('../lib/producer');

describe('messaging', () => {
	let producer;
	let consumer;
	beforeEach(() => {
    producer = new Producer();
    consumer = new Consumer();
	});

	afterEach(() => {
		producer.disconnect();
		consumer.disconnect();
	});

	it('happy path', async () => {
		await producer.connect();
		await consumer.connect();

		_.times(5, producer.produce.bind(producer));

    await waitUtils.waitUntilTrue(() => {
    	return consumer.counter === 5;
		})
	});
});
