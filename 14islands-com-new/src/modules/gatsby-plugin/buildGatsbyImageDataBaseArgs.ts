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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGatsbyImageDataBaseArgs = void 0;
var js_core_1 = __importDefault(require("@imgix/js-core"));
var generateImageSource = function (client) { return function (imageName, width, height, format, fit, opts) {
    if (opts === void 0) { opts = {}; }
    var src = client.buildURL(imageName, __assign(__assign({}, (typeof opts.imgixParams === 'object' && opts.imgixParams)), { w: width, h: height }));
    return { width: width, height: height, format: 'auto', src: src };
}; };
var buildGatsbyImageDataBaseArgs = function (_a) {
    var _b;
    var resolverArgs = _a.resolverArgs, url = _a.url, _c = _a.dimensions, width = _c.width, height = _c.height, defaultParams = _a.defaultParams, imgixClient = _a.imgixClient;
    return (__assign(__assign({}, resolverArgs), { pluginName: "@imgix/gatsby", filename: url, sourceMetadata: { width: width, height: height, format: 'auto' }, 
        // TODO: use breakpoints helper from gatsby-plugin-image hook
        breakpoints: (_b = resolverArgs.breakpoints) !== null && _b !== void 0 ? _b : js_core_1.default.targetWidths(resolverArgs.srcSetMinWidth, resolverArgs.srcSetMaxWidth, resolverArgs.widthTolerance), formats: ['auto'], generateImageSource: generateImageSource(imgixClient), options: {
            imgixParams: __assign(__assign({}, defaultParams), resolverArgs.imgixParams),
        } }));
};
exports.buildGatsbyImageDataBaseArgs = buildGatsbyImageDataBaseArgs;
//# sourceMappingURL=buildGatsbyImageDataBaseArgs.js.map