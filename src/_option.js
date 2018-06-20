xP.controls.register({
    name : '_option',
    base : '_field',
    prototype : {
        container_selector : '.option',

        init : function(params) {
            xP.controls._option.base.init.apply(this, arguments);

            if(!this.root()._param('_option')) {
                this.root()._param('_option', {});
            }

            if(!this.root()._param('_option')[this.name]) {
                this.root()._param('_option')[this.name]
                    = {
                    siblings : new xP.list(),
                    enabled_options : new xP.list()
                };
            }

            this._.group = this.root()._param('_option')[this.name];

            this._.group.siblings.append(this);

            this.selected = null;

            this._init_val();
        },

        destroy : function(handler, remove) {
            if(!arguments.length) {
                if(this._.group.selected === this) {
                    this._.group.selected = null;
                }

                this.disable();

                this._.group.siblings.remove(this);
            }

            return xP.controls._option.base.destroy.apply(this, arguments);
        },

        append : function(params) {
            if($.type(params) !== 'array') {
                params = [params];
            }

            var i = 0, l = params.length, html = '', id;

            for(; i < l; i++) {
                id = this.name + '_' + (this._.group.siblings.length + i);

                html += '<div class="option"><input type="' + this.type
                    + '" name="' + this.name + '" id="' + id
                    + '" value="' + (
                        $.type(params[i]) === 'array'
                            ? params[i][1]
                            : params[i]
                    ) + '"/><label for="' + id + '">' + (
                        $.type(params[i]) === 'array'
                            ? params[i][0]
                            : params[i]
                    ) + '</label></div>'
            }

            return xP($(html).insertAfter(this.$container).find('input'));
        },

        change_events : 'change',

        change : function(handler, remove) {
            this.select(this.$element.is(':checked'), true);

            xP.controls._option.base.change.apply(this, arguments);

            return this;
        },

        _init_val : function() {
//			this.select(this.$element.is(':checked'));

            if(this.selected) {
                this.$container.addClass(this.container_initial_selected_class);
            }

            xP.controls._option.base._init_val.apply(this, arguments);
        },

        container_initial_selected_class : 'initial_selected',
        container_selected_class : 'selected',

        val : function(value) {
            if(!arguments.length) {
                return !this.selected
                    ? (this.disabled? undefined : '')
                    : xP.controls._option.base.val.apply(this, arguments);
            }
            else if($.type(value) === 'array') {
                var i = value.length;

                while(i--) {
                    if(this.$element[0].value == value[i]) {
                        break;
                    }
                }

                this.select(i > -1);
            }
            else {
                this.select(this.$element[0].value == value);
            }

            return this;
        },

        select : function(selected, _onchange) {
            selected = !arguments.length || selected;

            if(this.selected !== selected) {
                this.selected = selected;

                this.$container.toggleClass(
                    this.container_selected_class,
                    selected
                );

                if(selected) {
                    this.$element.attr('checked', true).prop('checked', true);
                    this.$element[0].checked = true; // For FF 18.
                }
                else {
                    this.$element.removeAttr('checked').prop('checked', false);
                }

                if(!_onchange) {
                    this.change();
                }
            }
            return this;
        },

        disable : function(disabled, dependence) {
            if(dependence && dependence.values !== undefined) {
                if(!this._.group.enable_options) {
                    this._.group.enabled_options.length = 0;
                }

                if(!disabled) {
                    this._.group.enabled_options.append(this);
                }
                else if(this._.group.enabled_options.indexOf(this) == -1) {
                    this.disable(true);
                }

                clearTimeout(this._.group.enable_options);

                var that = this;

                this._.group.enable_options = xP.after(function() {
                    that._.group.enable_options = null;

                    that._.group.enabled_options.each(function(i) {
                        this.disable(false);
                    });

                    //that.change();
                });

                return this;
            }
            else {
                return xP.controls._option.base.disable.apply(this, arguments);
            }
        }
    }
});
