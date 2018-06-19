xP.controls.register({
    name : '_secret',
    base : '_field',
    prototype : {
        init : function(params) {
            xP.controls._secret.base.init.apply(this, arguments);

            this.$secret = $(
                $('<div>')
                    .append(this.$element.clone().hide())
                    .html()
                    .replace(/\s+(type|id)\s*=\s*[^\s>]+/g, '')
            ).insertAfter(this.$element);

            this.$element.removeAttr('name');

            xP.controls.link(this.$secret, this);
        },

        change : function(handler, remove) {
            if(!arguments.length && this.$secret) {
                var value = this.val();
                if(this.$secret.val() != value) {
                    this.$secret.val(value);
                }
            }

            return xP.controls._secret.base.change.apply(this, arguments);
        },

        destroy : function(handler, remove) {
            if(!arguments.length) {
                this.$secret = null;
            }

            return xP.controls._secret.base.destroy.apply(this, arguments);
        },

        disable : function(disabled) {
            disabled = !arguments.length || disabled;

            if(this.disabled !== disabled) {
                if(disabled) {
                    this.$secret.attr('disabled', true);
                }
                else {
                    this.$secret.removeAttr('disabled');
                }
                xP.controls._secret.base.disable.apply(this, arguments);
            }

            return this;
        }
    }
});
