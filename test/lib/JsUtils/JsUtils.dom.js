var JsUtils = (function(utils) {
    /*
    * remove a class from an element or from each element in an array of elements
    */
    utils.removeClass = function (elems, className) {
        var i,
        removeClass = function (elem) {
            elem.className = elem.className.replace(className + ' ', '').replace(' ' + className, '').replace(className, '');
        };

        if (elems.length) {
            for (i = elems.length - 1; i >= 0; --i) {
                removeClass(elems[i]);
            }
        } else {
            removeClass(elems);
        }
    };

    utils.addClass = function (elem, className) {
        if (!utils.hasClass(elem, className)) {
            elem.className = elem.className ? (elem.className + ' ' + className) : className;
        }
    };

    utils.hasClass = function (elem, className) {
		if (elem && elem.className) {
			var elementClasses = elem.className.replace(/[\t\r\n]/g, " ").split(" ");
			for (var i=0; i < elementClasses.length; i++) {
				if (elementClasses[i] === className)
					return true
			}
		}
		return false;
    };
    /* commenting out until/if needed
    utils.toggleClass = function(elem, className) {
        if (utils.hasClass(elem, className)) {
            utils.removeClass(elem, className);
        } else {
            utils.addClass(elem, className);
        }
    };
    */

    utils.appendHTML = function (node, markup) {
        addChildrenToElement(node, markup, function (child) {
            node.appendChild(child);
        });
    };

    utils.prependHTML = function (node, markup) {
        var originalFirstChild = node.firstChild;
        addChildrenToElement(node, markup, function (newChild) {
            node.insertBefore(newChild, originalFirstChild);
        });
    };

    var addChildrenToElement = function (node, markup, addMethod) {
        var tmpDiv = document.createElement('div'), child;
        tmpDiv.innerHTML = markup;

        while (tmpDiv.children.length) {
            child = tmpDiv.children[0];
            child.parentNode.removeChild(child);
            addMethod(child);
        }
    };

    utils.findParentWithClass = function (childNode, classToFind) {
        while (childNode = childNode.parentNode) {
            if (utils.hasClass(childNode, classToFind)) {
                return childNode;
            }
        }
        return null;
    };

    utils.findParentWithTagName = function (childNode, tagName) {
        while (childNode = childNode.parentNode) {
            if (childNode.tagName === tagName.toUpperCase()) {
                return childNode;
            }
        }
        return null;
    };

    utils.findChildWithTagName = function(node, tagName) {
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].tagName == tagName.toUpperCase()) {
                return node.childNodes[i];
            }
        }
        return null;
    };

    utils.findChildWithClass = function (node, classToFind) {
        for (var i = 0; i < node.childNodes.length; i++) {
            if (utils.hasClass(node.childNodes[i], classToFind)) {
                return node.childNodes[i];
            }
        }
        return null;
    };

    return utils;
})(JsUtils || {});

