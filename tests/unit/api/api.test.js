import Request from '../../../src/js/api'

const assert = require('chai').assert

describe('Request', function () {
    describe('params', function () {
        it('should insert param', function () {
            var request = Request.create()

            request.param('id', 2);

            assert.equal(request._params.toString(), 'id=2')
        })

        it('should insert params', function () {
            var request = Request.create()

            request.params('id', 1, 'id', 2, 'id', 3);

            assert.equal(request._params.toString(), 'id=1&id=2&id=3')
        })
    })

    describe('Requests', function () {
        it('Create a record', function () {
            var request = Request.create()
                   .resource('posts')
                   .data({
                        title: 'Hello',
                        body: 'Heols',
                        userId: 10,
                   })
                   .getURL();

            assert.equal(request, 'posts?');
        })

        it('Get a particular record', function () {
            var request = Request.create()
                   .resource('posts')
                   .id(1)
                   .getURL()

            assert.equal(request, 'posts/1?')
        })

        it('Get record with relation', function () {
            var request = Request.create()
                   .resource('posts')
                   .with('comments')
                   .getURL();

            assert.equal(request, 'posts?_embed=comments');
        })

        it('Get all records', function () {
            var request = Request.create()
                   .resource('posts')
                   .getURL()

            assert.equal(request, 'posts?');
        })

        it('Edit a particular record.', function () {
            var request = Request.create()
                   .resource('posts')
                   .id(1)
                   .data({
                        title: 'title changed',
                        body: 'Body changed'
                   })
                   .getURL()

            assert.equal(request, 'posts/1?');
        })

        it('Delete a particular record.', function () {
            var request = Request.create()
                   .resource('posts')
                   .id(1)
                   .getURL()

            assert.equal(request, 'posts/1?')
        })
    })
})