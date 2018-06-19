xP.controls.register({
    name : '_parent',
    base : '_item',
    prototype : {
        element_selector : '.xp',

        init : function(params) {
            this.changed = {};

            this._.children = new xP.list();

            xP.controls._parent.base.init.apply(this, arguments);

            this._.$pocus = this.$element;

            this._.children_values = {};

            var parent4values = this._.parent || this._.root;

            while(
                !parent4values.name
                && !parent4values.repeat
                && parent4values._.parent
                && parent4values !== this._.root
                ) {
                parent4values = parent4values._.parent;
            }

            this._.parent4values = parent4values;
        },

        children : function() {
            return this._.children;
        },

        destroy : function(handler, remove) {
            if(!arguments.length) {
                this._.parent4values._unsave_val(this);
            }

            return xP.controls._parent.base.destroy.apply(this, arguments);
        },

        disable : function(disabled) {
            disabled = !arguments.length || disabled;

            if(this.disabled !== disabled) {
                xP.controls._parent.base.disable.apply(this, arguments);

                if(this.disabled) {
                    this._.parent4values._unsave_val(this);
                }

                this._.children.each(function() {
                    this.disable(disabled);
                });
            }

            return this;
        },

        val : function(value, _suffix) {
            if(!arguments.length) {
                return this._.children_values;
            }
            else {
                if(this.repeat) {

                    if($.type(value) !== 'array') {
                        value = [value];
                    }

                    var siblings = this.repeat.children(),
                        l = value.length,
                        sibling;

                    while(siblings.length > l) {
                        this.repeat.remove(siblings[siblings.length - 1]);
                    }

                    for(var i = 0; i < l; i++) {
                        sibling = siblings[i];
                        if(!sibling) {
                            sibling = this.repeat.append(siblings[i - 1]);
                        }
                        sibling._set_vals(
                            value[i],
                            _suffix + this.repeat.name_suffix_before
                            + i + this.repeat.name_suffix_after
                        );
                    }
                }
                else {
                    this._set_vals(value, '');
                }

                return this;
            }
        },

        _set_vals : function(value, suffix) {
            var that = this;
            xP.after(function() {
                $.each(value, function(name, value) {
                    var controls = that._find_by_name(name)
                        || that._find_by_name(name + suffix);

                    if(controls) {
                        for(var i = 0, l = controls.length; i < l; i++) {
                            controls[i].val(value, suffix);
                        }
                    }
                });
            }, 4);
            // TODO: Ох уж эти мне таймауты. Нужно с ними разбираться.
        },

        change : function(handler, remove) {
            if(!arguments.length && this._.parent4values) {
                this._.parent4values._save_val(this);
            }

            return xP.controls._parent.base.change.apply(this, arguments);
        },

        _save_val : function(child) {
            if(child.name) {
                if(child.repeat) {
                    var values = this._.children_values[child.name];

                    if($.type(values) !== 'array') {
                        values = this._.children_values[child.name] = [];
                    }

                    if(!child._.repeat_template) {
                        values[child._.repeat_position] = child.val();
                    }
                }
                else {
                    // TODO: Надо избавиться от этого, сохранять name в неизменном виде.
                    var name = this.repeat
                        ? child.name.split(
                            this.repeat.name_suffix_splitter
                        )[0]
                        : child.name;

                    if(child instanceof xP.controls.checkbox) {
                        // TODO: Надо это в соответствующий контрол утащить. Да и обо всем остальном подумать.
                        this._.children_values[name] = values = [];

                        if(!child._.group) {
                            return;
                        }

                        child._.group.siblings.each(function() {
                            var value = this.val();

                            if(value !== '') {
                                values.push(value);
                            }
                        });
                    }
                    else {
                        this._.children_values[name] = child.val();
                    }
                }
            }
        },

        _unsave_val : function(child) {
            if(child.name) {
                if(child.repeat) {
                    var values = this._.children_values[child.name];

                    if(!child._.repeat_template) {
                        values.splice(child._.repeat_position, 1);
                    }
                }
                else {
                    var name = this.repeat
                        ? child.name.split(
                            this.repeat.name_suffix_splitter
                        )[0]
                        : child.name;

                    delete this._.children_values[name];
                }
            }
        },

        focus : function() {
            var that = this, f = function() {
                that._.$pocus.focus()[0].scrollIntoView();
            };

            if(!this._.$pocus.is(':visible')) {
                var parent = this;

                while((parent = parent.parent()) && parent != this) {
                    if(parent.show) {
                        parent.show(f);
                    }
                }
            }
            else {
                f();
            }

            return this;
        },

        _find_by_name : function(name) {
            var result = [], subresult;

            this.children().each(function() {
                if(this.name == name) {
                    subresult = [this];
                }
                else if(this._find_by_name) {
                    subresult = this._find_by_name(name);
                }
                else {
                    subresult = null;
                }

                if(subresult) {
                    result = result.concat(subresult);

                    if(!(subresult[0] instanceof xP.controls._option)) {
                        return false;
                    }
                }
            });

            return result.length? result : null;
        }
    }
});
