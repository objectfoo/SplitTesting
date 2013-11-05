# Split Testing

Rewrite of SplitTest.js

moved auto init stuff to a branch.

```javascript
SplitTest.isSplitTest() // is splitTestA || splitTestB on body

SplitTest.isSplitTestA() // is splitTestA on body
SplitTest.isSplitTestB() // is splitTestB on body

// Log Events
// id and msg required
// config.success, config.error are optional
SplitTest.logClick(id, msg, config) // send a click event to server
SplitTest.logView(id, msg, config)  // send view message to server

// LEGACY API
// is split testing enabled, invokes isSplitTest
SplitTest.isSplitTestingEnabled()

// Log Events
// id and msg required
SplitTest.logSuccess(id, msg)       // invokes logClick
SplitTest.logViewedSuccess(id, msg) // invokes logView
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
});


function setupExperiment () {
    var viewId = 1,
        clickId = 2;

    // always log a viewed event before you attach a click handler
    // a click event without a viewed event will mess up results
    SplitTesting.logView(testId, 'split test viewed');

    if (SplitTesting.isSplitTestB()) {
        $firstStep.addClass('specialGroupBClass');
    }
    $firstStep.one('click', function () {
        SplitTesting.logClick(clickId, 'split test target clicked')
    });
}
```
