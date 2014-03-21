/**
Please record AB Testing IDs here : http://foswiki.dev.webmd.com/bin/view.pl/Main/SplitTestingIDs
*/
/*globals JsUtils*/
var SplitTesting = (function (JsUtils) {
    'use strict';

    if (SplitTesting !== undefined) {
        return SplitTesting; // only initialize once
    }

    var exports = {},
        startPostingTimer,
        KEY_SPLIT_TESTING = 'splitTesting',
        CSS_TEST_A = 'splitTestA',
        CSS_TEST_B = 'splitTestB',
        URL_CLICK  = '/UI/SplitTesting.aspx/Success',
        URL_VIEW   = '/UI/SplitTesting.aspx/ViewedSuccess',

        logView = logEvent(URL_VIEW),
        logClick = logEvent(URL_CLICK),

        hasSessionstorage = (function () {
            var s = Math.random().toString(36).substring(2,7);

            try {
                sessionStorage.setItem(s, s);
                sessionStorage.removeItem(s,s);
                return true;
            } catch(e) {
                return false;
            }
        })();

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
        var options = {};

        return function (id, message) {
            _assert(existy(id) && existy(message), 'logEvent() id and message required');
            var data = {
                    'splitTestingId': id,
                    'splitTestingDescription': message,
                    'endpoint': endpoint
                };

            if (hasSessionstorage) {
                appendMessage(data);
                postLocalEvents();
            }
            else {
                JsUtils.post(endpoint, data, options);
            }
        };
    }

    function postLocalEvents() {
        var messages = getMessages(),
            oldestMessage;

        if (messages.length > 0) {
            oldestMessage = messages.shift();

            JsUtils.post(oldestMessage.endpoint, oldestMessage, {
                successCallback: postSuccess
            });
        }
        
        function postSuccess() {
            if (messages.length === 0) {
                sessionStorage.removeItem(KEY_SPLIT_TESTING);
            }
            else {
                sessionStorage.setItem(KEY_SPLIT_TESTING, JSON.stringify(messages));
                setTimeout(postLocalEvents, 15);
            }
        }
    }

    function getMessages() {
        return JSON.parse(sessionStorage.getItem(KEY_SPLIT_TESTING)) || [];
    }

    function appendMessage(newMessage) {
        var messages = getMessages();

        messages.push(newMessage);
        sessionStorage.setItem(KEY_SPLIT_TESTING, JSON.stringify(messages));
    }

    exports = {
        isSplitTest: isSplitTest,
        isSplitTestA: whichSplitTest(CSS_TEST_A),
        isSplitTestB: whichSplitTest(CSS_TEST_B),

        logClick: logClick,
        logView: logView,

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

    if (window.QUnit) {
        // export additional functions for tests
        exports.postLocalEvents = postLocalEvents;
        exports.appendMessage = appendMessage;
        exports.setHasSessionStorage = function (value) {
            hasSessionstorage = value;
        };
    }
    else {

        if (hasSessionstorage && getMessages().length > 0) {
            startPostingTimer = setTimeout(function () {
                startPostingTimer = null;
                postLocalEvents();
            }, 5000);

            JsUtils.on('load', window, function () {

                if (startPostingTimer !== null) {
                    clearTimeout(startPostingTimer);
                    setTimeout(function () {
                        postLocalEvents();
                    }, 1000);
                }
            });
        }
    }

    return exports;
})(JsUtils);
