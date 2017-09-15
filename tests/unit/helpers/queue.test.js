import { Queue } from '../../../src/js/helpers'

const assert = require('chai').assert

describe('Queue', function () {
    it('Should increment counter 3 times.', function (done) {
        var counter = 0;

        const queue = new Queue();

        queue.add(finish => finish(counter++))
             .add(finish => finish(counter++))
             .add(finish => finish(counter++))
             .add(finish => finish (
                    done(assert.equal(counter, 3))
                )
             )
    })
})