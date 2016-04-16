var Client = require("./RpcClient");

var RpcObject = function(rpcobject) {
    rpcobject = rpcobject || {};
    var self = this;
    self.address = rpcobject.address || undefined;
    self.rpcArgs = rpcobject.rpcArgs;

    self.init = function (rpcArgs) {
        self.rpc = new Client(rpcArgs);
        self.rpcArgs = rpcArgs;
    };

    if (self.rpcArgs) {
        self.init(self.rpcArgs);
    }

    self.invoke = function(args, next) {
        call("invoke", args, next);
    };

    self.query = function(args, next) {
        call("query", args, next);
    };

    self.at = function(address, next) {
        self.address = address;
        if (next) {
            next();
        }
    };

    function call(method, args, next) {
        if (!self.rpc) {
            return next({message: "You must call 'init' with the JSONRPC endpoints"});
        }

        if (!args) {
            return next({message: "args are required."})
        }

        if (!args.function) {
            return next({message: "args.function is required."})
        }

        var params = {
            type: 1,
            chaincodeID: {
                name: self.address
            },
            ctorMsg: {
                function: args.function
            }
        };

        if (args.args) {
            params.ctorMsg.args = args.args;
        }

        if (args.secureContext) {
            params.secureContext = args.secureContext;
        }

        self.rpc.call(method, params, next);
    }

    return self;
};

module.exports = RpcObject;