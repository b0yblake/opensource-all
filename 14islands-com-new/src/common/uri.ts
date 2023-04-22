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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePathE = exports.parsePath = exports.parseHostE = exports.parseHost = void 0;
var E = __importStar(require("fp-ts/Either"));
var jsuri_1 = __importDefault(require("jsuri"));
/**
 * Parse the host from a URL. Can fail - for an FP type, use parseHostE
 */
var parseHost = function (uri) { return new URL(uri).hostname; };
exports.parseHost = parseHost;
var parseHostE = function (uri) {
    return E.tryCatch(function () { return exports.parseHost(uri); }, function () { return new Error('Invalid URL'); });
};
exports.parseHostE = parseHostE;
/**
 * Parse the path from a URL. Can fail - for an FP type, use parsePathE
 */
var parsePath = function (_uri) {
    var uri = new jsuri_1.default(_uri);
    return uri.path() + uri.query();
};
exports.parsePath = parsePath;
var parsePathE = function (uri) {
    return E.tryCatch(function () { return exports.parsePath(uri); }, function () { return new Error('Invalid URL'); });
};
exports.parsePathE = parsePathE;
//# sourceMappingURL=uri.js.map