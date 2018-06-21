/* Base */

xP.base = xP.register({
    name : 'xP.base',
    prototype : {

        init(params) {
            this._.on_destroy = new xP.list
            this._.on_change = new xP.list
            Object.assign(this, params)
        },

        destroy(handler, remove) {
            if(!arguments.length) {
                clearTimeout(this._.change_inquiry)
                const that = this
                this._.on_destroy.each(function() {
                    this.call(that)
                })
            }
            else if(remove) {
                this._.on_destroy.remove(handler)
            }
            else this._.on_destroy.append(handler)
            return this
        },

        change(handler, remove) {
            if(!arguments.length) {
                if(!this._.change_inquiry) {
                    clearTimeout(this._.change_inquiry)
                    const that = this
                    that._.change_inquiry = xP.after(() => {
                        that._.change_inquiry = null
                        that._.on_change.each(function() {
                            this.call(that)
                        })
                    })
                }
            }
            else if(remove) {
                this._.on_change.remove(handler)
            }
            else this._.on_change.append(handler)
            return this
        },

        param(name, value) {
            if(arguments.length === 2) {
                this[name] = value
            }
            return this[name]
        },

        _param(name, value) {
            if(arguments.length === 2) {
                this._[name] = value
            }
            return this._[name]
        }
    }
})
