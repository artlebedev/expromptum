xP.controls.register({
    name : 'combobox',
    base : 'string',
    prototype : {
        element_selector : '.combobox input, input.combobox, input[list]',

        search_from_start : true,
        case_sensitive : false,

        init : function(params) {
            xP.controls.combobox.base.init.apply(this, arguments);

            var $list = $(
                "select#" + xP.taint_css(this.$element.attr('list') + '')
            );

            if($list[0]) {
                $list.addClass('combolist');

                var list = xP($list).first(),
                    that = this;

                this.list = list;

                list.combobox = this;

                this.change(function() {
                    if(list._param('do_not_filter')) {
                        return;
                    }

                    var value = that.val(),
                        options = list._.options;

                    options.length = 0;

                    if(value != '' && value != undefined) {
                        var mask = new RegExp(
                            (that.search_from_start? '^' : '')
                            + xP.taint_css(value),
                            that.case_sensitive? '' : 'i'
                        );

                        list._.enabled_options.each(function(i) {
                            if(this.text.match(mask)) {
                                this.disabled = '';

                                options[options.length] = this;
                            }
                        });
                    }
                    else {
                        list._.enabled_options.each(function(i) {
                            this.disabled = '';

                            options[options.length] = this;
                        });
                    }

                    xP.after(function() {
                        var selected_index = list._.element.selectedIndex;

                        list._.element.selectedIndex = -1;

                        if(list._.options.length === 0) {
                            list.hide();
                        }
                        else if(value) {
                            if(!that.case_sensitive) {
                                value = value.toLowerCase();
                            }

                            var i = 0, l = list._.options.length;

                            for(; i < l; i++) {
                                var ovalue = list._.options[i].text;

                                if(!that.case_sensitive) {
                                    ovalue = ovalue.toLowerCase();
                                }

                                if(value === ovalue) {
                                    list._.element.selectedIndex = i;
                                    break;
                                }
                            }
                        }

                        if(selected_index !== list._.element.selectedIndex) {
                            list.$element.change();
                        }

                        if(that.$element.is(':focus')) {
                            list.show();
                        }

                        list._param('do_not_show', false);
                    });
                });

                this.$element
                    .on('focus', function(ev) {
                        list._param('do_not_filter', false);
                        list.show();
                    })
                    .on('blur', function(ev) {
                        list.hide();
                    })
                    .on('keydown', function(ev) {
                        if(ev.keyCode === 38 || ev.keyCode === 40) {
                            // up & down.
                            if(!list.$element[0].options.length) {
                                return;
                            }
                            list._param('do_not_filter', true);
                            list._param('do_not_hide', true);
                            list.show();
                            list.$element.focus();
                            if(list.$element[0].selectedIndex === -1) {
                                list.$element[0].selectedIndex = 0;
                                list.$element.change();
                            }
                        }
                        else if(ev.keyCode === 13 || ev.keyCode === 27) {
                            list.hide();
                        }
                    });

                list.$element
                    .on('blur', function(ev) {
                        list._param('do_not_hide', false);
                        list.hide();
                    })
                    .on('change', function(ev) {
                        var value = list.text();
                        if(value) {
                            that.val(value);
                        }
                    })
                    .on('mousedown', function(ev) {
                        list._param('do_not_hide', true);
                    })
                    .on('click keyup', function(ev) {
                        if(
                            ev.type === 'click'
                            || ev.keyCode === 13
                            || ev.keyCode === 27
                        ) {
                            list._param('do_not_filter', false);
                            list._param('do_not_show', true);
                            that.val(list.text());
                            that.$element.focus();
                            list.hide();
                        }
                        else {
                            return false;
                        }
                    })
                    .on('keydown', function(ev) {
                        if(
                            ev.keyCode !== 13
                            && ev.keyCode !== 27
                            && ev.keyCode !== 38
                            && ev.keyCode !== 40
                        ) {
                            return false;
                        }
                    });
            }
        }
    }
});
