//TODO: Надо бы сделать ее рабочей и для sheet-ов (для кнопок next и prev).
xP.dependencies.register({
    name : 'enabled_on_completed',
    base : '_item',
    prototype : {
        init : function(params, control) {
            xP.dependencies.enabled_on_completed.base.init.apply(
                this,
                [{ from : [control.root()] }, control]
            );
        },

        process : function() {
            xP.debug(
                'enabled_on_completed', 'enabled_on_completed',
                this.to.first(), { dependence : this }
            );

            this.result = this.to.first().root().uncompleted();

            var that = this;

            this.to.each(function() {
                this.disable(that.result);
            });
        }
    }
});
