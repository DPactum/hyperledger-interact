/*
var expect = require("expect");
var sinon = require("sinon");
var rewire = require("rewire");
var HyperObject = rewire("../HyperObject");

var Client = HyperObject.__get__("Client");

describe("HyperObject", function () {
    var clientMock;
    beforeEach(function () {
        clientMock = sinon.mock(Client);
    });

    afterEach(function () {
        clientMock.verify();
        clientMock.restore();
    });

    describe("init", function () {
        var obj = new HyperObject();

        it("should create the rpc client correctly", function (done) {
            expect(obj.rpc).toBe(undefined);
            expect(obj.rpcArgs).toBe(undefined);

            obj.init();

            done();
        });
        it("should have the rpcArgs");
    });  
});
*/
