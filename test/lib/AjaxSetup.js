/* Add some global functionality to ajax requests via jQuery or with the JsUtils.get and JsUtils.post methods
 *
 * - automatically append the anti-forgery token to post requests
 * - correct the request URL for motion point translated pages
 * - automatically redirect to the relogin page if an ajax request resulted in a (304 redirect) to the relogin.aspx page (marked by the '<!--SESSION_EXPIRED_TOKEN-->' beacon)
 *
 */
var JsUtils = JsUtils || {};
(function (window, document, XMLHttpRequest, utils, encodeURIComponent, _eval, mpUtils) {
    var sessionExpiredToken = "<!--SESSION_EXPIRED_TOKEN-->";

    // in IE - the XHR object can be disabled in settings - "Enable native XMLHTTP support"
    if (!XMLHttpRequest) {
        XMLHttpRequest = function () {
            try {
                return new ActiveXObject('MSXML2.XMLHTTP.3.0');
            } catch (ex) {
                return null;
            }
        };
    }

    // add functionality to jQuery
    if (window.$ && !window._includedAjaxSetup) {
        window._includedAjaxSetup = true; // don't run this more than once in case script is included multiple times

        $.ajaxSetup({
            // make the default error handler send the error to the screen (simulates a classic server error)
            error: function(jqXmlHttpRequest) { document.body.innerHTML = jqXmlHttpRequest.responseText; },

            // Attempt to auto-append anti-forgery token on any post ajax request
            beforeSend: function (request, options) {
                // but don't append a forms value onto a json payload! (Consider using a header for better coverage and flexibility)
                if (!options["type"] || options["type"].toUpperCase() !== "POST" || options["omitToken"] === true || (options["contentType"] && options["contentType"].toLowerCase().indexOf("application/json; charset=utf-8") !== -1))
                    return;

                var data = options["data"] || "";
                if (typeof(data) === "string") {
                    var token = $("input[name=__RequestVerificationToken]").first().serialize();
                    if (token.length > 0) {
                        if (data.length > 0) {
                            data += "&";
                        }
                        options["data"] = data + token;
                    }
                }
            }
        });
        /*
        * prefilter to add spanish url if nessasary
        */
        $.ajaxPrefilter(function(options) {
            try {
                if (options) {
                    options.url = mpUtils.getCorrectedUrlForMotionPoint(options.url, options);
                }
            } catch(e) {
            }
        });

        $(document).ajaxComplete(function(event, xhr) {
            if (xhr.responseText && xhr.responseText.indexOf(sessionExpiredToken) > -1) {
                reloadPageAfterSessionTimeout();
            }
        });
    }
    
    function reloadPageAfterSessionTimeout() {
        window.location.reload();
    }

    // create non-jQuery dependant ajax api
    function createXHR(url, method, successCallback, errorCallback, expectedContentType) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, mpUtils.getCorrectedUrlForMotionPoint(url), true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (successCallback) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // iOS bugfix: onreadystatechange (4) get's executed 3 times if you repeatedly scroll druing page load - ak
                    // code.google.com/p/chromium/issues/detail?id=159827
                    xhr.onreadystatechange = function () { }; // this needs to be a function b/c of an IE8/7 bug
                    
                    if (xhr.status === 200) {
                        var contentTypeHeader = xhr.getResponseHeader('content-type'),
                            mimeType = (contentTypeHeader) ? contentTypeHeader.split(';')[0] : '',
                            response = xhr.responseText;

                        if (response && mimeType.indexOf("json") > -1) {
                            response = window.JSON && window.JSON.parse ? JSON.parse(response) : _eval('(' + response + ')'); // IE7 support if JSON2.js not included on page
                        }
                        else if (response && response.indexOf(sessionExpiredToken) > -1) {
                            reloadPageAfterSessionTimeout();
                            return;
                        }
                        if (expectedContentType && mimeType !== expectedContentType) {
                            errorCallbackInternal(response);
                            return;
                        }
                        successCallback(response);
                    } else {
                        errorCallbackInternal(xhr.responseText);
                    }
                }
            };
        }
        return xhr;

        function errorCallbackInternal(response) {
            if (errorCallback) {
                errorCallback();
            } else {
                document.body.innerHTML = response;
            }
        }
    }

    //slowly reimplementing jQuery as we find stuff they have and we need.
    utils.post = function (url, data, options) {
        var xhr = createXHR(url, 'POST', options.successCallback, options.errorCallback, options.expectedContentType),
            antiForgerytokenNode = document.getElementsByName("__RequestVerificationToken")[0],
            formData = '__RequestVerificationToken=';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (antiForgerytokenNode) {
            formData += encodeURIComponent(document.getElementsByName("__RequestVerificationToken")[0].value);
        }
        for (var propertyName in data) {
            formData += '&' + propertyName + '=' + encodeURIComponent(data[propertyName]);
        }
        xhr.send(formData);
    };

    utils.get = function (url, parameters, options) {
        for (var propertyName in parameters) {
            url += (url.indexOf('?') > -1) ? '&' : '?';
            url += propertyName + '=' + encodeURIComponent(parameters[propertyName]);
        }
        createXHR(url, 'GET', options.successCallback, options.errorCallback, options.expectedContentType).send();
    };
})(window, document, window.XMLHttpRequest, JsUtils, encodeURIComponent, eval, MotionPointUtils);