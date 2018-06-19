xP.controls.register({
    name : 'selectus',
    base : 'options',
    prototype : {
        element_selector : '.selectus',

        init : function(params) {
            this.find_text = '';

            xP.controls.selectus.base.init.apply(this, arguments);

            var that = this;
            xP.after(function() {
                that.after_init()
            });
        },

        after_init : function() {
            // TODO: Добавить поддержку append
            var $options = this.$element.find('[type=radio], [type=checkbox]'),
                that = this;

            this.$selectors = this.$container.find('.' + this.selectors_class);

            this.options = xP($options).each(function(i) {
                var option = this;

                this.label_text = this.$label.text().toLowerCase();

                this.label_html = this.$label.html().replace(/<input[^>]*>/g, '');

                option.$element.on('focus', function() {
                    option.$container.addClass('focus');
                }).on('blur', function() {
                    option.$container.removeClass('focus');
                }).on('keydown', function(ev) {
                    if(ev.keyCode === 40 || ev.keyCode === 38) {
                        var ii = i + (ev.keyCode === 40? 1 : -1);

                        if(ii >= 0 && ii < that.options.length) {
                            that.options.eq(ii).$element.focus()
                                .not('[type=checkbox]').click();
                        }
                        return false;
                    }
                    else if((ev.keyCode === 46 || ev.keyCode === 8) && that.find_text) {
                        that.find_text = that.find_text.substr(0, that.find_text.length - 1);

                        that.find_option();
                    }
                    else if(ev.keyCode > 31) {
                        that.find_text += ev.key.toLowerCase();

                        that.find_option();
                    }
                });
            });

            if(!this.$selectors[0]) {
                var $containers = [];

                this.options.each(function() {
                    for(var i = 0; i < this.$container.length; i++) {
                        $containers.push(this.$container[i]);
                    }
                });

                this.$selectors = $($containers)
                    .wrapAll('<div class="' + this.selectors_class + '"></div>')
                    .parents('.' + this.selectors_class);
            }
            this.close();

            this.$select = $('<ins class="' + this.select_class + '" tabindex="0"></ins>')
                .insertBefore(this.$selectors);

            new xP.dependencies.computed(
                {
                    from : this.options,
                    on : function() {
                        var html = '';

                        that.options.first()._.group.siblings.each(function() {
                            if(this.selected && !this.disabled) {
                                html += '<ins class="selected">'
                                    + this.label_html
                                    + '</ins>';
                            }
                        });
                        return html;
                    }
                },
                new xP.controls.html({
                    $element : this.$select,
                    type : 'html'
                })
            );

            this.$select.on('mouseup keypress', function(ev) {
                if(
                    !that.disabled
                    && (
                        ev.type === 'mouseup'
                        || ev.keyCode === 13
                        || ev.keyCode === 40
                    )
                ) {
                    if(that.$selectors.hasClass('hidden')) {
                        that.open();

                        return false;
                    }
                }
            });

            this.$selectors.on('keydown', function(ev) {
                if(ev.keyCode === 13 || ev.keyCode === 27) {
                    that.close();

                    that.$select.focus();

                    return false;
                }
            }).on('mouseup', function() {
                return false;
            });
        },

        selectors_class : 'selectors',
        select_class : 'select',

        open : function() {
            if(xP.controls.opened) {
                xP.controls.opened.close();
            }

            xP.controls.opened = this;

            var that = this;

            this.$selectors.removeClass('hidden');

            if(this.options.first()._.group.selected) {
                this.options.first()._.group.selected.$element.focus();
            }
            else {
                this.options.first().$element.focus();
            }

            xP.offset_by_viewport(this.$selectors, this.$element)
            return this;
        },

        close : function() {
            xP.controls.opened = null;

            this.$selectors.addClass('hidden');

            this.find_text = '';

            this.unhighlight_option();

            return this;
        },

        find_option : function() {
            var that = this, found = false;

            if(!that.find_text) {
                this.unhighlight_option();

                return;
            }

            this.options.each(function() {
                if(this.label_text.indexOf(that.find_text) > -1) {
                    found = true;

                    that.unhighlight_option();

                    that.found_option = this;

                    this.$label.contents().each(function() {
                        var $this = $(this);

                        if(this.nodeType == 3) {
                            $this = $('<span>' + this.nodeValue + '</span>');

                            $(this).replaceWith($this);
                        }
                        $this.html($this.html().replace(
                            new RegExp('(' + that.find_text + ')', 'ig'),
                            '<u>$1</u>'
                        ));
                    });

                    this.$label.focus();

                    return false;
                }
            });

            if(!found) {
                this.find_text = this.find_text.substr(0, this.find_text.length - 1);
            }
        },

        unhighlight_option : function() {
            if(this.found_option) {
                this.found_option.$label.find('u').contents().unwrap();
            }
        }
    }
});
