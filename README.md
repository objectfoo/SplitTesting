# Split Testing

Rewrite of SplitTest.js

moved auto init stuff to a branch.

```javascript
SplitTest.isSplitTest()  // returns bool

SplitTest.isSplitTestA() // returns bool
SplitTest.isSplitTestB() // returns bool

// Log Events
// id and msg required
// success and error optional
SplitTest.logClick(id, msg, {success: Function, error: Function})
SplitTest.logView(id, msg, {success: Function, error: Function})

// LEGACY API
// is split testing enabled, invokes isSplitTest
SplitTest.isSplitTestingEnabled() // returns bool

// Log Events
// id and msg required
SplitTest.logSuccess(id, msg)
SplitTest.logViewedSuccess(id, msg)
```

## Initialization example

```javascript
$(document).ready(function () {
    var $firstStep;

    // if split testing is not enabled return
    if (!SplitTesting.isSplitTest()) {
        return;
    }

    // if needed test DOM for special testing conditions
    // then register your criteria
    $firstStep = $('#magicDiv').find('li').first();

    if ($firstStep.hasClass('ponyPower')) {
        setupExperiment();
    }

    // mainpulate dom if needed
    // log view
    // register event to log click
    function setupExperiment () {
        var experimentID = 1;

        SplitTesting.logView(experimentId, 'viewed_message');

        if (SplitTesting.isSplitTestB()) {
            $firstStep.addClass('specialGroupBClass');
        }
        $firstStep.one('click', function () {
            SplitTesting.logClick(experimentId, 'clicked_message');
        });
    }
});
```
## Better init example

```javascript
// TODO
SplitTesting.init({
    id: 1,
    view: 'viewed_message',
    click: 'clicked_message',
    target: function () {
        return document.getElementById('someLink');
    },
    setupA: null // || undefined || Function
    setupB: function () {
        $('#magicLink').click();
    }
});
```

or

```javascript
// support mulitple log messages
SplitTesting.init({
	experiment [
		{
			id: 1,
			view: "viewed_item1",
			click: "click_item1",
			target: function() { 
				return byId("item1");
			}
		},
		{
			id: 2, view:
			"viewed_item2",
			click: "click_item2",
			target: function() { 
				return byId("item2");
			}
		}
	],
	setupCondition: function() {
		return coachingIsFirstItem();
	},

	setup: function() {
		$("item1").click();
	}
});
```
