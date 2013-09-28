/*global JsUtils*/
var SplitTesting = (function (SplitTesting, JsUtils, document) {
    'use strict';

    var ATT_SIMPLETEST  = 'data-simpletest',
        querySelectAll  = document.querySelectorAll,
        ST              = SplitTesting,
        isSplitTest     = ST.isSplitTest,
        _assert         = ST.util._assert,
        existy          = ST.util.existy,

    off = function (type, el, fn) {
        if (el.detachEvent) {
            off = function (type, el, fn) {
                return el.detachEvent('on' + type, fn);
            };
        } else {
            off = function (type, el, fn) {
                return el.removeEventListener(type, fn, !!0);
            };
        }
        return off(type, el, fn);
    };

    function clickOnceListener(e) {
        var el = e.target,
            splitTest = el.splitTest;

        ST.logClick(splitTest.id, splitTest.view);
        off('click', el, clickOnceListener);
    }

    function init() {
        var elem;

        if (!!querySelectAll && !isSplitTest()) {
            elem = querySelectAll.call(document, '[' + ATT_SIMPLETEST + ']')[0];
            setupCriteria(elem);
        }
    }

    function parse(str) {
        var parts,
            rec = {},
            data = str.split(','),
            i = data.length - 1;

        for (; i >= 0; i--) {
            parts = data[i].split(':');
            rec[trim(parts[0])] = trim(parts[1]);
        }
        _assert(existy(rec.id) && existy(rec.view) && existy(rec.click),
                'parse() id, view and click required');
        return rec;
    }

    function setupCriteria(elem) {
        var splitTest = parse(elem.getAttribute(ATT_SIMPLETEST));

        elem.splitTest = splitTest;
        ST.logView(splitTest.id, splitTest.view);
        JsUtils.on('click', elem, clickOnceListener);
    }

    function trim(str) {
        return str.replace(/(^\s*|\s*$)/g, '');
    }

    // **************************************************
    if (!window.QUnit) {
        init();
    }

    SplitTesting.simple = {
        init: init,
        parse: parse,
        off: off,
        setupCriteria: setupCriteria,
    };

    return SplitTesting;
})(SplitTesting, JsUtils, document);
