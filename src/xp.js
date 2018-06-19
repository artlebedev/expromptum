/* Core */

var xP = window.expromptum = window.xP = function(params, parent) {
    // TODO: Добавить третий параметр в котором можно передавать data-xp.
    if(!params) {
        params = '[data-xp], [data-expromptum]';
        for(var i = 0, l = xP_controls_registered.length; i < l; i++) {
            params += ','
                + xP.controls[xP_controls_registered[i]]
                    .prototype.element_selector;
        }
    }

    if(
        // CSS selector.
        $.type(params) === 'string'
        // DOM element.
        || params && (
            params.nodeType
            // DOM collection.
            || params[0] && params[0].nodeType
        )
    ) {
        params = $(
            params,
            parent
                ? (
                    parent instanceof xP.controls._item
                        ? parent.$container
                        : parent
                )
                : null
        );
    }

    if(params instanceof jQuery) {
        return xP.controls.init(params);
    }
    else if(params instanceof Object && parent) {
        return xP.controls.create(params, parent);
        // Create by params.
    }
    else {
        xP.debug('', 'error', 'unknown params', params);

        return new xP.list();
    }
};


/* Tools */

xP.register = function(params) {
    var prototype = params.prototype || {},
        expromptum = prototype.init
            ? function() {
                this._ = {};
                prototype.init.apply(this, arguments);
            }
            : null,
        base = params.base;

    // For console.
    prototype.toString = function() {
        return params.name
    };

    if(base) {
        if(!expromptum) {
            expromptum = base.prototype.init
                ? function() {
                    this._ = {};
                    base.prototype.init.apply(this, arguments);
                }
                : function() {
                    this._ = {};
                };
        }

        var f = function() {
        };

        f.prototype = base.prototype;

        expromptum.prototype = new f();

        expromptum.prototype.constructor = expromptum;

        expromptum.base = base.prototype;
    }
    else if(!expromptum) {
        expromptum = function() {
        };
    }

    $.extend(expromptum.prototype, prototype);

    return expromptum;
};

xP.list = function(arr) {
    var result = $.type(arr) === 'array'? arr : (arr? [arr] : []);

    result.append = function(obj) {
        if(!obj) {
            return this;
        }

        if($.type(obj) === 'array') {
            for(var i = 0, l = obj.length; i < l; i++) {
                this.append(obj[i]);
            }

            return this;
        }

        if(this.index(obj) === -1) {
            this.push(obj);
        }

        return this;
    };

    result.remove = function(obj) {
        if($.type(obj) === 'array') {
            var i = obj.length;

            while(i--) {
                this.remove(obj[i]);
            }

            return this;
        }

        var i = this.index(obj);

        if(i > -1) {
            this.splice(i, 1);
        }

        return this;
    };

    result.filter = function(handler) {
        return this.each(handler, true);
    };

    result.each = function(handler, _filter) {
        var i = 0, l = this.length, current, result;

        while(i < l) {
            current = this[i];

            result = handler.call(current, i);

            if(result === false) {
                if(_filter) {
                    this.splice(i, 1);
                }
                else {
                    break;
                }
            }

            if(this[i] === current) {
                i++;
            }
            else {
                l = this.length;
            }
        }

        return this;
    };

    result.first = function(handler) {
        return this.eq(0, handler);
    };

    result.last = function(handler) {
        return this.eq(this.length - 1, handler);
    };

    result.eq = function(i, handler) {
        if(!this.length) {
            return null;
        }

        if(handler) {
            handler.call(this[i % this.length]);
        }

        return this[i % this.length];
    };

    result.index = function(obj) {
        var i = this.length;

        while(i--) {
            if(obj === this[i]) {
                return i;
            }
        }

        return -1;
    };

    return result;
};

xP.debug = function() {
    if(location.href.indexOf('xP=' + arguments[0]) > 0 || location.href.indexOf('xP=debug') > 0) {
        for(var i = 1, l = arguments.length, args = ['xP']; i < l; i++) {
            if(arguments[i] && arguments[i].$element) {
                args.push(arguments[i].name || arguments[i].$element[0].tagName);
            }
            else {
                args.push(arguments[i]);
            }
        }
        console.log.apply(console, args);

        return true;
    }
    else {
        return false;
    }
};

xP.after = function(handler, i) {
    if(i) {
        return setTimeout(function() {
            xP.after(handler, --i);
        }, 0);
    }
    else {
        return setTimeout(function() {
            handler()
        }, 0);
    }
};

xP.taint_regexp = function(value) {
    return value.replace(xP.taint_regexp_pattern, '\\');
};

xP.taint_regexp_pattern = /(?=[\\^$.[\]|()?*+{}])/g;

xP.taint_css = function(value) {
    return value.replace(xP.taint_css_pattern, '\\');
};

xP.taint_css_pattern
    = /(?=[\\^$.[\]|()?*+{}:<>@/~&=])/g;

(function() {
    var e = Element.prototype,
        match = (
            e.matches
            || e.matchesSelector
            || e.msMatchesSelector
            || e.mozMatchesSelector
            || e.webkitMatchesSelector
            || e.oMatchesSelector
        );
    if(match) {
        xP.css_selector_match = function($element, selector) {
            return match.call($element[0], selector);
        };
    }
    else {
        xP.css_selector_match = function($element, selector) {
            return $element.is(selector);
        };
    }
})();


