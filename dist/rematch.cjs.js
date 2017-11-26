'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var redux = _interopDefault(require('redux'));

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var devtools = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */

exports.composeEnhancers = function (devtoolOptions) {
    if (devtoolOptions === void 0) { devtoolOptions = {}; }
    /* istanbul ignore next */
    return (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
        : redux.compose;
};

});

unwrapExports(devtools);
var devtools_1 = devtools.composeEnhancers;

var reducers = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-underscore-dangle: 0 */

var combine = redux.combineReducers;
var allReducers = {};
// get reducer for given dispatch type
// pass in (state, payload)
exports.getReducer = function (reducer, initialState) {
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        if (typeof reducer[action.type] === 'function') {
            return reducer[action.type](state, action.payload);
        }
        return state;
    };
};
// creates a reducer out of "reducers" keys and values
exports.createModelReducer = function (_a) {
    var name = _a.name, reducers = _a.reducers, state = _a.state;
    var modelReducers = Object.keys(reducers || {}).reduce(function (acc, reducer) {
        acc[name + "/" + reducer] = reducers[reducer];
        return acc;
    }, {});
    return _b = {}, _b[name] = exports.getReducer(modelReducers, state), _b;
    var _b;
};
// uses combineReducers to merge new reducers into existing reducers
exports.mergeReducers = function (nextReducers) {
    if (nextReducers === void 0) { nextReducers = {}; }
    allReducers = __assign({}, allReducers, nextReducers);
    if (!Object.keys(allReducers).length) {
        return function (state) { return state; };
    }
    return combine(allReducers);
};
exports.initReducers = function (models, redux$$2) {
    // optionally overwrite combineReducers on init
    combine = redux$$2.combineReducers || combine;
    // combine existing reducers, redux.reducers & model.reducers
    exports.mergeReducers(models.reduce(function (reducers, model) { return (__assign({}, exports.createModelReducer(model), reducers)); }, redux$$2.reducers || {}));
};

});

unwrapExports(reducers);
var reducers_1 = reducers.getReducer;
var reducers_2 = reducers.createModelReducer;
var reducers_3 = reducers.mergeReducers;
var reducers_4 = reducers.initReducers;

var store_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-underscore-dangle: 0 */




var store = null;
// access file scoped store
exports.getStore = function () { return store; };
exports.initStore = function (_a) {
    var redux$$1 = _a.redux;
    var initialState = typeof redux$$1.initialState === 'undefined' ? {} : redux$$1.initialState;
    var createStore = redux$$1.createStore || redux.createStore;
    var rootReducer = reducers.mergeReducers();
    var middlewareList = core.pluginMiddlewares.concat((redux$$1.middlewares || []));
    var middlewares = redux.applyMiddleware.apply(void 0, middlewareList);
    var enhancers = devtools.composeEnhancers(redux$$1.devtoolOptions)(middlewares);
    store = createStore(rootReducer, initialState, enhancers);
};
exports.createReducersAndUpdateStore = function (model) {
    store.replaceReducer(reducers.mergeReducers(reducers.createModelReducer(model)));
};

});

unwrapExports(store_1);
var store_2 = store_1.getStore;
var store_3 = store_1.initStore;
var store_4 = store_1.createReducersAndUpdateStore;

var core = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.modelHooks = [];
exports.pluginMiddlewares = [];
exports.preStore = function (plugins) {
    plugins.forEach(function (plugin) {
        if (plugin.middleware) {
            exports.pluginMiddlewares.push(plugin.middleware);
        }
        if (plugin.onModel) {
            exports.modelHooks.push(plugin.onModel);
        }
    });
};
exports.postStore = function (plugins) {
    plugins.forEach(function (plugin) {
        if (plugin.onStoreCreated) {
            plugin.onStoreCreated(store_1.getStore);
        }
    });
};

});

unwrapExports(core);
var core_1 = core.modelHooks;
var core_2 = core.pluginMiddlewares;
var core_3 = core.preStore;
var core_4 = core.postStore;

var validate_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
/* istanbul ignore next */
var validate = function (validations) {
    validations.forEach(function (validation) {
        var condition = validation[0];
        var errorMessage = validation[1];
        if (condition) {
            throw new Error(errorMessage);
        }
    });
};
exports.default = validate;

});

unwrapExports(validate_1);

var model = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



