/*global test, given, module, ok, throws, deepEqual, SplitTesting*/
(function (given, SplitTesting) {
	'use strict';

	module('SplitTesting.simple.setupCriteria', {
		setup: function () {
			given.splitTestA();
			given.experiment();
		},
		teardown: function () {}
	});

	test('Should call logView on setup', function () {
		ok(0);
	});

	test('Should call logClick when clicked', function () {
		ok(0);
	});

	test('Should do nothing when no experiments', function () {
		ok(0);
	});

	module('SplitTesting.simple.parse');

	test('Should throw exception when input invalid', function () {
		var str;
		throws(function () {
			str = '';
			SplitTesting.simple.parse(str);
		}, 'threw exception when empty string');

		throws(function () {
			str = 'click: clicked message, view: viewed message';
			SplitTesting.simple.parse(str);
		}, 'threw exception when missing id');

		throws(function () {
			str = 'id: 1, view: viewed message';
			SplitTesting.simple.parse(str);
		}, 'threw exception when missing click message');

		throws(function () {
			str = 'id: 1, click: clicked message';
			SplitTesting.simple.parse(str);
		}, 'threw exception when missing view message');
	});

	test('Should convert attribute string into usable data object', function () {
		var str,
			result,
			expected = {id: '1', click: 'clicked message', view: 'viewed message'};

		str = 'id: 1, click: clicked message, view: viewed message';
		result = SplitTesting.simple.parse(str);
		deepEqual(result, expected,
			'converted string into valid data Object');

		str = ' id : 1 , click : clicked message, view: viewed message ';
		result = SplitTesting.simple.parse(str);
		deepEqual(result, expected,
			'converted string with extraneous space into valid data Object');
	});

})(given, SplitTesting);