xP.dependencies.register({
    name : 'enabled',
    base : '_item',
    prototype : {
        process : function() {

            xP.dependencies.enabled.base.process.apply(this);

            // TODO: Вынести эту функцию.
            var subprocess = function(children) {
                children.each(function() {
                    if(this.enabled && this.enabled.process) {
                        this.enabled.process();
                    }

                    if(this.children) {
                        subprocess(this.children());
                    }
                });
            };

            var that = this, enable;

            this.to.each(function() {
                this.disable(!that.result, that);

                if(that.result && this.children) {
                    subprocess(this.children());
                }
            });

            xP.debug(
                'enabled', 'enabled',
                this.to.first(), { dependence : this }, this.result
            );
        }
    }
});
