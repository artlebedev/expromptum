/* Repeats */

xP.repeats = {
    init : function(control) {
        if(control.repeat) {
            if($.type(control.repeat) !== 'object') {
                control.repeat = {};
            }

            if(!control.root()._param('repeats')) {
                control.root()._param('repeats', {});
            }

            control.repeat.id = control.repeat.id || control.name;

            var id = control.repeat.id,
                repeats = control.root()._param('repeats');

            if(!repeats[id]) {
                repeats[id] = new xP.repeats.item(control);
            }
            else {
                repeats[id].adopt(control);
            }
        }
    }
};


xP.repeats.item = xP.register({
    name : 'expromptum.repeats.item',
    base : xP.base,
    prototype : {
        min : 1,
        max : 300,

        name_suffix_before : '[', // Если пусто, то не будет суфиксов в именах.
        name_suffix_after : ']',

        id_suffix_before : '~',
        id_suffix_after : '',

        container_inited_class : 'repeated',
        container_position_class : 'repeated_',
        container_template_class : 'repeated_template',

        init : function(control) {
            xP.debug(
                'repeats', 'init repeat',
                control, control.repeat.id? control.repeat.id : '', { repeat : this }
            );

            xP.repeats.item.base.init.apply(this);

            this.name_suffix_splitter = new RegExp(
                '('
                + xP.taint_regexp(this.name_suffix_before)
                + '\\d+'
                + xP.taint_regexp(this.name_suffix_after)
                + ')(?=(?:'
                + xP.taint_regexp(this.name_suffix_before)
                + '\\d+'
                + xP.taint_regexp(this.name_suffix_after)
                + ')*$)'
            );

            this.id_suffix_pattern = new RegExp(
                xP.taint_regexp(this.id_suffix_before)
                + '\\d+'
                + xP.taint_regexp(this.id_suffix_after)
                + '$'
            );

            this.container_position_class_pattern = new RegExp(
                '(^|\\s)'
                + xP.taint_regexp(this.container_position_class)
                + '\\d+(?=\\s|$)'
            );

            this._.children = [];

            this.nesting = 0;

            var parent = control;

            while(parent && (parent = parent.parent())) {
                if(parent.repeat) {
                    this.parent = parent;
                    this.nesting = parent.repeat.nesting + 1;
                    break;
                }
            }

            this.adopt(control, true);

            // Если не был задан шаблон, создаем его сами.
            var that = this;

            xP.after(function() {
                if(!that.template) {
                    that.temp_template = true;
                    // TODO: Добавить параметр remove_siblings.

                    var children = that.children(),
                        control = children[children.length - 1];

                    that.append(control);

                    that.temp_template = false;
                }
            }, 1);
        },

        destroy : function(handler, remove) {
            xP.repeats.item.base.destroy.apply(this, arguments);

            if(!arguments.length && this.control._) {
                this.control.root()._param('repeats')[this.id] = null;
            }
            return this;
        },

        val : function(value) {
            return this.children().length;
        },

        children : function() {
            return this._.children;
        },

        adopt : function(control, first) {

            control._param('repeat_position', 0);

            var that = this,
                template = (control.repeat.template || this.temp_template)
                    && !this.template;

            $.extend(this, control.repeat);

            if(!this.control || template) {
                xP.after(function() {
                    that.control = control;
                });

                control.$container
                       .find('*:not([id])').addBack('*:not([id])').each(function() {
                    this.id = 'xP' + (Math.random() + '').substr(2, 8);
                });

                if(!control.html) {
                    control.html = $('<div>')
                        .append(control.$container.clone())
                        .html();
                }
            }

            xP.after(function() {
                control.$container
                       .find('*[id^=xP]').addBack('*[id^=xP]').each(function() {
                    var $e = $(this),
                        control = xP.controls.link($e);

                    if(!control || control.$element[0] !== this) {
                        $e.removeAttr('id');
                    }
                });
            });

            if(template) {
                control._.repeat_template = true;
                control._.no_root_dependencies = true;
                repeat_change_suffixes(
                    this,
                    control,
                    888
                );

                control.$container.hide();

                control.$container.addClass(this.container_template_class);

                xP.after(function() {
                    control.$container
                           .find('input, textarea, select, button').addBack()
                           .attr('disabled', true);
                });
            }
            else {
                repeat_change_suffixes(
                    this,
                    control,
                    this.position !== undefined
                        ? this.position
                        : this.children().length
                );

                this.children().push(control);
            }

            if(this.control) {
                repeat_new_control_count++;
            }

            control.repeat = this;

            control.destroy(function() {
                var children = that.children(), i = children.length;

                while(i--) {
                    if(control === children[i]) {
                        that._.children.splice(i, 1);

                        break;
                    }
                }

                if(!that.children().length) {
                    that.destroy();
                }
            });

            control.$container.addClass(this.container_inited_class);

        },

        move : function(control, new_position) {
            var children = this.children(), i, l,
                old_position = control._param('repeat_position');

            if(new_position < old_position) {
                control.$container.insertBefore(
                    children[new_position].$container
                );

                i = new_position;
                l = children.length;
            }
            else {
                control.$container.insertAfter(
                    children[new_position].$container
                );

                i = old_position;
                l = new_position + 1;
            }

            children.splice(
                new_position, 0, children.splice(old_position, 1)[0]
            );

            for(; i < l; i++) {
                repeat_change_suffixes(
                    this,
                    children[i],
                    i
                );
            }

            this.change();
        },

        remove : function(control) {
            var children = this.children(), i = children.length, l = i - 1;

            while(i--) {
                if(control === children[i]) {
                    children.splice(i, 1);

                    break;
                }
            }

            control.remove();

            while(i < l) {
                repeat_change_suffixes(
                    this,
                    children[i],
                    i
                );

                i++;
            }

            this.change();
        },

        append : function(control, before) {
            var children = this.children(), i = children.length, l = i;

            while(i--) {
                if(control === children[i]) {
                    break;
                }
            }

            if(before) {
                i--;
            }

            while(l-- && l > i) {
                repeat_change_suffixes(
                    this,
                    children[l],
                    l + 1
                );
            }

            var id_suffix = this.id_suffix_before
                + repeat_new_control_count + this.id_suffix_after,
                $container = $(
                    this.control._get_html().replace(
                        /(\s(id|for|list)\s*=\s*"[^"]+)"/g,
                        '$1' + id_suffix + '"'
                    ).replace(
                        /(\sname\s*=\s*"[^"]+)"/g,
                        '$1_xp_repeat_temp"'
                    )
                );

            $container.find('[data-xp], [data-expromptum]')
                      .removeAttr('data-xp').removeAttr('data-expromptum');

            $container.find('[disabled]')
                      .add($container.filter('[disabled]'))
                      .removeAttr('disabled'); // For FF 28

            if(before) {
                $container.insertBefore(control.$container);
            }
            else {
                $container.insertAfter(control.$container);
            }

            var result = repeat_init_new_control(
                this,
                $container,
                this.control,
                id_suffix,
                this.temp_template? 888 : i + 1
            );

            var that = this;

            $container.find('input, textarea, select')
                      .add($container.filter('input, textarea, select'))
                      .not(function() {
                          var reset = xP(this).first().reset_on_repeat;
                          return that.reset && reset === false
                              || !that.reset && !reset;
                      })
                      .removeAttr('checked')
                      .prop('checked', false)
                      .not(
                          '[type=button], [type=img], [type=submit],'
                          + '[type=checkbox], [type=radio]'
                      )
                      .val('')
                      .filter('select').each(function() {
                this.selectedIndex = 0
            });

            if(!this.temp_template) {
                var c = this.children().pop();

                this.children().splice(i + 1, 0, c);
            }

            this.change();

            return result;
        }

    }
}, 'xP.repeats.item');


