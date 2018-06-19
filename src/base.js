/* Base */

xP.base = xP.register({
    name : 'xP.base',
    prototype : {

        init : function(params) {
            this._.on_destroy = new xP.list();
            this._.on_change = new xP.list();

            $.extend(this, params);
        },

        destroy : function(handler, remove) {
            if(!arguments.length) {
                clearTimeout(this._.change_inquiry);

                var that = this;

                this._.on_destroy.each(function() {
                    this.call(that);
                });
            }
            else {
                if(remove) {
                    this._.on_destroy.remove(handler);
                }
                else {
                    this._.on_destroy.append(handler);
                }
            }

            return this;
        },

        change : function(handler, remove) {
            if(!arguments.length) {
                if(!this._.change_inquiry) {
                    clearTimeout(this._.change_inquiry);

                    var that = this;

                    that._.change_inquiry = xP.after(function() {
                        that._.change_inquiry = null;

                        that._.on_change.each(function() {
                            this.call(that);
                        });
                    });
                }
            }
            else {
                if(remove) {
                    this._.on_change.remove(handler);
                }
                else {
                    this._.on_change.append(handler);
                }
            }

            return this;
        },

        param : function(name, value) {
            if(arguments.length === 2) {
                this[name] = value;
            }

            return this[name];
        },

        _param : function(name, value) {
            if(arguments.length === 2) {
                this._[name] = value;
            }

            return this._[name];
        }
    }
});
