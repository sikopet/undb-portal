define(['app'], function(app) {
    'use strict';
    app.filter("hack", function() {
        return function(text) {

            if (!text)
                return '';

            return text.replace('[ABBTTF]','');
        };
    });
});