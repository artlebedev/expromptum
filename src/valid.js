xP.dependencies.register({
    name : 'valid',
    base : '_rooted',
    prototype : {
        init : function(params, control) {
            this._.root_type = 'invalid';
            if($.type(params) === 'regexp') {
                params = params.toString();
            }
            if($.type(params) === 'string' && params.indexOf('/') === 0) {
                params = '[this] !== undefined && [this].val().match(' + params + ')';
            }

            xP.dependencies.valid.base.init.apply(this, [params, control]);
        },

        process : function() {
            xP.debug(
                'valid', 'valid', this.to.first(), { dependence : this }, this.result
            );

            var that = this;

            this.to.each(function() {
                // TODO: Избавиться бы от проверки типа.
                var value = this.val();
                if(
                    !value && value !== 0 && !isNaN(value)
                    && !(this instanceof xP.controls.fields)
                ) {
                    this.$container
                        .removeClass(that.container_valid_class)
                        .removeClass(that.container_invalid_class);

                    that.result = true;
                }
                else {
                    xP.dependencies.valid.base.process.apply(that);

                    if(that.result) {
                        this.$container
                            .addClass(that.container_valid_class)
                            .removeClass(that.container_invalid_class);
                    }
                    else {
                        this.$container
                            .removeClass(that.container_valid_class)
                            .addClass(that.container_invalid_class);
                    }
                }
            });

            this.to_root(!this.result);
        },

        container_valid_class : 'valid',
        container_invalid_class : 'invalid'
    }
});
