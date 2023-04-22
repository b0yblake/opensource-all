"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.createImgixURLBuilder = exports.createURLBuilderFn = exports.createImgixClient = void 0;
var js_core_1 = __importDefault(require("@imgix/js-core"));
var Do_1 = require("fp-ts-contrib/lib/Do");
var Apply_1 = require("fp-ts/Apply");
var E = __importStar(require("fp-ts/Either"));
var function_1 = require("fp-ts/function");
var uri_1 = require("./uri");
/**
 * An FP wrapper around new ImgixClient()
 * @param param0 any options that can be passed to new ImgixClient(), and also allows overriding ixlib.
 */
var createImgixClient = function (_a) {
    var ixlib = _a.ixlib, options = __rest(_a, ["ixlib"]);
    return E.tryCatch(function () {
        var client = new js_core_1.default(options);
        client.includeLibraryParam = false;
        if (ixlib) {
            client.settings.libraryParam = ixlib;
        }
        return client;
    }, function (e) { return (e instanceof Error ? e : new Error('unknown error')); });
};
exports.createImgixClient = createImgixClient;
/**
 * Used by createImgixURLBuilder, common code extracted here to avoid code duplication.
 */
var createURLBuilderFn = function (fn) { return function (options) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function_1.pipe(Do_1.Do(E.either)
        .bindL('urlParts', function () {
        if (options === null || options === void 0 ? void 0 : options.domain) {
            return E.right({
                domain: options === null || options === void 0 ? void 0 : options.domain,
                path: args[0],
            });
        }
        return Apply_1.sequenceS(E.either)({
            domain: uri_1.parseHostE(args[0]),
            path: uri_1.parsePathE(args[0]),
        });
    })
        .bindL('client', function (_a) {
        var domain = _a.urlParts.domain;
        return exports.createImgixClient(__assign(__assign({ ixlib: 'gatsbyFP' }, options), { domain: domain }));
    })
        .return(function (_a) {
        var client = _a.client, path = _a.urlParts.path;
        return client[fn].apply(client, __spreadArray([path], args.slice(1)));
    }), E.getOrElse(function (err) {
        throw err;
    }));
}; }; };
exports.createURLBuilderFn = createURLBuilderFn;
/**
 * Build a functional ImgixClient. Allows this application to use ImgixClient in a functional manner rather than a instance/class-based manner.
 * @param options options to pass to new ImgixClient, with extra options accepted by createImgixClient
 */
var createImgixURLBuilder = function (options) { return ({
    buildURL: exports.createURLBuilderFn('buildURL')(options),
    buildSrcSet: exports.createURLBuilderFn('buildSrcSet')(options),
}); };
exports.createImgixURLBuilder = createImgixURLBuilder;
//# sourceMappingURL=imgix-js-core-wrapper.js.map