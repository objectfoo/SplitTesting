/*global SplitTesting*/
/**
* Helpers
**************************************************************************/
(function () {
	'use strict';

	if (!String.prototype.supplant) {
		String.prototype.supplant = function (o) {
			return this.replace(
				/\{([^{}]*)\}/g,
				function (a, b) {
					var r = o[b];
					return typeof r === 'string' || typeof r === 'number' ? r : a;
				}
			);
		};
	}
})();


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