var repeat_init_new_control = function(
    repeat, $container, control, id_suffix, position
    ) {
        var id = control.$element.attr('id');

        if(!id) {
            return;
        }

        var selector = '#'
            + xP.taint_css(
                id.replace(
                    repeat.id_suffix_pattern, ''
                )
                + id_suffix
            ),
            $element = $container.is(selector)
                ? $container
                : $(selector, $container);

        if(!$element[0]) {
            if(window.console) {
                // TODO: Не забыть убрать это после тестирования.
                // Возникает при вложенных repeat-ах.
                console.warn(
                    'In', $container,
                    'not found', selector,
                    'by', control.$element.first(), 'via suffix', id_suffix
                );
            }
            return;
        }

        var params = repeat_get_params(
            repeat,
            $container,
            control,
            id_suffix
        );

        params.$element = $element;

        params.changed = undefined;

        if(control.repeat) {
            if(control.repeat.id !== repeat.id) {
                params.repeat = {};
                $.each(control.repeat, function(name, value) {
                    if(
                        name.indexOf('_') != 0
                        && name !== 'position'
                        && !(value instanceof xP.controls._item)
                        && !(value instanceof jQuery)
                        && $.type(value) !== 'function'
                    ) {
                        params.repeat[name] = value;
                    }
                });
                params.repeat.id = control.repeat.id + id_suffix;

                if(
                    control === control.repeat.control
                    && !repeat.temp_template
                ) {
                    params.repeat.template = true;
                }
            }
            else {
                control.repeat.position = position;
            }
        }

        var result = xP.controls.link(params.$element);

        if(!result) {
            result = new xP.controls[params.type](params);
        }

        if(control.children) {
            control.children().each(function() {
                repeat_init_new_control(
                    repeat,
                    $container,
                    this,
                    id_suffix,
                    position
                );
            });
        }

        return result;
    },

    repeat_change_suffixes = function(repeat, control, position) {
        control._param('repeat_position', position);

        control.$container[0].className =
            control.$container[0].className.replace(
                repeat.container_position_class_pattern, ''
            );

        if(!repeat.name_suffix_before) {
            return;
        }

        control._.repeat_suffix
            = (repeat.parent && repeat.parent._.repeat_suffix
            ? repeat.parent._.repeat_suffix : '')
            + repeat.name_suffix_before
            + position + repeat.name_suffix_after;

        control.$container.addClass(
            repeat.container_position_class + position
        );

        var option_names = {},
            root_options = control.root()._param('_option');

        control.$container.find('[name]').addBack('[name]').each(function() {
            var $e = $(this),
                name = $e.attr('name'),
                type = $e.attr('type'),
                parts = name.replace(/_xp_repeat_temp$/, '').split(repeat.name_suffix_splitter),
                new_name = parts[0] + control._.repeat_suffix;

            for(var i = repeat.nesting * 2 + 3, l = parts.length; i < l; i++) {
                new_name += parts[i];
            }

            if(name !== new_name) {
                $e.attr('name', new_name);

                if(type === 'checkbox' || type === 'radio') {
                    option_names[name] = new_name;
                }
            }
        });

        $.each(option_names, function(name, value) {
            if(root_options && root_options[name]) {
                root_options[value] = root_options[name];

                root_options[name] = null;
            }
        });

        var parent = control.parent();

        if(parent) {
            parent.children().sort(function(a, b) {
                if(
                    a._param('repeat_position')
                    < b._param('repeat_position')
                ) {
                    b.change();

                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    },

    repeat_get_params = function(repeat, $container, object, id_suffix) {
        var result = {};

        $.each(object, function(name, value) {
            if(
                name.indexOf('_') != 0
                && !(value instanceof jQuery)
                && ($.type(value) !== 'function' || name === 'on')
            ) {
                result[name] = repeat_get_params_value(
                    repeat,
                    $container,
                    value,
                    id_suffix
                );
            }
        });

        return result;
    },

    repeat_get_params_value = function(
        repeat, $container, object, id_suffix
    ) {
        var result, id, new_id, tainted_new_id;

        if($.type(object) === 'array') {
            result = [];

            for(var i = 0, l = object.length, v; i < l; i++) {
                v = repeat_get_params_value(
                    repeat, $container, object[i], id_suffix
                );

                if(v !== undefined) {
                    result.push(v);
                }
            }
        }
        else {
            if(
                object instanceof xP.controls._item
                && object.$element
                && object.$element.attr('id')
            ) {
                id = object.$element.attr('id');
            }
            else if(object && object.id) {
                id = object.id;
            }

            if(id) {
                new_id = id.replace(repeat.id_suffix_pattern, '')
                    + id_suffix;

                tainted_new_id = xP.taint_css(new_id);
            }

            if(
                id
                && (
                    $container.attr('id') == new_id
                    || $container.find('#' + tainted_new_id).length
                )
            ) {
                result = '[id=' + tainted_new_id + ']';
            }
            else if(
                object instanceof xP.repeats.item
                || object instanceof xP.controls._item
            ) {
                result = object;
            }
            else if($.type(object) === 'object') {
                result = repeat_get_params(
                    repeat, $container, object, id_suffix
                );
            }
            else {
                result = object;
            }
        }

        return result;
    },

    repeat_new_control_count = 0;
