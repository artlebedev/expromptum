/* Controls */

const xP_controls_params = {}

xP._controls_registered = []

xP.controls = {
    register(params) {
        const name = params.name
        if(!params.prototype) {
            params.prototype = {}
        }
        params.prototype.type = name
        this[params.name] = xP.register(Object.assign(params, {
            name : 'expromptum.controls.' + name,
            base : typeof params.base === 'string'?
                this[params.base] :
                params.base
        }))
        if(params.prototype && params.prototype.element_selector) {
            xP._controls_registered.push(name)
        }
    },

    init($elements) {
        const result = new xP.list
        const that = this
        $elements.each(function() {
            const $element = $(this)
            let control = that.link($element)
            if(!control) {
                let params = $element.data('xp') || $element.data('expromptum')
                if(typeof params === 'string') {
                    if(!params.match(/^^\s*{/)) {
                        params = '{' + params + '}'
                    }
                    if(!xP_controls_params[params]) {
                        const code = '(function(){return ' + params.replace(/([{,])\s*do\s*:/g, '$1\'do\':') + '})'
                        xP_controls_params[params] = eval(code)
                    }
                    params = xP_controls_params[params]()
                }
                $element.removeAttr('data-xp').removeAttr('data-expromptum')
                if(!params) {
                    params = {}
                }
                if(!params.type) {
                    let i = xP._controls_registered.length
                    while(i--) {
                        if($element[0].matches(xP.controls[xP._controls_registered[i]].prototype.element_selector)) {
                            params.type = xP._controls_registered[i]
                            break
                        }
                    }
                }
                if(xP.controls[params.type] && xP.controls[params.type].base) {
                    params.$element = $element
                    control = new xP.controls[params.type](params)
                }
            }
            control && result.append(control)
        })
        return result
    },

    link($element, control) {
        if(control) {
            $element.data('expromptum.control', control)
            if($element[0]) {
                $element[0].expromptum = control
            }
        }
        else return $element.data('expromptum.control')
    }
}
