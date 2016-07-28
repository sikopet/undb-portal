define(['app'], function(app) {
    'use strict';
    app.filter("hack", function() {
        return function(text) {

            if (!text)
                return '';
            text=text.replace('[ABTTF]','');
            text=text.replace('[BLGBLG]','');
            text=text.replace('[JLGJLG]','');
            return text;
        };
    });
});