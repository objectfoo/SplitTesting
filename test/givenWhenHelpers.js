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

	given.experiment = function () {
		var obj = {
			'href': '#',
			'test': 'id:1, view:viewedmessage, click: clickedmessage',
			'content': 'content'
		};
		fixture.innerHTML =
			('<a href="{href}" ' +
				'data-simpletest="{test}"' +
				'>{content}</a>').supplant(obj);
	};

	given.validAttrString = function () {
		return 'id: 1, click: clicked message, view: viewed message';
	};

	given.wonkyAttrString = function () {
		return ' id : 1 , click : clicked message, view: viewed message ';
	};

	return given;
})(given || {});



/**
* Whens
**************************************************************************/
var when = (function (when, SplitTesting) {
	'use strict';

	when.simpleInit = function () {
		SplitTesting.simple.init();
	};
	return when;
})(when || {}, SplitTesting);
