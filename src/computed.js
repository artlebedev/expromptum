xP.dependencies.register({
    name : 'computed',
    base : '_item',
    prototype : {
        process : function() {
            xP.debug('computed', 'computed', this.to.first(), { dependence : this });

            xP.dependencies.classed.base.process.apply(this);

            var that = this;

            this.to.each(function() {
                if(that['do']) {
                    this.param(that['do'], that.result);
                }
                else {
                    this.val(that.result);
                }
            });
        }
    }
});
