/* Controls */

var xP_controls_params = {};

xP._controls_registered = []

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
            xP._controls_registered.push(name);
        }
    },

    init : function($elements) {
        var result = new xP.list(), that = this;

        $elements.each(function() {
            var $element = $(this),
                control = that.link($element);

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
                    var i = xP._controls_registered.length;

                    while(i--) {
                        if($element[0].matches(xP.controls[xP._controls_registered[i]].prototype.element_selector)) {
                            params.type = xP._controls_registered[i];

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
