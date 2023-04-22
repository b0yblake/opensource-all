"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPossibleURLsInNode = exports.transformUrlForWebProxy = exports.invariant = exports.fetchJSON = exports.fetch = exports.noop = exports.semigroupImgixUrlParams = exports.resolveUrlFromSourceData = exports.taskEitherFromSourceDataResolver = void 0;
var pipeable_1 = require("fp-ts/pipeable");
var Semigroup_1 = require("fp-ts/Semigroup");
var TE = __importStar(require("fp-ts/TaskEither"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var taskEitherFromSourceDataResolver = function (resolver, predicate) { return function (source) {
    return TE.tryCatch(function () {
        return Promise.resolve(resolver(source)).then(function (data) {
            if (data == null)
                return Promise.reject('Resolved data is null or undefined');
            var safeData = data;
            if (!predicate)
                return safeData;
            return predicate(safeData)
                ? safeData
                : Promise.reject('Resolved data is invalid.');
        });
    }, function (reason) { return new Error(String(reason)); });
}; };
exports.taskEitherFromSourceDataResolver = taskEitherFromSourceDataResolver;
var resolveUrlFromSourceData = function (resolver) { return exports.taskEitherFromSourceDataResolver(resolver, function (data) { return data != null; }); };
exports.resolveUrlFromSourceData = resolveUrlFromSourceData;
exports.semigroupImgixUrlParams = Semigroup_1.getObjectSemigroup();
var noop = function () {
    // noop
};
exports.noop = noop;
var fetch = function (url) {
    return TE.tryCatch(function () { return node_fetch_1.default(url); }, function (reason) { return new Error(String(reason)); });
};
exports.fetch = fetch;
var fetchJSON = function (url) {
    return pipeable_1.pipe(url, exports.fetch, TE.chain(function (res) { return TE.rightTask(function () { return res.json(); }); }));
};
exports.fetchJSON = fetchJSON;
function invariant(condition, msg, reporter) {
    if (!condition)
        reporter.panic("Invariant failed: " + msg);
}
exports.invariant = invariant;
var transformUrlForWebProxy = function (url, domain) {
    var instance = new URL("https://" + domain);
    instance.pathname = encodeURIComponent(url);
    return instance.toString();
};
exports.transformUrlForWebProxy = transformUrlForWebProxy;
function isURL(str) {
    var pattern = new RegExp('\\/\\/' + // the first two slashes after the protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
}
var findPossibleURLsInNode = function (node, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth > 5) {
        return [];
    }
    return Object.entries(node).reduce(function (p, _a) {
        var key = _a[0], value = _a[1];
        if (typeof value === 'string' && isURL(value)) {
            return __spreadArray(__spreadArray([], p), [{ path: key, value: value }]);
        }
        if (typeof value === 'object' && value != null) {
            return __spreadArray(__spreadArray([], p), exports.findPossibleURLsInNode(value, depth + 1).map(function (_a) {
                var path = _a.path, value = _a.value;
                return ({
                    path: key + "." + path,
                    value: value,
                });
            }));
        }
        return p;
    }, []);
};
exports.findPossibleURLsInNode = findPossibleURLsInNode;
//# sourceMappingURL=utils.js.map