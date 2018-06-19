xP.controls.register({
    name : 'password',
    base : '_secret',
    prototype : {
        element_selector : '[type=password]',

        init : function(params) {
            xP.controls.password.base.init.apply(this, arguments);

            var that = this;

            this.$secret.on(this.change_events, function() {
                that.val(that.$secret.val());
            });

            this.control_button_view
                = $(this.control_button_view_html)
                .insertAfter(this.$secret)
                .click(function() {
                    if(that.disabled) {
                        return false;
                    }

                    that.$container.toggleClass(
                        that.container_view_class
                    );

                    that.control_button_view.toggleClass(
                        that.control_button_view_class
                    );

                    that.$element.toggle();

                    that.$secret.toggle();

                    (
                        that.$secret.is(':visible')
                            ? that.$secret
                            : that.$element
                    ).focus()[0].selectionStart = 1000;
                });
        },

        container_view_class : 'alt',
        control_button_view_class : 'control_button_password_view',
        control_button_view_html :
            '<span class="control_button control_button_password"/>'
    }
});