xP.leading_zero = function(digit) {
    if(typeof digit != 'undefined') {
        if(digit >= 10) {
            return digit;
        }
        else {
            return '0' + digit;
        }
    }
    else {
        return;
    }
};


xP.offset_by_viewport = function($element, $relative) {
    $element.css({ 'top' : '100%' });

    var position = $element.offset(),
        element_height = $element.height(),
        window_bottom_pos = window.scrollY + $(window).height(),
        element_bottom_pos = position.top + element_height;

    if(window_bottom_pos < element_bottom_pos) {
        $element.css({ 'top' : -1 * ($element.outerHeight(true)) + 'px' });
    }
};


xP.parse_date = function(value, params) {
    var parse_date_time_pattern = /^(.*?)[\sT]*(\d\d?:\d\d?(?::\d\d?(?:[.:]\d\d*)?)?)(?:(?:\s*GMT)?([-+][:\d]+)?)?(.*)$/,
        parse_date_split_pattern = /[-.,/\s]+/,
        parse_date_separator_pattern = /^\s*[^-./\s]+([-./])/;

    if(!params) {
        params = {};
    }

    if(!params.millennium) {
        params.millennium = 2000;
    }

    var result = {};

    if(!value) {
        value = '';
    }

    value = value.replace(
        parse_date_time_pattern,
        function(str, date1, time, gmt, date2) {
            result.time = time;
            var timex = time.split(':');

            result.hour = timex[0];

            result.minute = timex[1];

            result.gmt = gmt;

            return date1 + date2;
        }
    );

    var parts = value.split(parse_date_split_pattern),
        separator,
        t = value.replace(
            parse_date_separator_pattern,
            function(str, s1) {
                separator = s1;
            }
        );

    if(params.year_from_left === undefined) {
        params.year_from_left = separator == '-';
    }
    if(params.month_from_left === undefined) {
        params.month_from_left = separator == '/';
    }
    for(var i = 0; i < parts.length; i++) {
        if(parts[i] > 31) {
            params.year_from_left = !i;

            result.year = parts.splice(i--, 1)[0];
        }
        else if(parts[i].match(/[^\d]/)) {
            month = this.locale.parse_date_months.indexOf(parts[i].toLowerCase()) % 12 + 1;

            if(month > 0) {
                result.month = xP.leading_zero(month);
            }
            parts.splice(i--, 1);
        }
    }

    if(!result.year && parts.length) {
        if(params.year_from_left) {
            result.year = parts.shift();
        }
        else if(parts.length == 3 - !!result.month * 1) {
            //result.year = parts.pop();
        }
    }
    if(!result.month && parts.length) {
        if(
            parts[0] < 13
            && (
                params.year_from_left
                || params.month_from_left
                || parts[parts.length - 1] > 12
                || (result.year && parts.length == 1)
            )
        ) {
            result.month = parts.shift();
        }
        else if(parts.length > 1 && parts[parts.length - 1] < 13) {
            result.month = parts.pop();
        }
    }
    if(!result.day && parts.length && parts[0] && !(result.year && !result.month)) {
        result.day = parts[0];
    }
    if(result.year && result.year < 100) {
        result.year = result.year * 1 + params.millennium;
    }

    return [
        (typeof result.year != 'undefined'? result.year * 1 : undefined),
        (typeof result.month != 'undefined'? result.month * 1 : undefined),
        (typeof result.day != 'undefined'? result.day * 1 : undefined),
        (typeof result.hour != 'undefined'? result.hour * 1 : undefined),
        (typeof result.minute != 'undefined'? result.minute * 1 : undefined)
    ];
};

/* Controls */

var xP_controls_registered = [], xP_controls_params = {};

xP.controls = {
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
                    name : 'expromptum.controls.' + name,
                    base : $.type(params.base) === 'string'
                        ? this[params.base]
                        : params.base
                }
            )
        );

        if(params.prototype && params.prototype.element_selector) {
            xP_controls_registered.push(name);
        }
    },

    init : function($elements) {
        var result = new xP.list(), that = this;

        $elements.each(function() {
            var $element = $(this), control = that.link($element);

            if(!control) {
                var params = $element.data('xp')
                    || $element.data('expromptum');

                if($.type(params) === 'string') {
                    if(!params.match(/^^\s*{/)) {
                        params = '{' + params + '}';
                    }

                    if(!xP_controls_params[params]) {
                        xP_controls_params[params] = eval(
                            '(function(){return '
                            + params
                            .replace(/([{,])\s*do\s*:/g, '$1\'do\':')
                            + '})'
                        );
                    }

                    params = xP_controls_params[params]();
                }

                $element
                    .removeAttr('data-xp')
                    .removeAttr('data-expromptum');

                if(!params) {
                    params = {};
                }

                if(!params.type) {
                    var i = xP_controls_registered.length;

                    while(i--) {
                        if(
                            xP.css_selector_match(
                                $element,

                                xP.controls[xP_controls_registered[i]]
                                    .prototype.element_selector
                            )
                        ) {
                            params.type = xP_controls_registered[i];

                            break;
                        }
                    }
                }

                if(
                    xP.controls[params.type]
                    && xP.controls[params.type].base
                ) {
                    params.$element = $element;

                    control = new xP.controls[params.type](params);
                }
            }

            if(control) {
                result.append(control);
            }
        });

        return result;
    },

    link : function($element, control) {
        if(control) {
            $element.data('expromptum.control', control);

            if($element[0]) {
                $element[0].expromptum = control;
            }
        }
        else {
            return $element.data('expromptum.control');
        }
    }
};
