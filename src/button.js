xP.controls.register({
    name : 'button',
    base : '_parent',
    prototype : {
        element_selector : '[type=button], button, .button',

        init : function(params) {
            xP.controls.button.base.init.apply(this, arguments);

            this._.on_click = new xP.list();

            var that = this;

            this.$element.click(function() {
                that.root()._.last_clicked = that;

                if(that._.on_click.length) {
                    that.click();

                    return false;
                }
            });
        },

        click : function(handler, remove) {
            if(!arguments.length) {
                if(!this.disabled) {
                    var that = this;

                    this._.on_click.each(function() {
                        this.call(that);
                    });
                }
            }
            else {
                if(remove) {
                    this._.on_click.remove(handler);
                }
                else {
                    this._.on_click.append(handler);
                }
            }

            return this;
        }
    }
});
