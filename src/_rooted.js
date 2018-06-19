xP.dependencies.register({
    name : '_rooted',
    base : '_item',
    prototype : {
        init : function(params, control) {
            if(!this._.root_type) {
                this._.root_type = this.type;
            }

            xP.dependencies._rooted.base.init.apply(this, arguments);

            var root = this.to.first().root();

            this._.root = root._param(this._.root_type)
                || root._param(this._.root_type, new xP.list());
        },

        destroy : function() {
            if(this.to) {
                this.to_root(false);

                this.to.first().root().change();
            }

            return xP.dependencies._rooted.base.destroy.apply(this, arguments);
        },

        to_root : function(append) {
            var that = this;

            this.to.each(function() {
                if(this._.no_root_dependencies) {
                    return;
                }

                if(append) {
                    that._.root.append(this);
                }
                else {
                    that._.root.remove(this);
                }
            });
        }
    }
});
