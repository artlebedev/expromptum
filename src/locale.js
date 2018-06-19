/* Locale */

xP.locale = {
    default : 'ru',

    init : function() {
        this.set(document.documentElement.lang);
    },

    parse_date_months : [],

    items : {
        "ru" : {
            abbr : 'ru',

            number : {
                decimal : ',',
                grouping : ' '
            },

            date_format : 'dd.mm.yy',

            date_value_format : 'yyyy-mm-dd',

            month : [
                {
                    abbr : 'янв',
                    name : 'Январь',
                    name_genitive : 'января'
                },
                {
                    abbr : 'фев',
                    name : 'Февраль',
                    name_genitive : 'февраля'
                },
                {
                    abbr : 'мар',
                    name : 'Март',
                    name_genitive : 'марта'
                },
                {
                    abbr : 'апр',
                    name : 'Апрель',
                    name_genitive : 'апреля'
                },
                {
                    abbr : 'май',
                    name : 'Май',
                    name_genitive : 'мая'
                },
                {
                    abbr : 'июн',
                    name : 'Июнь',
                    name_genitive : 'июня'
                },
                {
                    abbr : 'июл',
                    name : 'Июль',
                    name_genitive : 'июля'
                },
                {
                    abbr : 'авг',
                    name : 'Август',
                    name_genitive : 'августа'
                },
                {
                    abbr : 'сен',
                    name : 'Сентябрь',
                    name_genitive : 'сентября'
                },
                {
                    abbr : 'окт',
                    name : 'Октябрь',
                    name_genitive : 'октября'
                },
                {
                    abbr : 'ноя',
                    name : 'Ноябрь',
                    name_genitive : 'ноября'
                },
                {
                    abbr : 'дек',
                    name : 'Декабрь',
                    name_genitive : 'декабря'
                }
            ],

            first_day : 1,

            weekday : [
                {
                    abbr : 'Пн',
                    name : 'Понедельник'
                },
                {
                    abbr : 'Вт',
                    name : 'Вторник'
                },
                {
                    abbr : 'Ср',
                    name : 'Среда'
                },
                {
                    abbr : 'Чт',
                    name : 'Четверг'
                },
                {
                    abbr : 'Пт',
                    name : 'Пятница'
                },
                {
                    abbr : 'Сб',
                    name : 'Суббота'
                },
                {
                    abbr : 'Вс',
                    name : 'Воскресенье'
                }
            ],

            prev_month : 'Предыдущий',
            current_month : 'Текущий',

            next_month : 'Следующий',

            yesterday : 'Вчера',

            today : 'Сегодня',
            tomorrow : 'Завтра',

            now : 'Сейчас',
            close_popup : 'закрыть'
        },
        "en-GB" : {
            abbr : 'en',

            number : {
                decimal : '.',
                grouping : ','
            },

            month : [
                {
                    abbr : 'jan',
                    name : 'January',
                    name_genitive : 'january'
                },
                {
                    abbr : 'feb',
                    name : 'February',
                    name_genitive : 'february'
                },
                {
                    abbr : 'mar',
                    name : 'March',
                    name_genitive : 'march'
                },
                {
                    abbr : 'apr',
                    name : 'April',
                    name_genitive : 'april'
                },
                {
                    abbr : 'may',
                    name : 'May',
                    name_genitive : 'may'
                },
                {
                    abbr : 'jun',
                    name : 'June',
                    name_genitive : 'june'
                },
                {
                    abbr : 'jul',
                    name : 'July',
                    name_genitive : 'july'
                },
                {
                    abbr : 'aug',
                    name : 'August',
                    name_genitive : 'august'
                },
                {
                    abbr : 'sep',
                    name : 'September',
                    name_genitive : 'september'
                },
                {
                    abbr : 'oct',
                    name : 'October',
                    name_genitive : 'october'
                },
                {
                    abbr : 'nov',
                    name : 'November',
                    name_genitive : 'november'
                },
                {
                    abbr : 'dec',
                    name : 'December',
                    name_genitive : 'december'
                }
            ],

            weekday : [
                {
                    abbr : 'Mo',
                    name : 'Monday'
                },
                {
                    abbr : 'Tu',
                    name : 'Tuesday'
                },
                {
                    abbr : 'We',
                    name : 'Wednesday'
                },
                {
                    abbr : 'Th',
                    name : 'Thursday'
                },
                {
                    abbr : 'Fr',
                    name : 'Friday'
                },
                {
                    abbr : 'Sa',
                    name : 'Saturday'
                },
                {
                    abbr : 'Su',
                    name : 'Sunday'
                }
            ],

            prev_month : 'Previous',
            current_month : 'Current',

            next_month : 'Next',

            yesterday : 'Yesterday',

            today : 'Today',
            tomorrow : 'Tomorrow',

            now : 'Now',
            close_popup : 'close'
        }
    },

    destroy : function() {
    },

    load_locale : function(locale) {
        var that = this;

        $.each(this.items[that.default], function(key, value) {
            if(!locale[key]) {
                locale[key] = that.items[that.default][key];
            }
        });
        for(var k in locale) {
            this[k] = locale[k];
        }
        if(xP.locale.parse_date_months.indexOf(that.month[0].name) == -1) {
            $.each(that.month, function(index, value) {
                xP.locale.parse_date_months.push(value.abbr);
            });
            $.each(that.month, function(index, value) {
                xP.locale.parse_date_months.push(value.name.toLowerCase());
            });
            $.each(that.month, function(index, value) {
                xP.locale.parse_date_months.push(value.name_genitive.toLowerCase());
            });
        }
    },

    add : function(id, params, default_id) {
        var that = this;

        this.items[id] = params;

        $.each(this.items[default_id], function(key, value) {
            if(!that.items[id][key]) {
                that.items[id][key] = that.items[default_id][key];
            }
        });
    },

    set : function(lang) {
        if(!lang) {
            lang = this.default;
        }
        lang = this.normalize_id(lang);

        if(this.items[lang]) {
            this.load_locale(this.items[lang]);
        }
        else {
            this.load_locale(this.items[this.default]);
        }
    },

    get : function(lang) {
        var that = this;
        if(!lang) {
            lang = this.default;
        }
        lang = this.normalize_id(lang);

        var return_locale;

        if(this.items[lang]) {
            return_locale = this.items[lang];
        }
        else {
            return_locale = this.items[this.default];
        }

        var t = return_locale.number;

        $.extend(
            t,
            {
                format : {
                    decimal : /\./,
                    grouping : /(\d\d|\d(?=\d{4}))(?=(\d{3})+([^\d]|$)())/g
                },

                unformat : {
                    decimal : new RegExp('[\\.\\' + t.decimal + ']'),
                    grouping : new RegExp('\\' + t.grouping, 'g')
                }
            }
        );
        if(xP.locale.parse_date_months.indexOf(return_locale.month[0].name.toLowerCase()) == -1) {
            $.each(return_locale.month, function(index, value) {
                xP.locale.parse_date_months.push(value.abbr);
            });
            $.each(return_locale.month, function(index, value) {
                xP.locale.parse_date_months.push(value.name.toLowerCase());
            });
            $.each(return_locale.month, function(index, value) {
                xP.locale.parse_date_months.push(value.name_genitive.toLowerCase());
            });
        }
        $.each(this.items[that.default], function(key, value) {
            if(!return_locale[key]) {
                return_locale[key] = that.items[that.default][key];
            }
        });
        return return_locale;
    },

    normalize_id : function(lang) {
        if(lang == 'en') {
            return 'en-GB';
        }
        else {
            return lang;
        }
    }
};

xP.locale.init();
