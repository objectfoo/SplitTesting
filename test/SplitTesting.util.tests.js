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

})(given, SplitTesting);