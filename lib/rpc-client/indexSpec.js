var expect = require("expect");
var sinon = require("sinon");
var rewire = require("rewire");
var Client = rewire("./index");

var rpc = Client.__get__("rpc");

describe("rpc-client Client", function() {
    
    describe("constructor", function() {
        it("should fail if options are not passed", function(done) {
            expect(function() {
                new Client();
            }).toThrow(/options are required/);

            done();
        });

        it("should fail if there's no host", function(done) {
            var options = {};

            expect(function() {
                new Client(options);
            }).toThrow(/options.host/);

            done();
        });

        it("should fail if there's no port", function(done) {
            var options = { host: "host"};

            expect(function() {
                new Client(options);
            }).toThrow(/options.port/);

            done();
        });

        it("should fail if there's no path", function(done) {
            var options = { host: "host", port: 333};

            expect(function() {
                new Client(options);
            }).toThrow(/options.path/);

            done();
        });

    });
    
    describe("call", function() {
        var options = {
            host: "host",
            port: "44",
            path: "path"
        };

        var client = new Client(options);
        var clientMock;

        beforeEach(function () {
            clientMock = sinon.mock(client.client);
        });

        afterEach(function () {
            clientMock.verify();
            clientMock.restore();
        });

        it("should take a callback as a second parameter", function (done) {
            var stub = clientMock.expects("call");

            stub.callsArgWith(1, null);
            client.call("mymethod", function (err) {
                expect(err).toBe(null);
                expect(stub.getCall(0).args[0].jsonrpc).toBe("2.0");
                expect(stub.getCall(0).args[0].method).toBe("mymethod");
                expect(stub.getCall(0).args[0].params).toBe(undefined);
                expect(stub.getCall(0).args[0].id).toExist();
                done();
            });
        });

        it("should fail if method is not supplied", function (done) {
            client.call(undefined, [], function(err){
                expect(err).toNotBe(null);
                expect(err).toNotBe(undefined);
                done();
            });
        });

        it("should parse the arguments correctly", function (done) {
            var stub = clientMock.expects("call");

            stub.callsArgWith(1, null);
            var params = ["one", "two"];

            client.call("mymethod", params, function (err) {
                expect(err).toBe(null);
                expect(stub.getCall(0).args[0].jsonrpc).toBe("2.0");
                expect(stub.getCall(0).args[0].method).toBe("mymethod");
                expect(stub.getCall(0).args[0].params).toBe(params);
                expect(stub.getCall(0).args[0].id).toExist();

                done();
            });
        });
    });
});