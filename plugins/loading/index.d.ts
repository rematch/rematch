/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var cntState = {
    global: 0,
    models: {},
    effects: {},
};
var createLoadingAction = function (converter, i) { return function (state, _a) {
    var name = _a.name, action = _a.action;
    var _b, _c, _d;
    cntState.global += i;
    cntState.models[name] += i;
    cntState.effects[name][action] += i;
    return __assign({}, state, { global: converter(cntState.global), models: __assign({}, state.models, (_b = {}, _b[name] = converter(cntState.models[name]), _b)), effects: __assign({}, state.effects, (_c = {}, _c[name] = __assign({}, state.effects[name], (_d = {}, _d[action] = converter(cntState.effects[name][action]), _d)), _c)) });
}; };
var validateConfig = function (config) {
    if (config.name && typeof config.name !== 'string') {
        throw new Error('loading plugin config name must be a string');
    }
    if (config.asNumber && typeof config.asNumber !== 'boolean') {
        throw new Error('loading plugin config asNumber must be a boolean');
    }
    if (config.whitelist && !Array.isArray(config.whitelist)) {
        throw new Error('loading plugin config whitelist must be an array of strings');
    }
    if (config.blacklist && !Array.isArray(config.blacklist)) {
        throw new Error('loading plugin config blacklist must be an array of strings');
    }
    if (config.whitelist && config.blacklist) {
        throw new Error('loading plugin config cannot have both a whitelist & a blacklist');
    }
};
var index = (function (config) {
    if (config === void 0) { config = {}; }
    validateConfig(config);
    var loadingModelName = config.name || 'loading';
    var converter = config.asNumber === true ? function (cnt) { return cnt; } : function (cnt) { return cnt > 0; };
    var loading = {
        name: loadingModelName,
        reducers: {
            hide: createLoadingAction(converter, -1),
            show: createLoadingAction(converter, 1),
        },
        state: __assign({}, cntState),
    };
    cntState.global = 0;
    loading.state.global = converter(cntState.global);
    return {
        config: {
            models: {
                loading: loading,
            },
        },
        onModel: function (_a) {
            var _this = this;
            var name = _a.name;
            // do not run dispatch on "loading" model
            if (name === loadingModelName) {
                return;
            }
            cntState.models[name] = 0;
            loading.state.models[name] = converter(cntState.models[name]);
            loading.state.effects[name] = {};
            var modelActions = this.dispatch[name];
            // map over effects within models
            Object.keys(modelActions).forEach(function (action) {
                if (_this.dispatch[name][action].isEffect !== true) {
                    return;
                }
                cntState.effects[name][action] = 0;
                loading.state.effects[name][action] = converter(cntState.effects[name][action]);
                var actionType = name + "/" + action;
                // ignore items not in whitelist
                if (config.whitelist && !config.whitelist.includes(actionType)) {
                    return;
                }
                // ignore items in blacklist
                if (config.blacklist && config.blacklist.includes(actionType)) {
                    return;
                }
                // copy orig effect pointer
                var origEffect = _this.dispatch[name][action];
                // create function with pre & post loading calls
                var effectWrapper = function () {
                    var props = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        props[_i] = arguments[_i];
                    }
                    return __awaiter(_this, void 0, void 0, function () {
                        var effectResult, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    this.dispatch.loading.show({ name: name, action: action });
                                    return [4 /*yield*/, origEffect.apply(void 0, props)];
                                case 1:
                                    effectResult = _a.sent();
                                    this.dispatch.loading.hide({ name: name, action: action });
                                    return [2 /*return*/, effectResult];
                                case 2:
                                    error_1 = _a.sent();
                                    this.dispatch.loading.hide({ name: name, action: action });
                                    throw error_1;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                // replace existing effect with new wrapper
                _this.dispatch[name][action] = effectWrapper;
            });
        },
    };
});

export default index;
