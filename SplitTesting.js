/*globals JsUtils, define*/
/*jshint unused: false*/
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['JsUtils'], function (JsUtils) {
            root.SplitTesting = factory(JsUtils);
            return root.SplitTesting;
        });
    } else {
        root.SplitTesting = factory(root.JsUtils);
    }
}(this, function (JsUtils) {
    'use strict';

    var CSS_TEST_A = 'splitTestA',
        CSS_TEST_B = 'splitTestB',
        URL_CLICK  = '/UI/SplitTesting.aspx/Success',
        URL_VIEW   = '/UI/SplitTesting.aspx/ViewedSuccess',

        toString = Object.prototype.toString,
        logView = logEvent(URL_VIEW),
        logClick = logEvent(URL_CLICK),
        undefined;

    function invokeIfDef(fn) {
        if (isFunction(fn)) {
            return fn();
        }
        return;
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function _assert(pred, msg) {
        if (!pred) throw new Error(msg);
    }

    function existy(obj) {
        /*jshint eqnull:true*/
        return obj != null;
    }

    // test if body has class className
    // returns false or className
    function bodyHasClass(className) {
        return JsUtils.hasClass(document.body, className) && className;
    }

    function getExperimentGroup() {
        return bodyHasClass(CSS_TEST_A) || bodyHasClass(CSS_TEST_B);
    }

    function whichSplitTest(whichGroup) {
        return function () {
            return whichGroup === getExperimentGroup();
        };
    }

    function isSplitTest() {
        return !!getExperimentGroup();
    }

    function logEvent(endpoint) {
        var postOptions = {};

        return function (id, message) {
            _assert(existy(id) && existy(message), 'logEvent() id and message required');
            var data = {
                'splitTestingId': id,
                'splitTestingDescription': message
            };

            JsUtils.post(endpoint, data, postOptions);
        };
    }

    function setupExperiment(id, target, viewMessage, clickMessage) {
        _assert(isFunction(target), 'setupExperiment(): target needs to be a function');
        logView(id, viewMessage);
        JsUtils.addEvent('click', target(), function () {
            logClick(id, clickMessage);
        });
    }

    function init(config) {
        var i, exp, target;

        config = config || {};

        if (!isSplitTest() ||
                invokeIfDef(config.setupCondition) ||
                invokeIfDef(config.runTestIf)) {
            return;
        }

        // throw if missing required param
        _assert(toString.call(config.id) === '[object Number]', 'init() id required');
        _assert(isFunction(config.target), 'init() target needs to be a function');
        _assert(toString.call(config.view) === '[object String]', 'init() view message is a required string');
        _assert(toString.call(config.click) === '[object String]', 'init() click message is a required string')

        invokeIfDef(config.setup);
        setupExperiment(config.id, config.target, config.view, config.click);
    }

    return {
        isSplitTest: isSplitTest,
        isSplitTestA: whichSplitTest(CSS_TEST_A),
        isSplitTestB: whichSplitTest(CSS_TEST_B),

        logClick: logClick,
        logView: logView,

        init: init,

        util: {
            setupExperiment: setupExperiment,
            _assert: _assert,
            existy: existy
        },

        // legacy API
        isSplitTestingEnabled: function () {
            return this.isSplitTest();
        },

        logSuccess: function (id, msg) {
            return this.logClick(id, msg);
        },

        logViewedSuccess: function (id, msg) {
            return this.logView(id, msg);
        }
    };
}));

