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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImgixFixedSchemaFieldConfig = exports.createImgixFixedFieldConfig = exports.DEFAULT_FIXED_WIDTH = void 0;
var Do_1 = require("fp-ts-contrib/lib/Do");
var function_1 = require("fp-ts/function");
var T = __importStar(require("fp-ts/Task"));
var TE = __importStar(require("fp-ts/TaskEither"));
var createExternalHelper_1 = require("../../common/createExternalHelper");
var fpTsUtils_1 = require("../../common/fpTsUtils");
var utils_1 = require("../../common/utils");
var graphqlTypes_1 = require("./graphqlTypes");
var objectBuilders_1 = require("./objectBuilders");
var resolveDimensions_1 = require("./resolveDimensions");
exports.DEFAULT_FIXED_WIDTH = 8192;
var createImgixFixedFieldConfig = function (_a) {
    var imgixClient = _a.imgixClient, resolveUrl = _a.resolveUrl, _b = _a.resolveWidth, resolveWidth = _b === void 0 ? function () { return undefined; } : _b, _c = _a.resolveHeight, resolveHeight = _c === void 0 ? function () { return undefined; } : _c, cache = _a.cache, defaultParams = _a.defaultParams, type = _a.type, paramsInputType = _a.paramsInputType;
    return ({
        type: type,
        description: "Should be used to generate fixed-width images (i.e. the size of the image doesn't change when the size of the browser changes, and are \"fixed\"). Returns data compatible with gatsby-image. Instead of accessing this data directly, the GatsbySourceImgixFixed fragment should be used. See the project's README for more information.",
        args: {
            width: {
                type: 'Int',
                description: "The fixed image width to render, in px.",
                defaultValue: exports.DEFAULT_FIXED_WIDTH,
            },
            height: {
                type: 'Int',
                description: "The fixed image height to render, in px.",
            },
            quality: {
                type: 'Int',
                description: "The image quality to use for compression. Range: 0-100, with 100 being highest quality. This setting is not recommended as the quality is already optimized by decreasing quality as the dpr increases to reduce image size while retaining visual quality.",
            },
            imgixParams: {
                type: paramsInputType,
                description: "The imgix parameters (transformations) to apply to the image. The full set of imgix params can be explored here: https://docs.imgix.com/apis/url",
                defaultValue: {},
            },
            placeholderImgixParams: {
                type: paramsInputType,
                description: "Any imgix parameters to use only for the blur-up/placeholder image. The full set of imgix params can be explored here: https://docs.imgix.com/apis/url",
                defaultValue: {},
            },
        },
        resolve: function (rootValue, args) {
            return function_1.pipe(Do_1.Do(TE.taskEither)
                .let('rootValue', rootValue)
                .let('modifiedArgs', __assign(__assign({}, args), { imgixParams: graphqlTypes_1.unTransformParams(args.imgixParams) }))
                .sequenceSL(function (_a) {
                var rootValue = _a.rootValue;
                return ({
                    url: utils_1.resolveUrlFromSourceData(resolveUrl)(rootValue),
                    manualWidth: function_1.pipe(rootValue, utils_1.taskEitherFromSourceDataResolver(resolveWidth), fpTsUtils_1.TaskOptionFromTE, TE.fromTask),
                    manualHeight: function_1.pipe(rootValue, utils_1.taskEitherFromSourceDataResolver(resolveHeight), fpTsUtils_1.TaskOptionFromTE, TE.fromTask),
                });
            })
                .bindL('dimensions', function (_a) {
                var url = _a.url, manualWidth = _a.manualWidth, manualHeight = _a.manualHeight;
                return resolveDimensions_1.resolveDimensions({
                    url: url,
                    manualHeight: manualHeight,
                    manualWidth: manualWidth,
                    cache: cache,
                    client: imgixClient,
                });
            })
                .return(function (_a) {
                var url = _a.url, modifiedArgs = _a.modifiedArgs, _b = _a.dimensions, width = _b.width, height = _b.height;
                return objectBuilders_1.buildImgixFixed({
                    client: imgixClient,
                    url: url,
                    sourceWidth: width,
                    sourceHeight: height,
                    args: modifiedArgs,
                    defaultParams: defaultParams,
                    defaultPlaceholderParams: {}, // TODO: implement
                });
            }), TE.getOrElseW(function () { return T.of(undefined); }))();
        },
    });
};
exports.createImgixFixedFieldConfig = createImgixFixedFieldConfig;
exports.createImgixFixedSchemaFieldConfig = createExternalHelper_1.createExternalHelper(exports.createImgixFixedFieldConfig);
//# sourceMappingURL=createImgixFixedFieldConfig.js.map