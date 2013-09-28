var JsUtils = JsUtils || {};

/*
* normalize event will add properties and methods
* to the dom event object passed in if they are missing
*
* This is here for cross browser support (ahem - old IE)
*
* target (the source of the event)
* preventDefault()
* stopPropagation()
*
* usage:
* function eventHandler(e) { e = utils.normalizeEvent(e); }
*/
JsUtils.normalizeEvent = function (e) {
    e = e || window.event;
    if (!e.preventDefault) {
        e.preventDefault = function () {
            e.returnValue = false;
        };
    }
    if (!e.stopPropagation) {
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }
    if (!e.target) {
        e.target = e.srcElement;
    }
	
	if (!e.keyCode) {
		e.keyCode = e.charCode;
	}
    return e;
};

// Todo: rename to addEventListener
JsUtils.addEvent = function (evnt, elem, func, capture) {
    if (elem.addEventListener)  // W3C DOM
        elem.addEventListener(evnt, func, !!capture);
    else { // old IE
        elem.attachEvent("on" + evnt, function (e) {
            e = JsUtils.normalizeEvent(e);
            func.apply(this, [e]);
        });
    }
};


/*
*  creates a custom event
*       obj.onUpdate = JsUtils.createCustomEvent();
*       obj.onUpdate(function myEventListenerCallback(arg){...});
*       obj.onUpdate.trigger(arg);
*/
JsUtils.createCustomEvent = function () {
    var listeners = [], subscribe = function (listener) {
        listeners.push(listener);
    };
    subscribe.trigger = function () {
        for (var i = listeners.length - 1; i >= 0; --i) {
            listeners[i].apply(null, arguments);
        }
    };
    return subscribe;
};