var addModel = function (model) {
    validate_1.default([
        [!model, 'model config is required'],
        [
            !model.name || typeof model.name !== 'string',
            'model "name" [string] is required',
        ],
        [model.state === undefined, 'model "state" is required'],
    ]);
    // run plugin model subscriptions
    core.modelHooks.forEach(function (modelHook) { return modelHook(model); });
};
// main model import method
// adds config.models
exports.initModelHooks = function (models) {
    models.forEach(function (model) { return addModel(model); });
};
// allows merging of models dynamically
// model(model)
exports.createModel = function (model) {
    addModel(model);
    // add model reducers to redux store
    store_1.createReducersAndUpdateStore(model);
};

});

unwrapExports(model);
var model_1 = model.initModelHooks;
var model_2 = model.createModel;

var dispatch = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
};
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });
var storeDispatch;
var dispatchPlugin = {
    expose: {
        createDispatcher: function (modelName, reducerName) {
            return function (payload, meta) { return __awaiter(_this, void 0, void 0, function () {
                var action;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            action = { type: modelName + "/" + reducerName };
                            if (payload) {
                                action.payload = payload;
                            }
                            if (meta) {
                                action.meta = meta;
                            }
                            return [4 /*yield*/, storeDispatch(action)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); };
        },
        dispatch: function (action) { return storeDispatch(action); },
    },
    init: function (_a) {
        var dispatch = _a.dispatch, createDispatcher = _a.createDispatcher, validate = _a.validate;
        return ({
            onStoreCreated: function (getStore) {
                storeDispatch = getStore().dispatch;
            },
            onModel: function (model) {
                dispatch[model.name] = {};
                Object.keys(model.reducers || {}).forEach(function (reducerName) {
                    validate([
                        [
                            reducerName.match(/\//),
                            "Invalid reducer name (" + model.name + "/" + reducerName + ")",
                        ],
                        [
                            typeof model.reducers[reducerName] !== 'function',
                            "Invalid reducer (" + model.name + "/" + reducerName + "). Must be a function",
                        ],
                    ]);
                    dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName);
                });
            },
        });
    },
};
exports.default = dispatchPlugin;

});

unwrapExports(dispatch);

var effects = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
};
var _this = commonjsGlobal;
Object.defineProperty(exports, "__esModule", { value: true });
var effectsPlugin = {
    expose: {
        effects: {},
    },
    init: function (_a) {
        var effects = _a.effects, dispatch = _a.dispatch, createDispatcher = _a.createDispatcher, validate = _a.validate;
        return ({
            onModel: function (model) {
                Object.keys(model.effects || {}).forEach(function (effectName) {
                    validate([
                        [
                            !!effectName.match(/\//),
                            "Invalid effect name (" + model.name + "/" + effectName + ")",
                        ],
                        [
                            typeof model.effects[effectName] !== 'function',
                            "Invalid effect (" + model.name + "/" + effectName + "). Must be a function",
                        ],
                    ]);
                    effects[model.name + "/" + effectName] = model.effects[effectName].bind(dispatch[model.name]);
                    // add effect to dispatch
                    // is assuming dispatch is available already... that the dispatch plugin is in there
                    dispatch[model.name][effectName] = createDispatcher(model.name, effectName);
                    // tag effects so they can be differentiated from normal actions
                    dispatch[model.name][effectName].isEffect = true;
                });
            },
            middleware: function (store) { return function (next) { return function (action) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (action.type in effects)];
                        case 1:
                            result = (_a.sent())
                                ? effects[action.type](action.payload, store.getState())
                                : next(action);
                            return [2 /*return*/, result];
                    }
                });
            }); }; }; },
        });
    },
};
exports.default = effectsPlugin;

});

unwrapExports(effects);

var plugins = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


var corePlugins = [
    dispatch.default,
    effects.default,
];
exports.default = corePlugins;

});

unwrapExports(plugins);

var buildPlugins = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (plugins, exposed) { return plugins.reduce(function (all, _a) {
    var init = _a.init;
    if (init) {
        var plugin = init(exposed);
        exposed.validate([
            [
                plugin.onStoreCreated && typeof plugin.onStoreCreated !== 'function',
                'Plugin onStoreCreated must be a function',
            ],
            [
                plugin.onModel && typeof plugin.onModel !== 'function',
                'Plugin onModel must be a function',
            ],
            [
                plugin.middleware && typeof plugin.middleware !== 'function',
                'Plugin middleware must be a function',
            ],
        ]);
        all.push(plugin);
    }
    return all;
}, []); };

});

unwrapExports(buildPlugins);

var getExposed = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });

exports.default = function (plugins) { return plugins.reduce(function (exposed, plugin) { return (__assign({}, exposed, (plugin.expose || {}))); }, {
    validate: validate_1.default,
}); };

});

unwrapExports(getExposed);

