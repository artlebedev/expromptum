xP.controls.register({
    name : 'repeat_insert_button',
    base : 'button',
    prototype : {
        element_selector : '.repeat_insert_button',

        init : function(params) {
            xP.controls.repeat_insert_button.base.init.apply(this, arguments);

            var parent = this.parent(), repeat = parent.repeat;

            if(!(repeat instanceof xP.repeats.item)) {
                return;
            }

            this.click(function() {
                repeat.append(parent, true);
            })
                .enabled = {
                on : function() {
                    return repeat.val() < repeat.max
                },
                from : repeat
            };
        }
    }
});
