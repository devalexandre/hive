const TCP = require('../../../src/brokers/TCP');
const assert = require('assert');


describe('TCP', () => {
    after(() => {
        process.exit(0);
    });
    
    const broker = new TCP({name: 'test'});
    it('should be an instance of TCP', () => {
        assert.ok(broker instanceof TCP);
    });

    it('subscribe should return a promise', () => {
        assert.ok(broker.subscribe({topic: 'test'}) instanceof Promise);
    });

    it('publish should return a promise', () => {
        assert.ok(broker.publish({topic: 'test', data: 'test'}) instanceof Promise);
    });

    it('start should return a promise', () => {
        assert.ok(broker.start() instanceof Promise);
    });

    it('stop should return a promise', () => {
        assert.ok(broker.stop() instanceof Promise);
    });
});