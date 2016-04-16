var expect = require("expect");
var sinon = require("sinon");
var rewire = require("rewire");
var svc = rewire("../DeploySvc");
var yaml = svc.__get__("YAML");
var rpc = { call: function () {

}};
var client = function () {
    return rpc;
};
svc.__set__("Client", client);
var rpc = svc.__set__("rpc", rpc);

describe("DeploySvc", function () {
    var yamlMock, rpcMock, ClientMock;

    beforeEach(function () {
        rpcMock = sinon.mock(rpc);
        yamlMock = sinon.mock(yaml);
    });

    afterEach(function () {
        rpcMock.verify();
        rpcMock.restore();
        yamlMock.verify();
        yamlMock.restore();
    });

    function defaultSettings() {
        yamlMock.expects("load")
            .returns({
                chaincode: {},
                rpcsettings: {}
            });
    }

    describe("loadConfig", function () {
        it("should map the correct default values", function (done) {
            var opts = {
                chaincode: {"Test": "Test"},
                rpcsettings: {"rpc": "rpc"}
            };

            yamlMock.expects("load")
                .returns(opts);

            svc.loadConfig();
            expect(svc.options.chaincode).toBe(opts.chaincode);
            expect(svc.options.rpcsettings).toBe(opts.rpcsettings);

            done();
        });

        it("should map custom values", function (done) {
            var opts = {
                chaincode: {"Test": "Test2"},
                rpcsettings: {"rpc": "rpc2"}
            };

            svc.config(opts);

            expect(svc.options.chaincode).toBe(opts.chaincode);
            expect(svc.options.rpcsettings).toBe(opts.rpcsettings);

            done();
        });
    });

    describe("deploy", function () {
        it("should add name in DEV mode");

        it("should add namespace if it exists");

        it("should add the ctorMsg if constructorArgs exists");

        it("should add secure context if secureContext exists");

        it("should fail if path is missing");

        it("should set the default args", function (done) {
            defaultSettings();
            var stub = rpcMock.expects("call");
            var args = {
                path: "My Path"
            };

            stub.callsArgWith(2, null, {});

            svc.deploy(args, function (err, response) {
                var params = stub.getCall(0).args[1];
                var func = stub.getCall(0).args[0];
                expect(func).toBe("deploy");
                expect(params.type).toBe(1);
                expect(params.chaincodeID).toBeTruthy();
                expect(params.chaincodeID.path).toBeTruthy(args.path);

                done();
            });
        });
    });
});