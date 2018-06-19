xP.dependencies.register({
    name : 'required',
    base : '_rooted',
    prototype : {
        init : function(params, control) {
            if($.type(params) === 'string') {
                params = { on : params };
            }
            if(
                $.type(params.on) === 'string'
                && !params.on.match(/\[(?:this|self)]/)
            ) {
                params.on = '(' + params.on + ') && ![this] && [this] !== 0';
            }
            if(!params.on) {
                this.on = '![this] && [this] !== 0';
            }
            xP.dependencies.required.base.init.apply(this, [params, control]);
        },

        process : function() {
            xP.debug('required', 'required', this.to.first(), { dependence : this });

            xP.dependencies.required.base.process.apply(this);

            var that = this;

            this.to.each(function() {
                if(that.result) {
                    this.$container
                        .addClass(that.container_required_class)
                        .removeClass(that.container_unrequired_class);
                }
                else {
                    this.$container
                        .removeClass(that.container_required_class)
                        .addClass(that.container_unrequired_class);
                }
            });

            this.to_root(this.result);
        },

        container_required_class : 'required',
        container_unrequired_class : 'unrequired'
    }
});
