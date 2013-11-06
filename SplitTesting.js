/*globals JsUtils*/
/*jshint unused: false*/
var SplitTesting = (function (JsUtils) {
    'use strict';

    var CSS_TEST_A = 'splitTestA',
        CSS_TEST_B = 'splitTestB',
        URL_CLICK  = '/UI/SplitTesting.aspx/Success',
        URL_VIEW   = '/UI/SplitTesting.aspx/ViewedSuccess';

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
                'splitTestId': id,
                'splitTestingDescription': message
            };

            JsUtils.post(endpoint, data, postOptions);
        };
    }

    function init(config) {
        var c = config || {}
            i, exp;

        if (!isSplitTest() ||
                isFunction(c.setupCondition) && !c.setupCondition() ||
                isFunction(c.runTestIf) && !c.runTestIf()) {
            return;
        }

        for (i = c.experiment.length - 1; i >= 0; i--) {
            exp = c.experiment[i];
            _assert(!isFunction(exp.target));
            
            if (isFunction(exp.setup)) {
                exp.setup();
            }
            logView();
            JsUtils.addEvent('click', logClick);
        };
    }

    return {
        isSplitTest: isSplitTest,
        isSplitTestA: whichSplitTest(CSS_TEST_A),
        isSplitTestB: whichSplitTest(CSS_TEST_B),

        logClick: logEvent(URL_CLICK),
        logView: logEvent(URL_VIEW),

        init: init,

        util: {
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
}(JsUtils));
