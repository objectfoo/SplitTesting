/*globals JsUtils*/
/*jshint unused: false*/
var SplitTesting = (function (JsUtils) {
    'use strict';

    var CSS_TEST_A = 'splitTestA',
        CSS_TEST_B = 'splitTestB',
        URL_CLICK  = '/UI/SplitTesting.aspx/Success',
        URL_VIEW   = '/UI/SplitTesting.aspx/ViewedSuccess';

    function _assert(pred, msg) {
        if (!pred) throw new Error(msg);
    }

    function existy(obj) {
        /*jshint eqnull:true*/
        return obj != null;
    }

    function bodyHasClass(className) {
        return JsUtils.hasClass(document.body, className) && className;
    }

    function getVariant() {
        return bodyHasClass(CSS_TEST_A) || bodyHasClass(CSS_TEST_B);
    }

    function whichSplitTest(whichGroup) {
        return function () {
            return whichGroup === getVariant();
        };
    }

    function isSplitTest() {
        return !!getVariant();
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

    return {
        isSplitTest: isSplitTest,
        isSplitTestA: whichSplitTest(CSS_TEST_A),
        isSplitTestB: whichSplitTest(CSS_TEST_B),

        logClick: logEvent(URL_CLICK),
        logView: logEvent(URL_VIEW),

        // legacy API
        isSplitTestingEnabled: function () {
            return this.isSplitTest();
        },

        logSuccess: function (id, msg) {
            return this.logClick(id, msg);
        },

        logViewedSuccess: function (id, msg) {
            return this.logView(id, msg);
        },
        util: {
            _assert: _assert,
            existy: existy
        }
    };
}(JsUtils));