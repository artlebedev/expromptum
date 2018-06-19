xP.controls.register({
    name : 'repeat_remove_button',
    base : 'button',
    prototype : {
        element_selector : '.repeat_remove_button',

        init : function(params) {
            xP.controls.repeat_remove_button.base.init.apply(this, arguments);

            var parent = this.parent(), repeat = parent.repeat;

            if(!(repeat instanceof xP.repeats.item)) {
                return;
            }

            this.click(function() {
                repeat.remove(parent);
            })
                .enabled = {
                on : function() {
                    return repeat.val() > repeat.min
                },
                from : repeat
            };
        }
    }
});
