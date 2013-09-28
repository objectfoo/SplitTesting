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
        registerCriteria();
    }
});


function registerCriteria () {

    // always log a viewed event before you attach a click handler
    // a click event without a viewed event will really mess up results
    if (SplitTesting.isSplitTestA()) {
        SplitTesting.logView(1, 'split test A was viewed');

        $('#magicDiv').find('first').one('click', function () {
            SplitTesting.logClick(1, 'split test b was clicked')
        });
    }

    if (SplitTesting.isSplitTestB()) {
        SplitTesting.logView(1, 'split test B was viewed');

        $('#magicDiv').find('first').one('click', function () {
            SplitTesting.logClick(1, 'split test B was clicked')
        });
    }
}
```

