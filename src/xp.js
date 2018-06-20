/* Core */

window.xP = window.expromptum = function(params, parent) {
    // TODO: Добавить третий параметр в котором можно передавать data-xp.
    if(!params) {
        params = '[data-xp], [data-expromptum]'
        for(const control of xP._controls_registered) {
            params += ',' + xP.controls[control].prototype.element_selector
        }
    }
    // CSS selector.
    // DOM element.
    // DOM collection.
    if(typeof params === 'string' || params && (params.nodeType || params[0] && params[0].nodeType)) {
        const context = parent instanceof xP.controls._item?
            parent.$container :
            parent || null
        params = $(params, context)
    }
    if(params instanceof jQuery) {
        return xP.controls.init(params)
    }
    if(params instanceof Object && parent) {
        return xP.controls.create(params, parent)
        // Create by params.
    }
    xP.debug('', 'error', 'unknown params', params)
    return new xP.list
}


/* Tools */

xP.register = function(params) {
    const { prototype = {}, base } = params
    let expromptum = prototype.init?
        function(...args) {
            this._ = {}
            prototype.init.apply(this, args)
        } :
        null
    // For console.
    prototype.toString = () => params.name
    if(base) {
        if(!expromptum) {
            expromptum = base.prototype.init?
                function(...args) {
                    this._ = {}
                    base.prototype.init.apply(this, args)
                } :
                function() {
                    this._ = {}
                }
        }
        const f = function() {}
        f.prototype = base.prototype
        expromptum.prototype = new f()
        expromptum.prototype.constructor = expromptum
        expromptum.base = base.prototype
    }
    else if(!expromptum) {
        expromptum = function() {}
    }
    Object.assign(expromptum.prototype, prototype)
    return expromptum
}

xP.list = function(arr) {
    const result = Array.isArray(arr)? arr : (arr? [arr] : [])

    result.append = function(obj) {
        if(!obj) return this
        if(Array.isArray(obj)) {
            for(const item of obj) {
                this.append(item)
            }
            return this
        }
        if(this.indexOf(obj) === -1) {
            this.push(obj)
        }
        return this
    }

    result.remove = function(obj) {
        if(Array.isArray(obj)) {
            let i = obj.length
            while(i--) {
                this.remove(obj[i])
            }
            return this
        }
        const i = this.indexOf(obj)
        if(i > -1) {
            this.splice(i, 1)
        }
        return this
    }

    result.filter = function(handler) {
        return this.each(handler, true)
    }

    result.each = function(handler, _filter) {
        let i = 0, l = this.length, current, result
        while(i < l) {
            current = this[i]
            result = handler.call(current, i)
            if(result === false) {
                if(_filter) {
                    this.splice(i, 1)
                }
                else break
            }
            if(this[i] === current) {
                i++
            }
            else l = this.length
        }
        return this
    }

    result.first = function(handler) {
        return this.eq(0, handler)
    }

    result.last = function(handler) {
        return this.eq(this.length - 1, handler)
    }

    result.eq = function(i, handler) {
        if(!this.length) {
            return null
        }
        if(handler) {
            handler.call(this[i % this.length])
        }
        return this[i % this.length]
    }

    return result
}

xP.debug = function(...args) {
    if(location.href.indexOf('xP=' + args[0]) > 0 || location.href.indexOf('xP=debug') > 0) {
        const newArgs = ['xP']
        for(const arg of args) {
            if(arg && arg.$element) {
                newArgs.push(arg.name || arg.$element[0].tagName)
            }
            else newArgs.push(arg)
        }
        console.log.apply(console, newArgs)
        return true
    }
    return false
}

xP.after = function(handler, i) {
    return setTimeout(() => i? xP.after(handler, --i) : handler())
}

xP.taint_regexp = function(value) {
    return value.replace(xP.taint_regexp_pattern, '\\')
}

xP.taint_regexp_pattern = /(?=[\\^$.[\]|()?*+{}])/g

xP.taint_css = function(value) {
    return value.replace(xP.taint_css_pattern, '\\')
}

xP.taint_css_pattern = /(?=[\\^$.[\]|()?*+{}:<>@/~&=])/g

xP.leading_zero = function(digit) {
    if(typeof digit === 'undefined') return
    return digit < 10? '0' + digit : digit
}

xP.offset_by_viewport = function($element) {
    $element.css({ top : '100%' })
    const position = $element.offset()
    const element_height = $element.height()
    const window_bottom_pos = window.scrollY + $(window).height()
    const element_bottom_pos = position.top + element_height
    if(window_bottom_pos < element_bottom_pos) {
        $element.css({ top : -1 * ($element.outerHeight(true)) + 'px' })
    }
}

const parse_date_time_pattern = /^(.*?)[\sT]*(\d\d?:\d\d?(?::\d\d?(?:[.:]\d\d*)?)?)(?:(?:\s*GMT)?([-+][:\d]+)?)?(.*)$/
const parse_date_split_pattern = /[-.,/\s]+/
const parse_date_separator_pattern = /^\s*[^-./\s]+([-./])/

xP.parse_date = function(value = '', params = {}) {
    const result = {}
    if(!params.millennium) {
        params.millennium = 2000
    }
    value = value.replace(parse_date_time_pattern, function(str, date1, time, gmt, date2) {
        const timex = time.split(':')
        result.time = time
        result.hour = timex[0]
        result.minute = timex[1]
        result.gmt = gmt
        return date1 + date2
    })
    const parts = value.split(parse_date_split_pattern)
    if(params.year_from_left === undefined) {
        params.year_from_left = false
    }
    if(params.month_from_left === undefined) {
        params.month_from_left = false
    }
    for(let i = 0; i < parts.length; i++) {
        if(parts[i] > 31) {
            params.year_from_left = !i
            result.year = parts.splice(i--, 1)[0]
        }
        else if(parts[i].match(/[^\d]/)) {
            const month = this.locale.parse_date_months.indexOf(parts[i].toLowerCase()) % 12 + 1
            if(month > 0) {
                result.month = xP.leading_zero(month)
            }
            parts.splice(i--, 1)
        }
    }
    if(!result.year && parts.length) {
        if(params.year_from_left) {
            result.year = parts.shift()
        }
        /*else if(parts.length == 3 - !!result.month * 1) {
            result.year = parts.pop()
        }*/
    }
    if(!result.month && parts.length) {
        if(parts[0] < 13 && (params.year_from_left
            || params.month_from_left
            || parts[parts.length - 1] > 12
            || (result.year && parts.length === 1))) {
            result.month = parts.shift()
        }
        else if(parts.length > 1 && parts[parts.length - 1] < 13) {
            result.month = parts.pop()
        }
    }
    if(!result.day && parts.length && parts[0] && !(result.year && !result.month)) {
        result.day = parts[0]
    }
    if(result.year && result.year < 100) {
        result.year = Number(result.year) + params.millennium
    }
    return [
        (typeof result.year !== 'undefined'? Number(result.year) : undefined),
        (typeof result.month !== 'undefined'? Number(result.month) : undefined),
        (typeof result.day !== 'undefined'? Number(result.day) : undefined),
        (typeof result.hour !== 'undefined'? Number(result.hour) : undefined),
        (typeof result.minute !== 'undefined'? Number(result.minute) : undefined)
    ]
}
