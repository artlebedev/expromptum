xP.controls.register({
    name : 'datetime',
    base : 'date',
    prototype : {
        element_selector : 'input.datetime, .datetime input',

        _spliters : ['-', '-', ' ', ':', ''],

        init : function(params) {
            xP.controls.datetime.base.init.apply(this, arguments);

            this.init_locale(params);

            var html = this._number_begin_html + ', min: 0, max: 23" value="'
                + (this._.values[3] !== undefined? this._.values[3] : '')
                + '" size="2" maxlength="2" class="hours"/>'
                + '<span class="time_spliter"></span>'
                + this._number_begin_html + ', min: 0, max: 59,'
                + '_format: function(v){return (v + \'\').replace(/^(\\d)$/, \'0$1\')},'
                + '_unformat: function(v){return v !== \'\' ? v * 1 : \'\'}'
                + '" value="'
                + (this._.values[4] !== undefined? this._.values[4] : '')
                + '" size="2" maxlength="2" class="minutes"/>';

            var $time = $(html).insertBefore(this.$element), that = this;

            this._.pseudo.append(xP($time.filter('input')).each(function() {
                this.change(function() {
                    that._change_pseudo();
                });
            }));

            this._.$pseudo.add($time);
        }

    }
});
