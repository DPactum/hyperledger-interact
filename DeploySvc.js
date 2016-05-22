var YAML = require("yamljs");
var pathUtil = require("path");
var Client = require("./RpcClient");
var rpc;
var fs = require("fs");
var options = {};

function config(yamlPath, next) {
    yamlPath = yamlPath || (pathUtil.dirname(require.main.filename) + "/chaincode-deploy.yaml");
    options = YAML.load(yamlPath, next);

    options.chaincode = options.chaincode || {};
    options.rpcsettings = options.rpcsettings || {};
    rpc = new Client(options.rpcsettings);
}

config();

function deploy(args, next) {
    if (!args.path) {
        return next({message: "args.path is required."})
    }

    var params = {
        type: 1,
        chaincodeID: {
            "path": args.path
        }
    };

    if (options.env === 'DEV') {
        // TODO: Replace default with something meaningful
        params.chaincodeID.name = args.name || "chaincode_name";
    }

    if (options.chaincode.namespace) {
        console.log("Adding Namespace...");
        params.chaincodeID.path = pathUtil.join(options.chaincode.namespace, params.chaincodeID.path);
    }

    if (args.constructorArgs) {
        params.ctorMsg = {};
        params.ctorMsg.args = args.constructorArgs;
        params.ctorMsg.function = "init";
    }

    if (args.secureContext || options.secureContext) {
        params.secureContext = args.secureContext || options.secureContext;
    }

    rpc.call("deploy", params, next);
}

function updateNameservice(params, next) {
    if (!params) {
        return next({message: "args is required."})
    }

    if (!params.serviceName) {
        return next({message: "args.serviceName is required."})
    }

    if (!params.serviceAddress) {
        return next({message: "args.serviceAddress is required."})
    }
    var filePath = pathUtil.join(process.env.GOPATH, 'src/github.com/dpactum/NameService/nameservice-address.txt');
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, response) {
        if (err) {
            return next(err);
        }

        var args = { type: 1, chaincodeID: { name: response }, ctorMsg: { function: "update", args: [params.serviceName, params.serviceAddress]}};
        console.log("the address of the IOC is: ", response);
        rpc.call("invoke", args, next);
    });
}

module.exports = {
    config: config,
    deploy: deploy,
    updateNameservice: updateNameservice
};


/*
 //    Example deploy call:
 deploy({
 //path: "$GOPATH/src/github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02",
 path: "github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02",
 "constructorArgs": { "args": ["a", "100", "b", "200"] }

 }, function (err, response) {
 console.log(err || response);

 rpc.call("query", {
 "type": 1,
 "chaincodeID":{
 "name": 'ad4d3bb253afe9ccc3c2c455bce2b980b90fb75e96fbf2969900dc1e8f0ed6a787be124d5dce775da9155f1024a77259143bb56aada3623fd112d743acd537b4'
 },
 "ctorMsg": {
 "function":"query",
 "args":["b"]
 }
 }, function (err, response) {
 console.log(err || response);
 });
 });
 */

