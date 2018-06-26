xP.controls.register({
    name : '_item',
    base : xP.base,
    prototype : {
        init(params) {
            const that = this

            xP.controls._item.base.init.apply(this, arguments)

            if(!this.$element) {
                this.create()
            }

            this.name = this.$element.attr('name') || this.name

            xP.debug('controls', 'init control ' + this.type, this, { control : this })

            if(!this.$container && this.container_selector) {
                const $container = this.$element.parents(this.container_selector).first()
                if(!xP.controls.link($container)) {
                    this.$container = $container
                }
            }

            if(!this.$container || !this.$container.length) {
                this.$container = this.$element
            }

            const a = ['disabled', 'required', 'autofocus', 'min', 'max', 'step']
            let i = a.length, v

            while(i--) {
                v = this.$element.attr(a[i])
                if(v !== undefined && this[a[i]] !== undefined) {
                    this[a[i]] = v === a[i] | v
                }
            }

            if(this.autofocus) {
                // TODO: Надо подумать, как лучше поступать при disabled.
                this.$element.focus()
            }

            this._init_val()

            if(this.disabled || this.enabled === false) {
                this.disabled = false
                // Чтобы отключить добавленные элементы (secret).
                xP.after(() => this.disable())
            }

            xP.after(() => {
                this.change()
                this._init_val()
            })

            if(!this._.parent) {
                this.$container.parentsUntil('body').each(function() {
                    const control = xP.controls.link($(this))
                    if(control) {
                        that._.parent = control
                        return false
                    }
                })
            }
            if(this._.parent && !(this instanceof xP.controls.form)) {
                this._.parent.children().each(function() {
                    let parent = this.$container[0]
                    while(parent = parent.parentNode) {
                        if(parent === that.$container[0]) {
                            that._.parent._.children.remove(this)
                            this._.parent = that
                            that._.children.append(this)
                            break
                        }
                        else if(parent === this._.parent.$container[0]) {
                            break
                        }
                    }
                })
                this._.no_root_dependencies = this._.parent._.no_root_dependencies
                this._.parent._.children.append(this)
                this._.root = this._.parent._.root
            }
            else this._.root = xP.root || this

            xP.controls.link(this.$element, this)
            xP.controls.link(this.$container, this)

            if(xP.repeats) {
                xP.repeats.init(this)
            }

            xP.dependencies.init(this)
        },

        init_locale(params) {
            if(params.locale) {
                this.locale = xP.locale.get(params.locale)
            }
            else if(this.$element.attr('xml:lang')) {
                this.locale = xP.locale.get(this.$element.attr('xml:lang'))
            }
            else {
                let parent4locale = this._.parent || this._.root
                if(parent4locale) {
                    while(!parent4locale.locale && parent4locale._.parent && parent4locale !== this._.root) {
                        parent4locale = parent4locale._.parent
                    }
                }
                if(parent4locale && parent4locale.locale) {
                    this.locale = parent4locale.locale
                }
                else if($('html').attr('xml:lang')) {
                    this.locale = xP.locale.get($('html').attr('xml:lang'))
                }
                else this.locale = xP.locale.get()
            }
        },

        remove() {
            const $container = this.$container,
                // TODO: Вынести эту функцию.
                destroy_with_children = function(parent) {
                    if(parent.children) {
                        parent.children().each(function() {
                            destroy_with_children(this)
                        })
                    }
                    parent.destroy()
                }
            destroy_with_children(this)
            $container.remove()
            const parent = this.parent()
            if(parent) {
                parent.change()
            }
        },

        destroy(handler, remove) {
            xP.controls._item.base.destroy.apply(this, arguments)
            if(!arguments.length) {
                if(this._.parent) {
                    this._.parent._.children.remove(this)
                }
                this.$container = this.$element = null
            }
            return this
        },

        parent() {
            return this._.parent
        },

        root() {
            return this._.root
        },

        _init_val() {
            this._.initial_value = this._.value = this.val()
        },

        val(value) {
            if(!arguments.length) {
                return ''
            }
            else {
                this.change()
                return this
            }
        },

        disable(disabled) {
            disabled = !arguments.length || disabled
            if(this.disabled !== disabled) {
                if(disabled) {
                    this.$element.add(this.$container.addClass(this.container_disabled_class)).attr('disabled', true)
                }
                else {
                    let parent = this
                    while((parent = parent.parent()) && parent != this) {
                        if(parent.disabled) {
                            return this
                        }
                    }
                    this.$element.add(this.$container.removeClass(this.container_disabled_class)).removeAttr('disabled')
                }
                this.disabled = disabled
                this.change()
            }
            return this
        },

        container_disabled_class : 'disabled',

        _get_html() {
            return this.html
        }
    }
})
