xP.dependencies.register({
    name : 'classed',
    base : '_item',
    prototype : {
        process : function() {
            xP.debug('classed', 'classed', this.to.first(), { dependence : this });

            xP.dependencies.classed.base.process.apply(this);

            var that = this;

            this.to.each(function() {
                if(that.result) {
                    this.$container
                        .addClass(that['do']);
                }
                else {
                    this.$container
                        .removeClass(that['do']);
                }
            });
        }
    }
});
