xP.controls.register({
    name : 'date_picker',
    base : '_secret',
    prototype : {
        element_selector : 'input.date.picker, .date.picker input, input.datemonth.picker, .datemonth.picker input, input.datetime.picker, .datetime.picker input',

        min : new Date(1000, 0, 1),
        max : new Date(9999, 0, 1),

        init : function(params) {
            var that = this;

            xP.controls.date_picker.base.init.apply(this, arguments);

            this.init_locale(params);

            if(this.$element.is('.date, .date input')) {
                this.sub_type = 'date_picker';
            }
            else if(this.$element.is('.datetime, .datetime input')) {
                this.sub_type = 'datetime_picker';
            }
            else {
                this.sub_type = 'datemonth_picker';
            }

            if(that.val().length != 0) {
                that._set_value(xP.parse_date(that.val(), this.locale));
            }


            this.$wrapper = this.$element
                                .wrap(this.element_wrap_html).parent().addClass(this.sub_type);

            this._draft_state = [];

            this.last_build = [0, 0, 0];


            this.change(function() {
                var value = that.val();

                if(!value || value.length == 0) {
                    that.$element.removeClass(that.container_invalid_class);
                    that.$secret.val('');
                    return;
                }

                var d = xP.parse_date(that.val(), this.locale);

                if(
                    !isNaN(d[0]) && !isNaN(d[1])
                    && (!isNaN(d[2]) && this.sub_type == 'date_picker' || this.sub_type == 'datemonth_picker')
                ) {
                    that._current_day = d[2];

                    that._current_month = d[1];

                    that._current_year = d[0];

                    that.build(d, false);
                }
                else if(
                    this.sub_type == 'datetime_picker'
                    && !isNaN(d[0])
                    && !isNaN(d[1])
                    && !isNaN(d[2])
                    && !isNaN(d[3])
                    && !isNaN(d[4])
                ) {
                    that._current_day = d[2];
                    that._current_month = d[1];
                    that._current_year = d[0];

                    that.build(d, false);
                }
                else {
                    that.$secret.val('');
                }
            });

            this.$calendar_days = $(this.control_calendar_days_html);

            this.$calendar_container_inner = this.$calendar_days.find('tbody');

            this.$calendar_days_title = $(this.control_calendar_title_html);

            this.$calendar_year_title = $(this.control_calendar_title_html);

            this.$calendar_year = $(this.control_calendar_year_html);

            this.$calendar_time = $('<span class="time"></span>');

            this.$calendar_hour = $('<span class="hour"></span>');

            this.$calendar_hour_select = $('<select></select>');

            this.$calendar_minute = $('<span class="minute"></span>');

            this.$calendar_minute_select = $('<select></select>');

            this.$control_calendar_now = $(this.control_calendar_now_html);

            switch(this.sub_type) {
                case 'datetime_picker':
                    this.$control_calendar_now.html(this.locale.now);
                    break;
                case 'date_picker':
                    this.$control_calendar_now.html(this.locale.today);
                    break;
                case 'datemonth_picker':
                    this.$control_calendar_now.html(this.locale.current_month);
                    break;
            }

            this.$calendar_close = $(this.calendar_close_html);
            this.$calendar_close.attr('title', this.locale.close_popup);

            this.minute_round = params.minute_round || 5;

            $(this.control_calendar_dec_html)
                .appendTo(this.$calendar_year)
                .mousedown(function() {
                    var d_tmp = that._draft_state;
                    var d_tmp = that._draft_state;
                    d_tmp[0] = that.$calendar_year_title.data('val');
                    d_tmp[1] = that.$calendar_month_title.data('val');
                    that.build([d_tmp[0] - 1, d_tmp[1], d_tmp[2], d_tmp[3], d_tmp[4]]);

                    return false;
                });

            this.$calendar_year.append(this.$calendar_year_title);

            $(this.control_calendar_inc_html)
                .appendTo(this.$calendar_year)
                .mousedown(function() {
                    var d_tmp = that._draft_state;
                    d_tmp[0] = that.$calendar_year_title.data('val');
                    d_tmp[1] = that.$calendar_month_title.data('val');

                    that.build([d_tmp[0] + 1, d_tmp[1], d_tmp[2], d_tmp[3], d_tmp[4]]);
                    return false;
                });

            this.$calendar_month_title = $(this.control_calendar_title_html);

            this.$calendar_month = $(this.control_calendar_month_html);

            $(this.control_calendar_dec_html)
                .appendTo(this.$calendar_month)
                .mousedown(function() {

                    var d_tmp = that._draft_state;
                    var d_tmp = that._draft_state;
                    d_tmp[0] = that.$calendar_year_title.data('val');
                    d_tmp[1] = that.$calendar_month_title.data('val');
                    var new_month = d_tmp[1] - 1,
                        new_year = d_tmp[0];

                    if(new_month < 1) {
                        new_month = 12;
                        new_year = d_tmp[0] - 1;
                    }

                    that.build([new_year, new_month, d_tmp[2], d_tmp[3], d_tmp[4]]);

                    return false;
                });

            this.$calendar_month.append(this.$calendar_month_title);

            $(this.control_calendar_inc_html)
                .appendTo(this.$calendar_month)
                .mousedown(function() {

                    var d_tmp = that._draft_state;
                    var d_tmp = that._draft_state;
                    d_tmp[0] = that.$calendar_year_title.data('val');
                    d_tmp[1] = that.$calendar_month_title.data('val');
                    var new_month = d_tmp[1] + 1,
                        new_year = d_tmp[0];

                    if(new_month > 12) {
                        new_month = 1;

                        new_year = d_tmp[0] + 1;
                    }

                    that.build([new_year, new_month, d_tmp[2], d_tmp[3], d_tmp[4]]);

                    return false;
                });

            // hours
            $(this.control_calendar_dec_html)
                .appendTo(this.$calendar_hour)
                .mousedown(function(e) {
                    e.stopPropagation();
                    that._draft_state[3] = (that._draft_state[3])? (that._draft_state[3] - 1) : 23;
                    that.$calendar_hour_select.val(that._draft_state[3])
                    if(that.$calendar_minute_select.val() == '') {
                        that.$calendar_minute_select.val(0);
                        that._draft_state[4] = 0;
                    }
                    that._set_value(that._draft_state, false);
                    return false;
                });

            var hours_options = '<option value=""></option>';

            for(var i = 0; i < 24; i++) {
                hours_options += '<option value="' + i + '">' + xP.leading_zero(i) + '</option>';
            }

            this.$calendar_hour_select.html(hours_options);

            this.$calendar_hour.append(this.$calendar_hour_select);

            $(this.control_calendar_inc_html)
                .appendTo(this.$calendar_hour)
                .mousedown(function(e) {
                    e.stopPropagation();
                    that._draft_state[3] = that._draft_state[3] + 1;
                    if(that._draft_state[3] > 23 || !that._draft_state[3]) {
                        that._draft_state[3] = 0;
                    }
                    that.$calendar_hour_select.val(that._draft_state[3]);
                    if(that.$calendar_minute_select.val() == '') {
                        that.$calendar_minute_select.val(0);
                        that._draft_state[4] = 0;
                    }
                    that._set_value(that._draft_state, false);
                    return false;
                });

            this.$calendar_hour_select.change(function(e) {
                e.stopPropagation();

                that._draft_state[3] = $(this).val() * 1;
                that._set_value(that._draft_state, false);
                if(that.$calendar_minute_select.val() == '') {
                    that.$calendar_minute_select.val(0).change();
                }
            });

            //minutes
            $(this.control_calendar_dec_html)
                .appendTo(this.$calendar_minute)
                .mousedown(function(e) {
                    e.stopPropagation();

                    if(that.$calendar_minute_select.val() != '') {
                        that._draft_state[4] = that._draft_state[4] - 1 * that.minute_round;
                    }
                    else {
                        that._draft_state[4] = 60 - that.minute_round;
                    }
                    if(that._draft_state[4] < 0) {
                        that._draft_state[4] = 60 - that.minute_round;
                    }
                    that.$calendar_minute_select.val(that._draft_state[4]);
                    that._set_value(that._draft_state, false);

                    return false;
                });

            var minutes_options = '<option value=""></option>';

            for(var i = 0; i < 60; i = i + this.minute_round) {
                minutes_options += '<option value="' + i + '">' + xP.leading_zero(i) + '</option>';
            }

            this.$calendar_minute_select.html(minutes_options);

            this.$calendar_minute.append(this.$calendar_minute_select);

            $(this.control_calendar_inc_html)
                .appendTo(this.$calendar_minute)
                .mousedown(function(e) {
                    e.stopPropagation();
                    if(that.$calendar_minute_select.val() != '') {
                        that._draft_state[4] = that._draft_state[4] + 1 * that.minute_round;
                    }
                    else {
                        that._draft_state[4] = 0;
                    }
                    if(that._draft_state[4] > 60 - that.minute_round) {
                        that._draft_state[4] = 0;
                    }

                    that.$calendar_minute_select.val(that._draft_state[4]);
                    that._set_value(that._draft_state, false);

                    return false;
                });

            this.$calendar_minute_select.change(function(e) {
                e.stopPropagation();

                that._draft_state[4] = $(this).val() * 1;

                that._set_value(that._draft_state, false);
            });

            $(this.$calendar_close).click(function() {
                that.close();
            });
            this.$calendar_time
                .append(this.$calendar_hour)
                .append(this.$calendar_minute);

            if(this.sub_type != 'datetime_picker') {
                this.$calendar_close = null;

                this.$calendar_time = null;
            }

            if(this.sub_type != 'datetime_picker' && this.sub_type != 'date_picker') {
                this.$calendar_days_title = null;

                this.$calendar_days = null;
            }

            this.$control_calendar
                = $(this.control_calendar_html)
                .append(this.$calendar_close)
                .append(this.$calendar_year)
                .append(this.$calendar_month)
                .append(this.$calendar_days_title)
                .append(this.$calendar_days)
                .append(this.$calendar_time)
                .insertAfter(this.$element)
                .hide();

            this.$control_calendar.append(this.$control_calendar_now);

            this.$control_calendar_now.on('click', function() {
                var now = new Date();

                that._set_value([
                    now.getFullYear(),
                    now.getMonth() + 1,
                    now.getDate(),
                    now.getHours(),
                    now.getMinutes()
                ], true);

                that.$calendar_hour_select.val(that._draft_state[3]);

                that.$calendar_minute_select.val(
                    Math.ceil(that._draft_state[4] / that.minute_round) * that.minute_round
                );
            });

            this.$control_calendar.on('click', 'td.current', function(e) {
                e.stopPropagation();

                if($(this).hasClass('invalid')) {
                    return false;
                }

                that.$control_calendar.find('.selected').removeClass('selected');
                $(this).addClass('selected');

                var new_day = parseInt($(this).html(), 10),
                    year = parseInt(that.$control_calendar.find('.year .title').data('val'), 10),
                    month = parseInt(that.$control_calendar.find('.month .title').data('val'), 10);

                that._set_value([
                        year,
                        month,
                        new_day,
                        that._draft_state[3],
                        that._draft_state[4]
                    ],
                    (that.sub_type != 'datetime_picker'));
            });

            this.$control_calendar.on('click', 'td.prev', function(e) {
                e.stopPropagation();
                if($(this).hasClass('invalid')) {
                    return false;
                }
                var new_day = $(this).html() * 1,
                    new_month = that.$calendar_month_title.data('val') - 1,
                    new_year = that.$calendar_year_title.data('val'),
                    is_close = !(that.sub_type == 'datetime_picker');

                if(new_month < 1) {
                    new_month = 12;
                    new_year = new_year - 1;
                }

                that._set_value([
                    new_year,
                    new_month,
                    new_day,
                    that._draft_state[3],
                    that._draft_state[4]
                ], is_close);
            });

            this.$control_calendar.on('click', 'td.next', function(e) {
                e.stopPropagation();
                if($(this).hasClass('invalid')) {
                    return false;
                }
                var new_day = $(this).html() * 1,
                    new_month = that.$calendar_month_title.data('val') + 1,
                    new_year = that.$calendar_year_title.data('val'),
                    is_close = !(that.sub_type == 'datetime_picker');

                if(new_month > 12) {
                    new_month = 1;
                    new_year = new_year + 1;
                }

                that._set_value([
                    new_year,
                    new_month,
                    new_day,
                    that._draft_state[3],
                    that._draft_state[4]
                ], is_close);
            });

            if(this.sub_type == 'datemonth_picker') {
                this.$control_calendar.on('click', '.month .title, .year .title', function(e) {
                    e.stopPropagation();
                    if($(this).hasClass('invalid')) {
                        return false;
                    }

                    that._draft_state[0] = parseInt(that.$control_calendar.find('.year .title').data('val'), 10);

                    that._draft_state[1] = parseInt(that.$control_calendar.find('.month .title').data('val'), 10);

                    if(that.sub_type == 'datemonth_picker') {
                        that._draft_state[2] = 1;
                    }

                    that._set_value(that._draft_state, true);
                });
            }

            this.$element.focus(function() {
                that.$wrapper.addClass('focused');

                that.build();

                that.open();
            });

            this.$element.on('keyup', function(event) {
                var keyCode = event.keyCode || event.which;

                if(keyCode == 9 || keyCode == 13 || keyCode == 27) { /*tab  enter  escape*/
                    event.stopPropagation();
                    that._set_value(xP.parse_date(that.val(), this.locale));
                    that.close();
                }
                else {
                    that.$element.focus();
                }
            });

            this.initial_date = xP.parse_date(this.val(), this.locale);

            if(
                !this.initial_date[0] && !this.initial_date[1] && !this.initial_date[2]
            ) {
                this.$element.val('');
            }

            this.build();
        },

        open : function() {
            var that = this;
            if(xP.controls.opened) {
                xP.controls.opened.close();
            }

            xP.controls.opened = this;

            that.$control_calendar.show();
            xP.offset_by_viewport(that.$control_calendar, that.$element);

            return this;
        },

        close : function() {
            var that = this;
            var keyCode = event.keyCode || event.which;

            if(keyCode == 3) return this;

            if(
                (!$(event.target).parents('.calendar').length)
                || (that.$calendar_close && that.$calendar_close.is(event.target))
            ) {
                if(that.$element && (!that.$element.is(':focus') || (keyCode == 9 || keyCode == 13 || keyCode == 27))) {

                    that.$wrapper.removeClass('focused');

                    var entered_date = xP.parse_date(that.val(), this.locale);

                    if(entered_date[0] && entered_date[1] && entered_date[2]) {
                        that._set_value(entered_date, true);
                    }
                    else {
                        that._set_value(entered_date, true);
                    }

                    xP.controls.opened = null;

                    that.$control_calendar.hide();
                }
            }

            return this;
        },

        _set_value : function(d, closePopup) {
            var that = this;
            var valid = true;

            if(isNaN(d[0]) && isNaN(d[1]) && isNaN(d[2])) {
                // empty date
                this.$element.removeClass(that.container_invalid_class);
                return;
            }

            if(d[0] * 1 < 1) {
                valid = false;
            }

            if(this.sub_type == 'datemonth_picker') {
                d[2] = 1;
            }

            var result = '';

            if(d[2] && d[1] && d[0]) {
                result = xP.locale.date_format.replace('dd', xP.leading_zero(d[2]));

                result = result.replace('mm', xP.leading_zero(d[1]));

                result = result.replace('yy', d[0]);

                if(!isNaN(d[3]) && !isNaN(d[4])) {

                    result += ' ' + xP.leading_zero(d[3]) + ':' + xP.leading_zero(d[4]);

                }
            }
            else {
                valid = false;
            }

            var draft_state = new Date(d[0], d[1] * 1 - 1, d[2]), d_tmp, _min, _max;

            if(this.min && typeof this.min == 'string') {
                d_tmp = xP.parse_date(this.min, this.locale);

                _min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _min = this.min;
            }

            if(this.max && typeof this.max == 'string') {
                d_tmp = xP.parse_date(this.max, this.locale);

                _max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _max = this.max;
            }

            if(draft_state && _min && draft_state < _min) {
                valid = false;
            }
            if(draft_state && _max && draft_state > _max) {
                valid = false;
            }

            if(!valid) {
                this.$element.addClass(that.container_invalid_class);
                closePopup = false;
            }
            else {
                this.$element.removeClass(that.container_invalid_class);
            }

            if(!((_min <= draft_state || !_min) && (draft_state <= _max || !_max))) {
                if(closePopup) {
                    this.$wrapper.removeClass('focused');

                    this.$control_calendar.hide();
                }
                return false;
            }

            this._draft_state = [d[0], d[1] * 1, d[2], d[3], d[4]];

            this._set_value_secret(this._draft_state);

            this.val(result);

            if(closePopup) {
                this.$wrapper.removeClass('focused');

                this.$control_calendar.hide();
            }

            return false;
        },

        _set_value_secret : function(d) {
            var that = this;

            if(d[0] && d[1] && d[2]) {
                var date_tmp = d[0] + '-' + d[1] + '-' + d[2];
            }

            switch(this.sub_type) {
                case 'datetime_picker':
                    if(date_tmp && !isNaN(d[3]) && !isNaN(d[4])) {
                        this.$secret.val(date_tmp + ' ' + d[3] + ':' + d[4]);
                    }
                    else {
                        this.$secret.val(date_tmp);
                    }
                    break;
                case 'date_picker':
                    if(date_tmp) {
                        this.$secret.val(date_tmp);
                    }
                    break;
                default:
                    if(d[0] && d[1]) {
                        this.$secret.val(d[0] + '-' + d[1] + '-' + '01');
                    }
            }

            var draft_state = new Date(d[0], d[1] * 1 - 1, d[2]), d_tmp, _min, _max;

            if(this.min && typeof this.min == 'string') {
                d_tmp = xP.parse_date(this.min, this.locale);

                _min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _min = this.min;
            }

            if(this.max && typeof this.max == 'string') {
                d_tmp = xP.parse_date(this.max, this.locale);

                _max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _max = this.max;
            }

            var valid = true;

            if(draft_state && _min && draft_state <= _min) {
                valid = false;
            }
            if(draft_state && _max && draft_state >= _max) {
                valid = false;
            }

            /*
        if(!valid){
            this.$element.addClass(that.container_invalid_class);
        }else{
            this.$element.removeClass(that.container_invalid_class);
        }
        */
        },

        val : function(value) {
            var that = this;

            if(!arguments.length) {  // asking value
                return this.disabled
                    ? undefined
                    : this.$element.val();
            }
            else { // set value
                var d = xP.parse_date(value, this.locale);

                var result;

                if(this.sub_type != 'datemonth_picker') {
                    result = this.locale.date_format.replace('dd', xP.leading_zero(d[2]));
                }
                else {
                    result = this.locale.date_format.replace('dd.', '');
                }

                result = result.replace('mm', xP.leading_zero(d[1]));

                result = result.replace('yy', d[0]);

                if(this.sub_type == 'datetime_picker' && !isNaN(d[3]) && !isNaN(d[4])) {
                    result += ' ' + xP.leading_zero(d[3]) + ':' + xP.leading_zero(d[4]);
                }

                if(!isNaN(d[0]) && !isNaN(d[1]) && !isNaN(d[2])) {
                    switch(this.sub_type) {
                        case 'datetime_picker':
                            var secret_result = this.locale.date_value_format.replace('yyyy', d[0]) + ' HH:MM';

                            secret_result = secret_result.replace('mm', d[1]);

                            secret_result = secret_result.replace('dd', d[2]);

                            if(!isNaN(d[3]) && !isNaN(d[4])) {
                                secret_result = secret_result.replace('HH', d[3]);
                                secret_result = secret_result.replace('MM', d[4]);
                            }
                            else {
                                secret_result = secret_result.replace('HH', '');
                                secret_result = secret_result.replace('MM', '');
                            }

                            this.$secret.val(secret_result);

                            break;
                        default:
                            var secret_result = this.locale.date_value_format.replace('yyyy', d[0]);

                            secret_result = secret_result.replace('mm', d[1]);

                            secret_result = secret_result.replace('dd', d[2]);

                            this.$secret.val(secret_result);
                    }
                }

                return xP.controls.date_picker.base.val.apply(
                    this,
                    [result]
                );
            }
        },

        get_now_array : function() {
            today = new Date();
            return [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), Math.ceil(today.getMinutes() / this.minute_round) * this.minute_round];
        },

        build : function(d, update_value) {
            if(typeof update_value == 'undefined') {
                update_value = false;
            }
            var current_value = null,
                today = new Date();

            if(d === undefined) {
                if(this.val().length == 0) {
                    if(!this.initial_date) {
                        d = this.get_now_array();
                    }
                    else {
                        d = this.initial_date;
                    }
                }
                else {
                    d = xP.parse_date(this.val(), this.locale);
                    current_value = d[2];
                }
            }
            else if(update_value) {
                this._draft_state = d;

                if(
                    this._current_year === this._draft_state[0]
                    && this._current_month === this._draft_state[1]
                ) {
                    current_value = this._current_day;
                }
            }
            var d_tmp, _min, _max;

            if(this.min && typeof this.min == 'string') {
                d_tmp = xP.parse_date(this.min, this.locale);

                _min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _min = this.min;
            }

            if(this.max && typeof this.max == 'string') {
                d_tmp = xP.parse_date(this.max, this.locale);
                _max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
            }
            else {
                _max = this.max;
            }

            if(d[1] < 1 || d[1] > 12 || isNaN(d[1])) {
                // no month value, replace with current
                if(this.last_build[1]) {
                    d[1] = this.last_build[1];
                }
                else {
                    d[1] = today.getMonth() + 1;
                }
            }
            else {
                this.last_build[1] = d[1];
            }

            if(d[0] < 11 || d[1] > 9999 || isNaN(d[0])) {
                // no year value, replace with today
                if(this.last_build[0]) {
                    d[0] = this.last_build[0];
                }
                else {
                    d[0] = today.getFullYear();
                }
            }
            else {
                this.last_build[0] = d[0];
            }

            this.$calendar_container_inner.empty();

            this.$calendar_year_title.empty();

            this.$calendar_month_title.empty();

            this.$calendar_year_title.html(d[0]);

            this.$calendar_year_title.data('val', d[0]);

            if(this.sub_type == 'datemonth_picker') {
                var tmp_date = new Date(d[0], d[1] - 1, 1);
                if((_min && _min > tmp_date) || (_max && tmp_date > _max)) {
                    this.$calendar_year_title.addClass('invalid');
                    this.$calendar_month_title.addClass('invalid');
                }
                else {
                    this.$calendar_year_title.removeClass('invalid');
                    this.$calendar_month_title.removeClass('invalid');
                }
            }

            this.$calendar_month_title.html(this.locale.month[d[1] - 1].name);

            this.$calendar_month_title.data('val', d[1]);

            var cur_days = 33 - new Date(d[0], d[1] - 1, 33).getDate(),
                prev_days = 33 - new Date(d[0], d[1] - 2, 33).getDate(),
                first_day = new Date(d[0], d[1] - 1, 1).getDay() - 1;

            if(first_day === -1) {
                first_day = 6;  // Put sunday to the end of week
            }

            var week_shift = 0;

            var $line_pattern = $('<tr></tr>');

            var $line = $line_pattern.clone();

            for(var i = 0; i < 7; i++) {
                $(this.control_calendar_daynames_item_html)
                    .html(this.locale.weekday[i].abbr)
                    .appendTo($line);
            }

            this.$calendar_container_inner.append($line);

            $line = $line_pattern.clone();

            for(var i = 0; i < first_day; i++) {
                week_shift++;

                var class_name = 'prev';

                var td_date = new Date(d[0], d[1] - 2, prev_days - first_day + i + 1);

                if(((_min && _min > td_date) || (_max && td_date > _max))) {
                    class_name += ' invalid'
                }

                $(this.control_calendar_item_html).html(prev_days - first_day + i + 1)
                                                  .addClass(class_name)
                                                  .appendTo($line);
            }

            for(var i = 0; i < cur_days; i++) {

                var class_name = 'current';

                var td_date = new Date(d[0], d[1] - 1, i + 1);

                if((_min && _min > td_date) || (_max && td_date > _max)) {
                    class_name += ' invalid'
                }
                $(this.control_calendar_item_html).html(i + 1)
                                                  .addClass((current_value && current_value === i + 1)? 'selected' : '')
                                                  .addClass((today.getDate() === i + 1)? 'today' : '')
                                                  .addClass(class_name)
                                                  .appendTo($line);

                if((week_shift + i + 1) % 7 === 0) {
                    this.$calendar_container_inner.append($line);

                    $line = $line_pattern.clone();
                }
            }

            for(var k = 0, ken = 42 - week_shift - cur_days; k < ken; k++) {
                var class_name = 'next';

                var td_date = new Date(d[0], d[1], k + 1);

                if((_min && _min > td_date) || (_max && td_date > _max)) {
                    class_name += ' invalid'
                }

                $(this.control_calendar_item_html).html(k + 1)
                                                  .addClass(class_name)
                                                  .appendTo($line);

                if((week_shift + cur_days + 1 + k) % 7 === 0) {
                    this.$calendar_container_inner.append($line);

                    $line = $line_pattern.clone();
                }
            }

            if(typeof d[3] != 'undefined') {
                this.$calendar_hour_select.val(d[3]);
                this._draft_state[3] = d[3];
            }

            if(!isNaN(d[4])) {
                this.$calendar_minute_select.val(Math.ceil(d[4] / this.minute_round) * this.minute_round);
                this._draft_state[4] = d[4];
            }

            if(this.val() && update_value) {
                this._set_value(d, false);
            }
            else {
                if(this.val()) {
                    this._set_value_secret(d);
                }
            }

        },

        change : function(handler, remove) {
            return xP.controls._secret.base.change.apply(this, arguments);
        },

        update : function() {
            var d = xP.parse_date(this.val(), this.locale);

            var current_value = d[2];

            this.$calendar_container_inner.find('.d.current')
                .removeClass('selected')
                .eq(current_value - 1).addClass('selected');

            this.change();
        },

        element_wrap_html : '<ins class="date_picker_control"></ins>',

        control_calendar_html : '<div class="calendar"></div>',

        control_calendar_title_html : '<span class="title"></span>',

        control_calendar_year_html : '<div class="year"></div>',

        control_calendar_month_html : '<div class="month"></div>',

        control_calendar_days_html : '<table class="days"><tbody></tbody></table>',

        control_calendar_item_html : '<td class="d"></td>',

        control_calendar_daynames_item_html : '<th class="dn"></th>',

        calendar_close_html : '<span class="close">&times;</span>',

        control_calendar_inc_html : '<span class="control_button control_button_inc">&rarr;</span>',

        control_calendar_dec_html : '<span class="control_button control_button_dec">&larr;</span>',

        control_calendar_now_html : '<span class="control_button control_button_now"></span>',

        container_valid_class : 'valid',

        container_invalid_class : 'invalid'
    }
});
