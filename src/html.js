xP.controls.register({
    name : 'html',
    base : '_item',
    prototype : {
        element_selector : '.xp_html',

        init : function(params) {
            xP.controls.html.base.init.apply(this, arguments);

            this.init_locale(params);
        },

        val : function(value) {
            if(!arguments.length) {
                return this.disabled? undefined : this.$element.html();
            }
            else {
                this.$element.html(value);

                this.change();

                return this;
            }
        }
    }
});
