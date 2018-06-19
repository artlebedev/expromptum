xP.controls.register({
    name : '_labeled',
    base : '_parent',
    prototype : {
        init : function(params) {
            xP.controls._labeled.base.init.apply(this, arguments);

            var id = this.$element.attr('id');

            if(!this.$label) {
                this.$label = this.$element.parents('label').first();
            }

            if(!this.$label[0] && id) {
                var s = "[for='" + xP.taint_css(id) + "']";

                this.$label = $(s, this.$container != this.$element? this.$container : this.root().$container);

                if(!this.$label.length) {
                    this.$label = $(s);
                }
            }
            xP.controls.link(this.$label, this);
        },

        destroy : function(handler, remove) {
            if(!arguments.length) {
                this.$label = null;
            }

            return xP.controls._parent.base.destroy.apply(this, arguments);
        }
    }
});
