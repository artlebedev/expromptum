xP.controls.register({
    name : 'sheet',
    base : 'fields',
    prototype : {
        element_selector : '.sheet',

        init : function(params) {
            xP.controls.sheet.base.init.apply(this, arguments);

            this.init_locale(params);

            if(this.$label && this.$label[0]) {
                var parent = this.parent(), that = this;

                this.select(
                    !parent._param('selected_sheet')
                    || this.selected
                    || this.$label.hasClass(this.selected_class)
                );

                this.$label.click(function() {
                    that.select();
                });
            }
        },

        show : function(complete) {
            if(!this.selected) {
                this.select();

                if(complete) {
                    complete();
                }
            }

            return this;
        },

        select : function(select) {
            if(this.disabled) {
                return this;
            }

            this.selected = !arguments.length || select;

            if(this.selected) {
                var parent = this.parent(),
                    previous = parent._param('selected_sheet');

                if(previous !== this) {
                    if(previous) {
                        previous.select(false);
                    }

                    parent._param('selected_sheet', this);

                    this.$container.add(this.$label)
                        .removeClass(this.unselected_class)
                        .addClass(this.selected_class);
                }
            }
            else {
                this.$container.add(this.$label)
                    .removeClass(this.selected_class)
                    .addClass(this.unselected_class);
            }
            return this;
        },

        disable : function(disabled) {
            xP.controls.sheet.base.disable.apply(this, arguments);

            if(this.disabled) {
                this.$label
                    .addClass(this.container_disabled_class)
                    .attr('disabled', true);
            }
            else {
                this.$label
                    .removeClass(this.container_disabled_class)
                    .removeAttr('disabled', true);
            }

            return this;
        },

        selected_class : 'selected',
        unselected_class : 'unselected'
    }
});
