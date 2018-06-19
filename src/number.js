xP.controls.register({
    name : 'number',
    base : '_secret',
    prototype : {
        element_selector : 'input.number, .number input',

        step : 1,
        min : 1 - Number.MAX_VALUE,
        def : 0,
        max : Number.MAX_VALUE - 1,

        init : function(params) {
            var that = this;

            this.valid = '[this].min <= [this] && [this] <= [this].max';

            xP.controls.number.base.init.apply(this, arguments);

            this.init_locale(params);

            this.$element.wrap(this.element_wrap_html);

            this.allow_chars_pattern = new RegExp(
                '^[-0-9'
                + this.locale.number.decimal
                + this.locale.number.grouping
                + ']$'
            );

            $(this.control_button_dec_html)
                .insertBefore(this.$element)
                .mousedown(function() {
                    if(!that.disabled) {
                        that.dec();
                    }

                    return false;
                });

            $(this.control_button_inc_html)
                .insertAfter(this.$element)
                .mousedown(function() {
                    if(!that.disabled) {
                        that.inc();
                    }

                    return false;
                });

            this.$element
                .val(this._format(this.$element.val()))
                .keydown(function(ev) {
                    if(ev.which === 38) { // up.
                        that.inc();

                        return false;
                    }
                    else if(ev.which === 40) { // down.
                        that.dec();

                        return false;
                    }
                });

            this.$element.blur(function() {
                that.val(that.val());
            });
        },

        element_wrap_html : '<ins class="number_control"/>',

        control_button_dec_html :
            '<span class="control_button control_button_dec"/>',

        control_button_inc_html :
            '<span class="control_button control_button_inc"/>',

        inc : function() {
            var value = this.val();

            if(!value && value !== 0) {
                this.val(value = this.def);
            }

            value = value - 0 + this.step * 1;

            if(value > this.max * 1) {
                return false;
            }
            else if(value < this.min * 1) {
                value = this.min;
            }

            return this.val(value);
        },

        dec : function() {
            var value = this.val();

            if(!value && value !== 0) {
                this.val(value = this.def);
            }

            value = value - this.step * 1;

            if(value < this.min * 1) {
                return false;
            }
            else if(value > this.max * 1) {
                value = this.max;
            }

            return this.val(value);
        },

        param : function(name, value) {
            if(
                (name === 'min' && this.val() < value)
                || (name === 'max' && this.val() > value)
            ) {
                this.val(value);
            }

            if((name === 'min' || name === 'max') && this.valid.process) {
                var result = xP.controls.number.base.param.apply(
                    this, arguments
                );

                this.valid.process();

                return result;
            }

            return xP.controls.number.base.param.apply(
                this, arguments
            );
        },

        val : function(value) {
            if(!arguments.length) {
                return this.disabled
                    ? undefined
                    : this._unformat(this.$element.val());
            }
            else {
                value = this._unformat(value);
                this.$secret.val(value);

                return xP.controls.number.base.val.apply(
                    this,
                    [this._format(value)]
                );
            }
        },

        _format : function(value) {
            var num = this.locale.number;

            value = (value + '').split('.');

            return value[0].replace(num.format.grouping, '$1' + num.grouping)
                + (value[1]
                    ? num.decimal + value[1]
                    : '');
        },

        _unformat : function(value) {
            var num = this.locale? this.locale.number : null;

            if(!num) return value;

            if(!value) return '';

            return value !== '' && value !== undefined
                ? ((value + '')
                .replace(num.unformat.grouping, '')
                .replace(num.unformat.decimal, '.')
                .replace(/[^-.0-9]/g, '') * 1)
                .toPrecision(15) * 1
                : '';
        }
    }
});
