/*global given, test, deepEqual, equal, module, sinon, SplitTesting, JsUtils, throws, ok*/
(function (given) {
	'use strict';
	var bodyClassName = document.body.className,

	STR_CLICK_MESSAGE = 'SPLIT_TEST_SUCCESS_CLICK_MESSAGE',
	STR_URL_CLICK     = '/UI/SplitTesting.aspx/Success',
	STR_VIEW_MESSAGE = 'SPLIT_TEST_VIEWED_MESSAGE',
    STR_URL_VIEW      = '/UI/SplitTesting.aspx/ViewedSuccess';

	module('SplitTesting.logging', {
		setup: function () {
			this.stub = {};
			this.stub.post = sinon.stub(JsUtils, 'post');
			given.splitTestA();
		},

		teardown: function () {
			this.stub.post.restore();
			document.body.className = bodyClassName;
		}
	});

	test('logView should log message view to server', function () {
		SplitTesting.logView(1, STR_VIEW_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], STR_URL_VIEW,
			'sent to endpoint ' + STR_URL_VIEW);

		equal(this.stub.post.args[0][1].splitTestId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, STR_VIEW_MESSAGE,
			'sent with description ' + STR_VIEW_MESSAGE);

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
		SplitTesting.logClick(1, STR_CLICK_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], STR_URL_CLICK,
			'sent to endpoint ' + STR_URL_CLICK);

		equal(this.stub.post.args[0][1].splitTestId, '1',
			'went with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, STR_CLICK_MESSAGE,
			'sent with description ' + STR_CLICK_MESSAGE);
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
		SplitTesting.logViewedSuccess(1, STR_VIEW_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], STR_URL_VIEW,
			'sent to endpoint ' + STR_URL_VIEW);

		equal(this.stub.post.args[0][1].splitTestId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, STR_VIEW_MESSAGE,
			'sent with description ' + STR_VIEW_MESSAGE);

	});

	test('logSuccess should log click message to server', function () {
		SplitTesting.logSuccess(1, STR_CLICK_MESSAGE);

		equal(this.stub.post.callCount, 1,
			'sent once');

		equal(this.stub.post.args[0][0], STR_URL_CLICK,
			'sent to endpoint ' + STR_URL_CLICK);

		equal(this.stub.post.args[0][1].splitTestId, '1',
			'sent with id 1');

		equal(this.stub.post.args[0][1].splitTestingDescription, STR_CLICK_MESSAGE,
			'sent with description ' + STR_CLICK_MESSAGE);

	});


})(given);
