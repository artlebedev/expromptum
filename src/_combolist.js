xP.controls.register({
    name : '_combolist',
    base : 'select',
    prototype : {
        element_selector : '.combolist select, select.combolist',

        init : function(params) {
            xP.controls._combolist.base.init.apply(this, arguments);

            this.$element
                .css({
                    'position' : 'absolute',
                    'z-index' : 888
                })
                .attr('size', 7).attr('tabIndex', -1)
                .hide()[0].selectedIndex = -1;
            ;
        },

        show : function() {
            if(!this._param('do_not_show') && this._.options.length) {
                this.$element.show();

                var offset = this.combobox.$element.offset();

                offset.top += this.combobox.$element.outerHeight();

                this.$element.offset(offset);
            }
            return this;
        },

        hide : function() {
            if(!this._param('do_not_hide')) {
                this.$element.hide();
            }
            return this;
        }
    }
});
