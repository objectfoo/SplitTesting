/*global test, given, module, ok, throws, deepEqual, SplitTesting*/
(function (given, SplitTesting) {

	module('SplitTesting.util');

	test('_assert should throw when with falsey predicate', function () {
		throws(function () {
			SplitTesting.util._assert(false, 'message');
		},
		/message/,
		'false throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert(0, 'message');
		},
		/message/,
		'0 throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert(-0, 'message');
		},
		/message/,
		'-0 throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert('', 'message');
		},
		/message/,
		'empty string throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert(undefined, 'message');
		},
		/message/,
		'undefined throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert(null, 'message');
		},
		/message/,
		'null throws an exception with custom message');

		throws(function () {
			SplitTesting.util._assert(NaN, 'message');
		},
		/message/,
		'NaN throws an exception with custom message');

		SplitTesting.util._assert(true);
		ok(true, 'doesn\'t throw when called with truthy predicate');

		SplitTesting.util._assert(1);
		ok(true, 'doesn\'t throw when called with truthy predicate');

		SplitTesting.util._assert('a');
			ok(true, 'doesn\'t throw when called with truthy predicate');
	});

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
	
	module('SplitTesting.logging', {
		setup: function () {
			this.bodyClassName = document.body.className;
			this.strings = {
				STR_CLICK_MESSAGE: 'SPLIT_TEST_SUCCESS_CLICK_MESSAGE',
				STR_URL_CLICK: '/UI/SplitTesting.aspx/Success',
				STR_VIEW_MESSAGE: 'SPLIT_TEST_VIEWED_MESSAGE',
			    STR_URL_VIEW: '/UI/SplitTesting.aspx/ViewedSuccess'				
			};
			this.stub = {};
			this.stub.post = sinon.stub(JsUtils, 'post');
			given.splitTestA();
		},

		teardown: function () {
			this.stub.post.restore();
			document.body.className = this.bodyClassName;
		}
	});

	test('logView should log message view to server', function () {
		SplitTesting.logView(1, this.strings.STR_VIEW_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], this.strings.STR_URL_VIEW,
			'sent to endpoint ' + this.strings.STR_URL_VIEW);

		equal(this.stub.post.args[0][1].splitTestingId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, this.strings.STR_VIEW_MESSAGE,
			'sent with description ' + this.strings.STR_VIEW_MESSAGE);
	});

	test('logView should throw exception with invalid data', function () {
		throws(function () {
			SplitTesting.logView('message');
		}, 'missing data threw an exception');

		throws(function () {
			SplitTesting.logView('1');
		}, 'missing message threw an exception');
	});

	test('logClick should log click message to server', function () {
		SplitTesting.logClick(1, this.strings.STR_CLICK_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], this.strings.STR_URL_CLICK,
			'sent to endpoint ' + this.strings.STR_URL_CLICK);

		equal(this.stub.post.args[0][1].splitTestingId, '1',
			'went with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, this.strings.STR_CLICK_MESSAGE,
			'sent with description ' + this.strings.STR_CLICK_MESSAGE);
	});

	test('logClick should throw exception with invalid data', function () {
		throws(function () {
			SplitTesting.logClick('message');
		}, 'missing data threw an exception');

		throws(function () {
			SplitTesting.logClick('1');
		}, 'missing message threw an exception');
	});

	test('logViewedSuccess should log view message to server', function () {
		SplitTesting.logViewedSuccess(1, this.strings.STR_VIEW_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], this.strings.STR_URL_VIEW,
			'sent to endpoint ' + this.strings.STR_URL_VIEW);

		equal(this.stub.post.args[0][1].splitTestingId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, this.strings.STR_VIEW_MESSAGE,
			'sent with description ' + this.strings.STR_VIEW_MESSAGE);
	});

	test('logSuccess should log click message to server', function () {
		SplitTesting.logSuccess(1, this.strings.STR_CLICK_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], this.strings.STR_URL_CLICK,
			'sent to endpoint ' + this.strings.STR_URL_CLICK);

		equal(this.stub.post.args[0][1].splitTestingId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, this.strings.STR_CLICK_MESSAGE,
			'sent with description ' + this.strings.STR_CLICK_MESSAGE);
	});

})(given, SplitTesting);