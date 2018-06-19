xP.controls.register({
    name : 'select',
    base : '_field',
    prototype : {
        element_selector : 'select',

        hide_disabled_option : true,
        enable_by : 'value',

        init : function(params) {
            xP.controls.select.base.init.apply(this, arguments);

            this._.element = this.$element[0];
            this._.options = this._.element.options;

            this._.all_options = xP.list(this._.all_options);
            this._.enabled_options = xP.list(this._.enabled_options);

            for(var i = 0, l = this._.options.length; i < l; i++) {
                this._.all_options.append(this._.options[i]);
                this._.enabled_options.append(this._.options[i]);
            }
        },

        append : function(params) {
            if($.type(params) !== 'array') {
                params = [params];
            }

            var options = this._.options, i = 0, l = params.length, ii;

            for(; i < l; i++) {
                ii = options.length;

                options[ii] = $.type(params[i]) === 'array'
                    ? new Option(params[i][0], params[i][1])
                    : (
                        $.type(params[i]) !== 'object'
                            ? new Option(params[i])
                            : (
                                params[i] instanceof Option
                                    ? params[i]
                                    : new Option(params[i].label, params[i].value)
                            )
                    );

                this._.all_options.push(options[ii]);

                this._.enabled_options.push(options[ii]);
            }

            return this;
        },

        remove : function() {
            this._.options.length = 0;
            this._.all_options.length = 0;
            this._.enabled_options.length = 0;

            return this;
        },

        disable : function(disabled, dependence) {
            if(dependence && dependence.values !== undefined) {
                // TODO: Добавить поддержку optgroup.
                var that = this, values = dependence.values,
                    i, l = values.length;

                if(!this._.enable_options) {
                    this._.enabled_options.length = 0;
                }

                this._.all_options.each(function() {
                    var disable = true;

                    if(!disabled) {
                        for(i = 0; i < l; i++) {
                            if($.type(values[i]) === 'regexp') {
                                disable
                                    = !this[that.enable_by].match(values[i]);
                            }
                            else {
                                disable = this[that.enable_by] != values[i];
                            }

                            if(!disable) {
                                that._.enabled_options.append(this);

                                break;
                            }
                        }
                    }

                    if(disable) {
                        this.disabled = 'true';
                    }
                });

                clearTimeout(this._.enable_options);

                this._.enable_options = xP.after(function() {
                    that._.enable_options = null;

                    var options = that._.options;

                    if(that.hide_disabled_option) {
                        options.length = 0;

                        that._.enabled_options.each(function(i) {
                            this.disabled = '';

                            if(!this.parentNode) {
                                options[options.length] = this;
                            }
                        });
                    }
                    else {
                        that._.enabled_options.each(function(i) {
                            this.disabled = '';
                        });

                        var selected = that._.element.selectedIndex;

                        if(!options[selected] || options[selected].disabled) {
                            that._.element.selectedIndex =
                                that._.all_options.index(
                                    that._.enabled_options.first()
                                );
                        }
                    }

                    that.change();

                    //that._.enabled_options.length = 0;
                });

                return this;
            }
            else {
                return xP.controls.select.base.disable.apply(this, arguments);
            }
        },

        val : function(value) {
            if(!arguments.length) {
                return this.disabled? undefined : this.$element.val();
            }
            else {
                if(this._.element.value != value) {
                    this.$element.val(value);

                    this.change();
                }

                return this;
            }
        },

        text : function() {
            if(this.disabled) {
                return undefined;
            }
            else {
                var option = this._.options[this._.element.selectedIndex];
                return option? option.text : null;
            }
        },

        change : function(handler, remove) {
            if(!arguments.length) {
                this.$selected = $(this._.options[this._.element.selectedIndex]);
            }

            return xP.controls.select.base.change.apply(this, arguments);
        }
    }
});
