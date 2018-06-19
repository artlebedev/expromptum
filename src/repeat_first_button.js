xP.controls.register({
    name : 'repeat_first_button',
    base : 'button',
    prototype : {
        element_selector : '.repeat_first_button',

        init : function(params) {
            xP.controls.repeat_first_button.base.init.apply(this, arguments);

            var parent = this.parent(), repeat = parent.repeat;

            if(!(repeat instanceof xP.repeats.item)) {
                return;
            }

            this.click(function() {
                repeat.move(parent, 0);
            })
                .enabled = {
                on : function() {
                    return 0 < parent._param('repeat_position') * 1
                },
                from : repeat
            };
        }
    }
});
