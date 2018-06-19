xP.controls.register({
    name : 'submit',
    base : '_item',
    prototype : {
        element_selector : '[type=submit]',

        init : function(params) {
            xP.controls.button.base.init.apply(this, arguments);

            var that = this;

            this.$element.click(function() {
                that.root()._.last_clicked = that;
            });
        }
    }
});
