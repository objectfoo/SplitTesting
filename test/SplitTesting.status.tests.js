/*global strictEqual, test, given, module, SplitTesting*/
(function (given, SplitTesting) {
	'use strict';

	module('SplitTesting.status', {
		teardown: function () {
			given.splitTestNone();
		}
	});

	test('isSplitTest returns boolean', function () {
		given.splitTestA();
		strictEqual(SplitTesting.isSplitTest(), true,
			'true when body class splitTestA');

		given.splitTestB();
		strictEqual(SplitTesting.isSplitTest(), true,
			'true when body class splitTestB');

		given.splitTestNone();
		strictEqual(SplitTesting.isSplitTest(), false,
			'false when no split test class on body');
	});

	test('isSplitTestA returns boolean', function () {
		given.splitTestA();
		strictEqual(SplitTesting.isSplitTestA(), true,
			'true when body class splitTestA');

		given.splitTestB();
		strictEqual(SplitTesting.isSplitTestA(), false,
			'false when body class splitTestB');

		given.splitTestNone();
		strictEqual(SplitTesting.isSplitTestA(), false,
			'false when no split test body class');
	});

	test('isSplitTestB returns boolean', function () {
		given.splitTestB();
		strictEqual(SplitTesting.isSplitTestB(), true,
			'true when body class splitTestB ');

		given.splitTestA();
		strictEqual(SplitTesting.isSplitTestB(), false,
			'false when body class splitTestA');

		given.splitTestNone();
		strictEqual(SplitTesting.isSplitTestB(), false,
			'false when no split SplitTesting body class');
	});

	test('isSplitTestingEnabled returns boolean', function () {
		given.splitTestA();
		strictEqual(SplitTesting.isSplitTestingEnabled(), true,
			'true when body class splitTestA');

		given.splitTestB();
		strictEqual(SplitTesting.isSplitTestingEnabled(), true,
			'true when body class splitTestB');

		given.splitTestNone();
		strictEqual(SplitTesting.isSplitTestingEnabled(), false,
			'false when no split test body class');
	});

})(given, SplitTesting);
