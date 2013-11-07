/**
* Givens
**************************************************************************/
var given = (function (given) {
	'use strict';

	var fixture = document.getElementById('qunit-fixture');
	
	given.splitTestA = function () {
		document.body.className = 'splitTestA';
	};

	given.splitTestB = function () {
		document.body.className = 'splitTestB';
	};

	given.splitTestNone = function () {
		document.body.className = '';
	};

	return given;
})(given || {});

