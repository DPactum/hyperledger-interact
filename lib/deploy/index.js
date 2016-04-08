var YAML = require("yamljs");
var pathUtil = require("path");
var Client = require("../rpc-client");
var rpc;

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
            "path": args.path,
            // TODO: Replace default with something meaningful
            "name": args.name || "chaincode_name"
        }
    };

    if (options.chaincode.namespace) {
        params.chaincodeID.path = options.chaincode.namespace + params.chaincodeID.path;
    }

    if (args.constructorArgs) {
        params.ctorMsg = args.constructorArgs;
        params.ctorMsg.function = "init";
    }

    if (args.secureContext || options.secureContext) {
        params.secureContext = args.secureContext || options.secureContext;
    }

    rpc.call("deploy", params, function (err, response) {
        console.log(err || response);
        next(err, response);
    });
}

module.exports = {
    config: config,
    deploy: deploy
};

/*
    Example deploy call:
 deploy({
 path: "$GOPATH/src/github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02",
 "constructorArgs": { "args": ["a", "100", "b", "200"] }

 }, function (err, response) {
 console.log("done");
 });

 */