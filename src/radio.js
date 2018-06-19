xP.controls.register({
    name : 'radio',
    base : '_option',
    prototype : {
        element_selector : '[type=radio]',

        disable : function(disabled) {
            disabled = !arguments.length || disabled;

            if(this.disabled !== disabled) {
                xP.controls.radio.base.disable.apply(this, arguments);

                if(disabled) {
                    if(this.selected) {
                        var that = this;

                        //xP.after(function(){
                        this._.group.siblings.each(function() {
                            if(!this.disabled && this !== that) {
                                this.select();

                                return false;
                            }
                        });
                        //});
                    }
                }
                else if(
                    this._.group.selected
                    && this._.group.selected.disabled
                    && this._.group.selected != this
                ) {
                    this.select();

                    this.change();
                }
            }
            else {
                xP.controls.radio.base.disable.apply(this, arguments);
            }

            return this;
        },

        select : function(selected, _onchange) {
            selected = !arguments.length || selected;

            if(this.selected !== selected) {
                if(selected && this._.group) {
                    var that_selected = this._.group.selected;

                    this._.group.selected = this;

                    if(that_selected) {
                        //xP.after(function(){
                        that_selected.select(false);
                        //});
                    }
                }
                xP.controls.radio.base.select.apply(this, arguments);
            }

            return this;
        }
    }
});
