xP.dependencies.register({
    name : 'changed',
    base : '_rooted',
    prototype : {
        init : function(params, control) {
            xP.dependencies.changed.base.init.apply(this, arguments);
        },

        process : function() {
            if(!this.to) {
                return;
            } // TODO: Надо разобраться с destroy.
            xP.debug('changed', 'changed', this.to.first(), { dependence : this });

            var that = this;

            this.to.each(function() {
                // TODO: Разобраться с этой строчкой. Можно оптимизировать.
                var cur = this.val(),//this._param('value'),
                    ini = this._param('initial_value');

                that.result = ini != cur;

                this.$container.toggleClass(
                    that.container_changed_class,
                    that.result
                );

                that.to_root(that.result);

                var parent = this.parent();

                if(parent) {
                    parent.change();
                }
            });
        },

        container_changed_class : 'changed'
    }
});
