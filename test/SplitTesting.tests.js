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

	test('existy should return falsy only for undefined and null', function () {
		equal(false, SplitTesting.util.existy(undefined), 'Returned falsy for undefined');
		equal(false, SplitTesting.util.existy(null), 'Returned falsy for null');
		equal(true, SplitTesting.util.existy(0), 'Returned truthy for zero');
		equal(true, SplitTesting.util.existy(-0), 'Returned truthy for negative zero');
		equal(true, SplitTesting.util.existy(''), 'Returned truthy for empty string');
		equal(true, SplitTesting.util.existy(false), 'Returned truthy for false');
		equal(true, SplitTesting.util.existy(NaN), 'Returned truthy for NaN');
		equal(true, SplitTesting.util.existy('a'), 'Returned truthy for character a');
		equal(true, SplitTesting.util.existy({}), 'Returned truthy for empty object');
		equal(true, SplitTesting.util.existy((function () {})), 'Returned truthy for function object');
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

	module('SplitTesting.init', {
		setup: function () {
			this.bodyClassName = document.body.className;
			this.stub = {};
			this.stub.post = sinon.stub(JsUtils, 'post');
			this.stub.addEvent = sinon.stub(JsUtils, 'addEvent');
		},
		teardown: function () {
			this.stub.post.restore();
			this.stub.addEvent.restore();
			document.body.className = this.bodyClassName;
		}
	});

	test('Should setup a test with a config object', function () {
		given.splitTestB();

		SplitTesting.init({
			target: function () {
				return document.getElementById('qunit-fixture');
			},
			click: 'asdf',
			view: 'asdf',
			id: 1
		});

		equal(this.stub.post.callCount, 1, 'Logged a view message');
		equal(this.stub.addEvent.callCount, 1, 'Added 1 event listener');
	});

	test('Should throw when missing required config params', function () {
		given.splitTestB();

		throws(function () {
			SplitTesting.init({id: 1, view: 'viewed', click: 'clicked'});
		}, 'Throws an error when target is undefined');

		throws(function () {
			SplitTesting.init({id: 1, view: 'viewed', click: 'clicked', target: 4});
		}, 'Throws an error if target is not a function');

		throws(function () {
			SplitTesting.init({view: 'viewed', click: 'clicked', target: function () {} });
		}, 'Throws an error if id undefined');

		throws(function () {
			SplitTesting.init({id: 'asd', view: 'viewed', click: 'clicked', target: function () {} });
		}, 'Throws an error if id is not a number');

		throws(function () {
			SplitTesting.init({id: 1, click: 'clicked', target: function () {} });
		}, 'Throws an error if view is undefined');

		throws(function () {
			SplitTesting.init({id: 1, view: 1, click: 'clicked', target: function () {} });
		}, 'Throws an error if view is not a string');

		throws(function () {
			SplitTesting.init({id: 1, view: '', target: function () {} });
		}, 'Throws an error if click is undefined');

		throws(function () {
			SplitTesting.init({id: 1, view: '', click: 1, target: function () {} });
		}, 'Throws an error if click is not a string');

	});
})(given, SplitTesting);