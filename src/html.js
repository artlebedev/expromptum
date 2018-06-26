xP.controls.register({
    name : 'html',
    base : '_item',
    prototype : {
        element_selector : '.xp_html',
        init : function(params) {
            xP.controls.html.base.init.apply(this, arguments)
            this.init_locale(params)
        },
        val : function(value) {
            if(arguments.length) {
                this.$element.html(value)
                this.change()
                return this
            }
            else return this.disabled? undefined : this.$element.html()
        }
    }
})
