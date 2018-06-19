xP.controls.register({
    name : '_field',
    base : '_labeled',
    prototype : {
        element_selector : 'input',
        container_selector : '.field',

        init : function(params) {
            xP.controls._field.base.init.apply(this, arguments);

            var that = this;

            this.$element.on(this.change_events, function() {
                that.change();
            });

            this.$element.blur(function() {
                that.$container.addClass(that.container_blured_class);
            });

            if(this.$container == this.$element) {
                if(this.$label[0] && this.$element.parents().is(this.$label)) {
                    this.$container = this.$label;
                }
                else {
                    this.$container = this.$container.add(this.$label);
                }
            }

            if(this.allow_chars_pattern) {
                this.$element.keypress(function(ev) {
                    if(
                        ev.charCode
                        && !(ev.metaKey || ev.ctrlKey || ev.altKey)
                        && !String.fromCharCode(ev.charCode).match(
                        that.allow_chars_pattern
                        )
                    ) {
                        return false;
                    }
                });
            }

            xP.controls._field.base.change.apply(this);
        },

        change_events : 'keyup input change',
        container_blured_class : 'blured',

        change : function(handler, remove) {
            if(!arguments.length) {
                var that = this,
                    changed = false,
                    old = this._param('value'),
                    cur = this.val();

                if(old !== cur) {
                    changed = true;
                    this._param('value', cur);
                }

                if(changed) {
                    return xP.controls._field.base.change.apply(
                        this,
                        arguments
                    );
                }
                else {
                    return this;
                }
            }
            else {
                return xP.controls._field.base.change.apply(this, arguments);
            }
        },

        val : function(value) {
            if(!arguments.length) {
                return this.disabled? undefined : this.$element.val();
            }
            else if(!this.disabled && !this.$element.attr('readonly')) {
                var el = this.$element[0];

                if(this.$element.is(':focus')) {
                    var start = el.selectionStart,
                        end = el.selectionEnd;
                }

                if(el.value + '' != value + '') {
                    el.value = value;

                    if(this.$element.is(':focus')) {
                        el.selectionStart = start;

                        el.selectionEnd = end;
                    }

                    this.change();
                }

                return this;
            }
        }
    }
});
