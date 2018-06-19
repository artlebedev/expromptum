xP.controls.register({
    name : 'repeat_last_button',
    base : 'button',
    prototype : {
        element_selector : '.repeat_last_button',

        init : function(params) {
            xP.controls.repeat_first_button.base.init.apply(this, arguments);

            var parent = this.parent(), repeat = parent.repeat;

            if(!(repeat instanceof xP.repeats.item)) {
                return;
            }

            this.click(function() {
                repeat.move(parent, repeat.children().length - 1);
            }).enabled = {
                on : function() {
                    return repeat.children().length - 1 > parent._param('repeat_position') * 1
                },
                from : repeat
            };
        }
    }
});
