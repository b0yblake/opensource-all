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
exports.ImgixPlaceholderType = exports.gatsbySourceImgixUrlFieldType = exports.unTransformParams = exports.createImgixFixedType = exports.getImgixFluidType = exports.createImgixFluidType = exports.ImgixParamsInputType = void 0;
var camel_case_1 = require("camel-case");
var parameters_json_1 = __importDefault(require("imgix-url-params/dist/parameters.json"));
var createImgixBase64FieldConfig_1 = require("./createImgixBase64FieldConfig");
var ImgixParamsInputType = function (_a) {
    var name = _a.name;
    return ({
        name: name,
        fields: Object.keys(parameters_json_1.default.parameters).reduce(function (fields, param) {
            var spec = parameters_json_1.default.parameters[param];
            // The param name is camel-cased here to appease the GraphQL field
            // requirements. This will need to be reversed with param-case when the
            // URL is constructed in `buildImgixUrl`.
            var name = camel_case_1.camelCase(param);
            var expects = spec.expects;
            var expectsTypes = Array.from(new Set(expects.map(function (expect) { return expect.type; })));
            var type = expectsTypes.every(function (type) { return type === 'integer'; })
                ? 'Int'
                : expectsTypes.every(function (type) {
                    return type === 'integer' || type === 'unit_scalar' || type === 'number';
                })
                    ? 'Float'
                    : expectsTypes.every(function (type) { return type === 'boolean'; })
                        ? 'Boolean'
                        : 'String';
            fields[name] = {
                type: type,
                description: spec.short_description +
                    // Ensure the description ends with a period.
                    (spec.short_description.slice(-1) === '.' ? '' : '.'),
            };
            var field = fields[name];
            // Add the default value as part of the description. Setting it as a
            // GraphQL default value will automatically assign it in the final URL.
            // Doing so would result in a huge number of unwanted params.
            if ('default' in spec)
                field.description =
                    field.description + (" Default: `" + spec.default + "`.");
            // Add Imgix documentation URL as part of the description.
            if ('url' in spec)
                field.description = field.description + (" [See docs](" + spec.url + ").");
            // Create aliased fields.
            if ('aliases' in spec)
                for (var _i = 0, _a = spec.aliases; _i < _a.length; _i++) {
                    var alias = _a[_i];
                    fields[camel_case_1.camelCase(alias)] = __assign(__assign({}, field), { description: "Alias for `" + name + "`." });
                }
            return fields;
        }, {}),
    });
};
exports.ImgixParamsInputType = ImgixParamsInputType;
var createBase64ConfigWithResolver = function (cache) {
    return createImgixBase64FieldConfig_1.createImgixBase64FieldConfig({
        resolveUrl: function (obj) { return obj.base64; },
        cache: cache,
    });
};
var createImgixFluidType = function (_a) {
    var cache = _a.cache, name = _a.name;
    return ({
        name: name,
        fields: {
            base64: createBase64ConfigWithResolver(cache),
            src: { type: 'String!' },
            srcSet: { type: 'String!' },
            srcWebp: { type: 'String!' },
            srcSetWebp: { type: 'String!' },
            sizes: { type: 'String!' },
            aspectRatio: { type: 'Float!' },
        },
    });
};
exports.createImgixFluidType = createImgixFluidType;
var fluidType;
var getImgixFluidType = function (args) {
    if (!fluidType) {
        fluidType = exports.createImgixFluidType.apply(void 0, args);
    }
    return fluidType;
};
exports.getImgixFluidType = getImgixFluidType;
var createImgixFixedType = function (_a) {
    var name = _a.name, cache = _a.cache;
    return ({
        name: name,
        fields: {
            base64: createBase64ConfigWithResolver(cache),
            src: { type: 'String!' },
            srcSet: { type: 'String!' },
            srcWebp: { type: 'String!' },
            srcSetWebp: { type: 'String!' },
            sizes: { type: 'String!' },
            width: { type: 'Int!' },
            height: { type: 'Int!' },
        },
    });
};
exports.createImgixFixedType = createImgixFixedType;
var unTransformParams = function (params) {
    // look for uppercase chars, replace with lowercase + `-`
    return Object.entries(params).reduce(function (p, _a) {
        var _b;
        var k = _a[0], v = _a[1];
        var transformedKey = k.replace(/[A-Z]/, function (c) { return "-" + c.toLowerCase(); });
        return __assign(__assign({}, p), (_b = {}, _b[transformedKey] = v, _b));
    }, {});
};
exports.unTransformParams = unTransformParams;
exports.gatsbySourceImgixUrlFieldType = 'String';
var ImgixPlaceholderType = function (name) { return ({
    name: name,
    values: {
        DOMINANT_COLOR: { value: "dominantColor" },
        BLURRED: { value: "blurred" },
        NONE: { value: "none" },
    },
}); };
exports.ImgixPlaceholderType = ImgixPlaceholderType;
//# sourceMappingURL=graphqlTypes.js.map