var getModels = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var captureModels = function (models) {
    if (models === void 0) { models = {}; }
    return Object.keys(models).map(function (name) { return (__assign({ name: name }, models[name])); });
};
exports.default = function (config) { return captureModels(config.models).slice(); };

});

unwrapExports(getModels);

var isObject = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (obj) { return (Array.isArray(obj) || typeof obj !== 'object'); };

});

unwrapExports(isObject);

var mergeConfig = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// merges two config objects
// assumes configs are already validated
exports.mergeConfig = function (c1, c2) {
    if (c1 === void 0) { c1 = {}; }
    if (c2 === void 0) { c2 = {}; }
    c1.redux = c1.redux || {};
    c2.redux = c2.redux || {};
    var config = {
        models: {},
        plugins: [],
        redux: {},
    };
    // models
    if (c1.models) {
        config.models = Object.keys(c1.models).reduce(function (a, b) {
            var model = c1.models[b];
            return __assign((_a = {}, _a[model.name] = model, _a), a);
            var _a;
        }, c2.models || {});
    }
    // plugins
    config.plugins = c1.plugins || [];
    if (c2.plugins) {
        c2.plugins.forEach(function (plugin) {
            if (!config.plugins.includes(plugin)) {
                config.plugins.push(plugin);
            }
        });
    }
    // redux
    // initialState
    config.redux.initialState = c1.redux.initialState || {};
    if (c2.redux.initialState) {
        config.redux.initialState = __assign({}, c1.redux.initialState, c2.redux.initialState);
    }
    config.redux.reducers = c1.redux.reducers || {};
    if (c2.redux.reducers) {
        config.redux.reducers = __assign({}, c1.redux.reducers, c2.redux.reducers);
    }
    // Note: this pattern does not allow for multiple overwrites
    // of the same name. TODO: throw an error, or compose functions
    config.redux.combineReducers = c2.redux.combineReducers || c1.redux.combineReducers;
    config.redux.createStore = c2.redux.createStore || c1.redux.createStore;
    return config;
};
exports.default = function (config) { return (config.plugins || []).reduce(function (a, b) {
    if (b.config) {
        b.config.redux = b.config.redux || {};
        return exports.mergeConfig(a, b.config);
    }
    return a;
}, config); };

});

unwrapExports(mergeConfig);
var mergeConfig_1 = mergeConfig.mergeConfig;

var init_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });











var validateConfig = function (config) {
    return validate_1.default([
        [
            config.plugins && !Array.isArray(config.plugins),
            'init config.plugins must be an array',
        ],
        [
            config.models && isObject.default(config.models),
            'init config.models must be an object',
        ],
        [
            config.redux.middlewares && !Array.isArray(config.redux.middlewares),
            'init config.redux.middlewares must be an array',
        ],
        [
            config.redux.reducers && isObject.default(config.redux.reducers),
            'init config.redux.reducers must be an object',
        ],
        [
            config.redux.combineReducers && typeof config.redux.combineReducers !== 'function',
            'init config.redux.combineReducers must be a function',
        ],
        [
            config.redux.createStore && typeof config.redux.createStore !== 'function',
            'init config.redux.createStore must be a function',
        ],
    ]);
};
var init = function (initConfig) {
    if (initConfig === void 0) { initConfig = {}; }
    initConfig.redux = initConfig.redux || {};
    validateConfig(initConfig);
    var config = mergeConfig.default(initConfig);
    var pluginConfigs = plugins.default.concat(config.plugins || []);
    var exposed = getExposed.default(pluginConfigs);
    var plugins$$1 = buildPlugins.default(pluginConfigs, exposed);
    // preStore: middleware, model hooks
    core.preStore(plugins$$1);
    // collect all models
    var models = getModels.default(config);
    model.initModelHooks(models);
    reducers.initReducers(models, config.redux);
    // create a redux store with initialState
    // merge in additional extra reducers
    store_1.initStore(config);
    core.postStore(plugins$$1);
};
exports.default = init;

});

unwrapExports(init_1);

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.init = init_1.default;

exports.model = model.createModel;


exports.getStore = store_1.getStore;
var dispatch$$1 = dispatch.default.expose.dispatch;
exports.dispatch = dispatch$$1;
exports.default = {
    dispatch: dispatch$$1,
    getStore: store_1.getStore,
    init: init_1.default,
    model: model.createModel,
};

});

var index = unwrapExports(lib);
var lib_1 = lib.init;
var lib_2 = lib.model;
var lib_3 = lib.getStore;
var lib_4 = lib.dispatch;

exports['default'] = index;
exports.init = lib_1;
exports.model = lib_2;
exports.getStore = lib_3;
exports.dispatch = lib_4;
//# sourceMappingURL=rematch.cjs.js.map
