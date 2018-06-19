/* Dependencies */

var xP_dependencies_registered = [], xP_dependencies_on = {};

xP.dependencies = {
    _controls : {},
    _functions : [],

    register : function(params) {
        var name = params.name;

        if(!params.prototype) {
            params.prototype = {};
        }

        params.prototype.type = name;

        this[params.name] = xP.register(
            $.extend(
                params,
                {
                    name : 'expromptum.dependencies.' + name,
                    base : $.type(params.base) === 'string'
                        ? this[params.base]
                        : params.base
                }
            )
        );

        xP_dependencies_registered.push(name);
    },

    init : function(params, control) {
        var that = this;

        xP.after(function() {
            if(!control && params instanceof xP.controls._item) {
                control = params;
            }

            var i = 0, l = xP_dependencies_registered.length, param;

            for(; i < l; i++) {
                param = params[xP_dependencies_registered[i]];

                if(param && !(param instanceof xP.dependencies._item)) {
                    if($.type(param) === 'array') {
                        for(var ii = 0, ll = param.length; ii < ll; ii++) {
                            if(!(param[ii] instanceof xP.dependencies._item)) {
                                new that[xP_dependencies_registered[i]](
                                    param[ii], control
                                );
                            }
                        }
                    }
                    else {
                        new that[xP_dependencies_registered[i]](
                            param, control
                        );
                    }
                }
            }
        });
    }
};

xP.dependencies.register({
    name : '_item',
    base : xP.base,
    prototype : {
        init : function(params, control) {

            if($.type(params) === 'string') {
                params = { on : params };
            }

            if(!control) {
                control = params.to;
            }
            else {
                this.to = control;
            }
            xP.dependencies._item.base.init.apply(this, [params, control]);

            var that = this,
                root = control.parent && control.parent()
                    ? control.root() : null;

            var parse_controls = function(param, values) {
                if($.type(param) !== 'array') {
                    param = [param];
                }

                var result = new xP.list(), c, i, l;
                for(i = 0, l = param.length; i < l; i++) {
                    if($.type(param[i]) === 'string') {
                        c = xP(param[i]);
                        if(!c.length) {
                            xP.debug(
                                '', 'error',
                                param[i] + ' in dependence not found',
                                that
                            );
                        }
                        else {
                            result.append(c, root);
                        }
                    }
                    else {
                        result.append(param[i]);
                    }
                }

                if(values !== undefined) {
                    result.filter(function() {
                        if(!this.$element.is('[value]')) {
                            return true;
                        }
                        else {
                            var i, l = values.length;
                            for(i = 0; i < l; i++) {
                                if($.type(values[i]) === 'regexp') {
                                    if(
                                        this.$element.val()
                                            .match(values[i])
                                    ) {
                                        return true;
                                    }
                                }
                                else {
                                    if(this.$element.val() == values[i]) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    });
                }

                return result;
            };

            if(this.values !== undefined && $.type(this.values) !== 'array') {
                this.values = [this.values];
            }

            this.to = parse_controls(this.to, this.values);

            this.from = parse_controls(this.from);

            if($.type(this.on) === 'string') {
                this.on = this.on.replace(
                    /((?:\[(?:[^[\]]+=(?:[^[\]]|\[[^[\]]*])+|this|self)])+)(\.?)/g,
                    function() {
                        var control;

                        if(
                            arguments[1] === '[this]'
                            || arguments[1] === '[self]'
                        ) {
                            control = that.to;
                        }
                        else {
                            control = xP(arguments[1], root);

                            if(!control[0]) {
                                control = xP(arguments[1]);
                            }

                            if(
                                !control[0]
                                && root && root.$element.is(arguments[1])
                            ) {
                                control = [root];
                            }
                        }

                        that.from.append(control);

                        var id = that.from.index(control[0]);

                        if(id < 0) {
                            // TODO: Может стоит отменить зависимость?
                            xP.debug(
                                '', 'error',
                                arguments[1] + ' in dependence not found',
                                that
                            );

                            return arguments[0];
                        }

                        return 'arguments["' + id + '"].'
                            + (arguments[2] == '.'
                                    ? ''
                                    : (control[0] instanceof xP.controls.fields
                                    ? 'count'
                                    : 'val') + '()'
                            );
                    });

                if(!xP_dependencies_on[this.on]) {
                    xP_dependencies_on[this.on] = eval('(function (){return ' + this.on + '})');
                }

                this.on = xP_dependencies_on[this.on];
            }

            if(!this.from.length) {
                this.from.push(control);
            }

            var destroy = function() {
                that.destroy();
            };

            this.suprocess = function() {
                that.process();
            };

            this.from.each(function() {
                this.change(that.suprocess);

                this.destroy(destroy);
            });

            var dependence_init_inquiry = that.type + '_init_inquiry';

            this.to.each(function() {
                var control = this, dependence = control[that.type];

                if(!dependence || !dependence.append) {
                    dependence = control[that.type] = new xP.list();
                }

                dependence.append(that);

                // TODO: Нужно удалять только, когда удалены все контролы.
                control.destroy(destroy);

                //return;
                if(!control._param(dependence_init_inquiry)) {
                    control._param(
                        dependence_init_inquiry,
                        xP.after(function() {
                            dependence.each(function() {
                                this.to.each(function() {
                                    this._init_val();
                                });

                                this.suprocess();
                            });

                            control._param(dependence_init_inquiry, null);
                        }, 0)
                    );
                }
            });

            xP.debug(
                'dependencies', 'init dependence ' + this.type,
                this.to.first(), { dependence : this }
            );
        },

        destroy : function() {
            var that = this;

            if(this.from) {
                this.from.each(function() {
                    this.change(that.suprocess, true);
                });
            }

            if(this.to) {
                this.to.each(function() {
                    this[that.type] = null;
                });
            }

            this.from
                = this.to
                = this.on
                = this['do']
                = null;

            return this;
        },

        process : function() {
            this.result = this.on.apply(this, this.from);
        }

    }
});
