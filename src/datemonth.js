xP.controls.register({
    name : 'datemonth',
    base : '_field',
    prototype : {
        element_selector : 'input.datemonth, .datemonth input',

        init : function(params) {

            xP.controls.datemonth.base.init.apply(this, arguments);

            this.init_locale(params);

            this.$element.wrap(this.element_wrap_html);

            this.$element.hide();

            this._.values = params.$element.val().split(this._split_pattern);

            if(this._.values.length < 2) {
                this._.values = ['', '', '', '', ''];
            }
            var html = '',
                format = this.locale.date_format.split(this._split_pattern);

            for(var i = 0, l = format.length; i < l; i++) {
                if(format[i] == 'yy') {
                    html += this._number_begin_html + ', min: 0" value="'
                        + this._.values[0]
                        + '" size="4" maxlength="4" class="year"/>';
                }
                else if(format[i] == 'mm') {
                    html += '<select class="month">';
                    for(var ii = 1; ii < 13; ii++) {
                        html += '<option value="' + ii + '"'
                            + (ii == this._.values[1]? ' selected="true"' : '')
                            + '>'
                            + this.locale.month[ii - 1][this._month_name]
                            + '</option>';
                    }
                    html += '</select>';
                }
                else if(format[i] == 'dd') {
                    if(this._month_name === 'name') {
                        html += '<input type="hidden" data-xp="type: \'hidden\'" value="1"';
                    }
                    else {
                        html += this._number_begin_html
                            + ', min: 1, max: 31" value="'
                            + (this._.values[2] !== undefined? this._.values[2] : '')
                            + '" size="2" maxlength="2"';
                    }
                    html += ' class="day"/>';
                }
            }

            var $pseudo = $(html).insertBefore(this.$element);

            this._.$pocus = $pseudo.filter('input, select').first();

            this._.$pseudo = $(
                [
                    $pseudo.filter('.year'),
                    $pseudo.filter('.month'),
                    $pseudo.filter('.day')
                ]
            );

            var that = this;

            this._.pseudo = xP(this._.$pseudo).each(function() {
                if(this.max !== 31) {
                    this.change(function() {
                        that._.pseudo[2].param(
                            'max',
                            33 - new Date(
                            that._.pseudo[0].val(),
                            that._.pseudo[1].val() - 1,
                            33
                            ).getDate()
                        );
                    });
                }

                this.change(function() {
                    that._change_pseudo();
                });
            });

            this.change(function() {
                that._change_val();

                var val = this.val();

                if(val) {
                    var m = val.match(/(\d+)/g);

                    this._.date = new Date(
                        m[0], m[1] - 1, m[2] || 1, m[3] || 0, m[4] || 0, 0
                    );
                }
            });
        },

        element_wrap_html : '<ins class="date_control"/>',

        _month_name : 'name',

        _split_pattern : /[-\s:./\\]/,

        _spliters : ['-', ''],

        _number_begin_html : '<input data-xp="type: \'number\','
        + 'pseudo: true,'
        + 'container_selector: \'.none\','
        + 'allow_chars_pattern: /\\d/,'
        + '_format: function(v){return v ? v * 1 : v},'
        + '_unformat: function(v){return v}',

        date : function(date) {
            if(!arguments.length) {
                return this._.date;
            }
            else {
                this.val(
                    date.getFullYear() + '-'
                    + (date.getMonth() + 1 + '').replace(/^(\d)$/, '0$1') + '-'
                    + (date.getDate() + '').replace(/^(\d)$/, '0$1') + ' '
                    + (date.getHours() + '').replace(/^(\d)$/, '0$1') + ':'
                    + (date.getMinutes() + '').replace(/^(\d)$/, '0$1')
                );

                return this;
            }
        },

        _change_pseudo : function() {
            if(!this.disabled) {
                var i = 0, l = this._spliters.length, val, value = '', s;

                for(; i < l; i++) {
                    val = this._.pseudo[i].val();

                    if(!val && val !== 0) {
                        value = '';

                        break;
                    }
                    else {
                        s = '000' + val;
                        value += s.substr(s.length - (!i? 4 : 2))
                            + this._spliters[i];
                    }
                }

                this.val(value);
            }
        },

        _change_val : function() {
            var a;

            if(
                !this.disabled
                && (a = this.val())
                && (a = a.split(this._split_pattern)).length
            ) {
                var i = 0,
                    l = this._.pseudo.length < a.length
                        ? this._.pseudo.length : a.length;

                for(; i < l; i++) {
                    if(a[i] && a[i] != this._.pseudo[i].val()) {
                        this._.pseudo[i].val(a[i] * 1);
                    }
                }
            }
        }
    }
});
