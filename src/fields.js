xP.controls.register({
    name : 'fields',
    base : '_labeled',
    prototype : {
        element_selector : 'fieldset, .fields, .sheets',

        init : function(params) {
            xP.controls.fields.base.init.apply(this, arguments);

            this.init_locale(params);
        },

        count : function() {
            if(this.disabled || !this.children().length) {
                return undefined;
            }

            var result = 0;

            this.children().each(function() {
                if(this instanceof xP.controls.fields) {
                    if(this.count()) {
                        result++;
                    }
                }
                else if(this.val()) {
                    result++;
                }
            });

            return result;
        }
    }
});
