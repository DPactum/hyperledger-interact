var rpc = require("node-json-rpc");
var uuid = require("node-uuid");

var Client = function(options) {
    var self = this;
    validOptions(options);

    self.client = new rpc.Client(options);
    self.options = options;
    self.options.jsonrpc = options.jsonrpc || "2.0";
    var requestId = 0;
    self.call = function (method, params, callback) {
        var next = callback;
        var _params = params;

        if (typeof params === "function" ) {
            next = params;
            _params = undefined;
        }

        if (!method) {
            return next({message: "method is required."})
        }
        
        var rpcRequest = {
            "jsonrpc": self.options.jsonrpc,
            "method": method,
            "params": _params,
            "id": requestId++
        };

        self.client.call(rpcRequest, next);
    };

    function validOptions(checkOptions) {
        if (!checkOptions) {
            throw new Error("options are required");
        }
        if (!checkOptions.host) {
            throw new Error("options.host is required.");
        }
        if (!checkOptions.port) {
            throw new Error("options.port is required.");
        }
        if (!checkOptions.path) {
            throw new Error("options.path is required.");
        }
    }

    return self;
};

module.exports = Client;