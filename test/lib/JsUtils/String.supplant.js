(function () {
    // using this instead of jQuery templates because our template needs are lightweight
    if (!String.prototype.supplant) {
        String.prototype.supplant = function(o) {
            return this.replace(
                /\{([^{}]*)\}/g,
                function(a, b) {
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };
    }
})();