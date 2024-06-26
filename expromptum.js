// Expromptum JavaScript Library
// Copyright Art. Lebedev | http://www.artlebedev.ru/
// License: BSD | http://opensource.org/licenses/BSD-3-Clause
// Author: Vladimir Tokmakov | vlalek
// Updated: 2024-05-22



(function(window, $){

if(window.expromptum){return;}

window.expromptum = window.xP = (function(undefined){

/* Core */

	var xP = function(params, parent){
		// TODO: Добавить третий параметр в котором можно передавать data-xp.
		if(!params){
			params = '[data-xp], [data-expromptum]';
			for(var i = 0, l = xP_controls_registered.length; i < l; i++){
				params += ','
					+ xP.controls[xP_controls_registered[i]]
						.prototype.element_selector;
			}
		}

		if(
			// CSS selector.
			$.type(params) === 'string'
			// DOM element.
			|| params && (
				params.nodeType
				// DOM collection.
				|| params[0] && params[0].nodeType
			)
		){
			params = $(
				params,
				parent
					? (
						parent instanceof xP.controls._item
							? parent.$container
							: parent
					)
					: null
			);
		}

		if(params instanceof jQuery){
			return xP.controls.init(params);
		}else if(params instanceof Object && parent){
			return xP.controls.create(params, parent);
			// Create by params.
		}else{
			xP.debug('', 'error', 'unknown params', params);

			return new xP.list();
		}
	};



/* Tools */

	xP.register = function(params){
		var prototype = params.prototype || {},
			expromptum = prototype.init
				? function(){
					this._ = {};
					prototype.init.apply(this, arguments);
				}
				: null,
			base = params.base;

		// For console.
		prototype.toString = function(){return params.name};

		if(base){
			if(!expromptum){
				expromptum = base.prototype.init
					? function(){
						this._ = {};
						base.prototype.init.apply(this, arguments);
					}
					: function(){this._ = {};};
			}

			var f = function(){};

			f.prototype = base.prototype;

			expromptum.prototype = new f();

			expromptum.prototype.constructor = expromptum;

			expromptum.base = base.prototype;
		}else if(!expromptum){
			expromptum = function(){};
		}

		$.extend(expromptum.prototype, prototype);

		return expromptum;
	};

	xP.list = function(arr){
		var result = $.type(arr) === 'array' ? arr: (arr ? [arr] : []);

		result.append = function(obj){
			if(!obj){
				return this;
			}

			if($.type(obj) === 'array'){
				for(var i = 0, l = obj.length; i < l; i++){
					this.append(obj[i]);
				}

				return this;
			}

			if(this.index(obj) === -1){
				this.push(obj);
			}

			return this;
		};

		result.remove = function(obj){
			if($.type(obj) === 'array'){
				var i = obj.length;

				while(i--){
					this.remove(obj[i]);
				}

				return this;
			}

			var i = this.index(obj);

			if(i > -1){
				this.splice(i, 1);
			}

			return this;
		};

		result.filter = function(handler){
			return this.each(handler, true);
		};

		result.each = function(handler, _filter){
			var i = 0, l = this.length, current, result;

			while(i < l){
				current = this[i];

				result = handler.call(current, i);

				if(result === false){
					if(_filter){
						this.splice(i, 1);
					}else{
						break;
					}
				}

				if(this[i] === current){
					i++;
				}else{
					l = this.length;
				}
			}

			return this;
		};

		result.first = function(handler){
			return this.eq(0, handler);
		};

		result.last = function(handler){
			return this.eq(this.length - 1, handler);
		};

		result.eq = function(i, handler){
			if(!this.length){
				return null;
			}

			if(handler){
				handler.call(this[i % this.length]);
			}

			return this[i % this.length];
		};

		result.index = function(obj){
			var i = this.length;

			while(i--){
				if(obj === this[i]){
					return i;
				}
			}

			return -1;
		};

		return result;
	};

	xP.debug = function(){
		if(location.href.indexOf('xP=' + arguments[0]) > 0 || location.href.indexOf('xP=debug') > 0){
			for(var i = 1, l = arguments.length, args = ['xP']; i < l; i++){
				if(arguments[i] && arguments[i].$element){
					args.push(arguments[i].name || arguments[i].$element[0].tagName);
				}else{
					args.push(arguments[i]);
				}
			}
			console.log.apply(console, args);

			return true;
		}else{
			return false;
		}
	};

	xP.after = function(handler, i){
		if(i){
			return setTimeout(function(){xP.after(handler, --i);}, 0);
		}else{
			return setTimeout(function(){handler()}, 0);
		}
	};

	xP.taint_regexp = function(value){
		return value.replace(xP.taint_regexp_pattern, '\\');
	};

	xP.taint_regexp_pattern = /(?=[\\^$.[\]|()?*+{}])/g;

	xP.taint_css = function(value){
		return value.replace(xP.taint_css_pattern, '\\');
	};

	xP.taint_css_pattern
		= /(?=[\\^$.[\]|()?*+{}:<>@/~&=])/g;

	(function(){
		var e = Element.prototype,
			match = (
				e.matches
				|| e.matchesSelector
				|| e.msMatchesSelector
				|| e.mozMatchesSelector
				|| e.webkitMatchesSelector
				|| e.oMatchesSelector
			);
		if(match){
			xP.css_selector_match = function($element, selector){
				return match.call($element[0], selector);
			};
		}else{
			xP.css_selector_match = function($element, selector){
				return $element.is(selector);
			};
		}
	})();


	xP.leading_zero = function(digit){
		if(typeof digit != 'undefined'){
			if(digit >= 10){
				return digit;
			}else{
				return '0' + digit;
			}
		}else{
			return;
		}
	};


	xP.offset_by_viewport =  function($element, $relative){

		$element.removeClass('atop').css({'top': '100%', 'left': 0, 'bottom': 'auto', 'right': 'auto'});

		var offset = $relative.offset();

		if(
			$(window).scrollTop() + $(window).height() < offset.top + $element.outerHeight()
			&& $(window).height() > $element.outerHeight()
			&& offset.top - $element.outerHeight() > 50
		){
			$element.css({'top': 'auto', 'bottom': '100%' }).addClass('atop');
		}
		if($(window).scrollLeft() + $(window).width() < offset.left + $element.outerWidth()){
			var left = $element.outerWidth(true) - $relative.width();
			if(offset.left - left < 0){
				left = offset.left;
			}
			$element.css({'left': -1 * left + 'px' });
		}
	};


	xP.parse_date = function(value, params){
		var parse_date_time_pattern = /^(.*?)[\sT]*(\d\d?:\d\d?(?::\d\d?(?:[.:]\d\d*)?)?)(?:(?:\s*GMT)?([-+][:\d]+)?)?(.*)$/,
			parse_date_split_pattern = /[-.,/\s]+/,
			parse_date_separator_pattern = /^\s*[^-./\s]+([-./])/;

		if(!params){
			params = {};
		}

		if(!params.millennium){
			params.millennium = 2000;
		}

		var result = {};

		if(!value){
			return [];
		}

		value = value.replace(
			parse_date_time_pattern,
			function(str, date1, time, gmt, date2){
				result.time = time;
				var timex = time.split(':');

				result.hour = timex[0];

				result.minute = timex[1];

				result.gmt = gmt;

				return date1 + date2;
			}
		);

		var parts = value.split(parse_date_split_pattern),
			separator,
			t = value.replace(
				parse_date_separator_pattern,
				function(str, s1){separator = s1;}
			);

		if(params.year_from_left === undefined){
			params.year_from_left = separator == '-';
		}
		if(params.month_from_left === undefined){
			params.month_from_left = separator == '/';
		}
		for(var i = 0; i < parts.length; i++){
			if(parts[i] > 31){
				params.year_from_left = !i;

				result.year = parts.splice(i--, 1)[0];
			}else if(parts[i].match(/[^\d]/)){
				month = this.locale.parse_date_months.indexOf(parts[i].toLowerCase()) % 12 + 1;

				if(month > 0){
					result.month = xP.leading_zero(month);
				}
				parts.splice(i--, 1);
			}
		}

		if(!result.year && parts.length){
			if(params.year_from_left){
				result.year = parts.shift();
			}else if(parts.length == 3 - !!result.month * 1){
				//result.year = parts.pop();
			}
		}
		if(!result.month && parts.length){
			if(
				parts[0] < 13
				 && (
					params.year_from_left
					|| params.month_from_left
					|| parts[parts.length - 1] > 12
					|| (result.year && parts.length == 1)
				)
			){
				result.month = parts.shift();
			}else if(parts.length > 1 && parts[parts.length - 1] < 13){
				result.month = parts.pop();
			}
		}
		if(!result.day && parts.length && parts[0] && !(result.year && !result.month)){
			result.day = parts[0];
		}
		if(result.year && result.year < 100){
			result.year = result.year * 1 + params.millennium;
		}

		return [
			(typeof result.year != 'undefined'? result.year*1 : undefined),
			(typeof result.month != 'undefined'? result.month*1 : undefined),
			(typeof result.day != 'undefined'? result.day*1 : undefined),
			(typeof result.hour != 'undefined'? result.hour*1 : undefined),
			(typeof result.minute != 'undefined'? result.minute*1 : undefined)
		];
	};


	xP.init =  {
		count: null,

		after: function(handler){
			var that = this;
			this.interval = setInterval(function(){
				if(
					that.count === 0
					|| (
						that.last_added
						&& new Date() - that.last_added > 30000
					)
				){
					clearInterval(that.interval);
					that.count = that.last_added = null;
					handler();
				}
			}, 300);
		},

		add: function(){
			this.last_added = new Date();
			this.count++;
		},

		remove: function(){
			this.count--;
		}
	}


/* Locale */

	xP.locale = {
		'default': 'ru',

		init: function(){
			this.set(document.documentElement.lang);
		},

		parse_date_months: [],

		items : {
			"ru" : {
				abbr: 'ru',

				number: {decimal: ',', grouping: ' '},

				date_format: 'dd.mm.yy',

				date_value_format: 'yyyy-mm-dd',

				month: [
					{abbr: 'янв', name: 'Январь',   name_genitive: 'января'},
					{abbr: 'фев', name: 'Февраль',  name_genitive: 'февраля'},
					{abbr: 'мар', name: 'Март',     name_genitive: 'марта'},
					{abbr: 'апр', name: 'Апрель',   name_genitive: 'апреля'},
					{abbr: 'май', name: 'Май',      name_genitive: 'мая'},
					{abbr: 'июн', name: 'Июнь',     name_genitive: 'июня'},
					{abbr: 'июл', name: 'Июль',     name_genitive: 'июля'},
					{abbr: 'авг', name: 'Август',   name_genitive: 'августа'},
					{abbr: 'сен', name: 'Сентябрь', name_genitive: 'сентября'},
					{abbr: 'окт', name: 'Октябрь',  name_genitive: 'октября'},
					{abbr: 'ноя', name: 'Ноябрь',   name_genitive: 'ноября'},
					{abbr: 'дек', name: 'Декабрь',  name_genitive: 'декабря'}
				],

				first_day: 1,

				weekday: [
					{abbr: 'Пн', name: 'Понедельник'},
					{abbr: 'Вт', name: 'Вторник'},
					{abbr: 'Ср', name: 'Среда'},
					{abbr: 'Чт', name: 'Четверг'},
					{abbr: 'Пт', name: 'Пятница'},
					{abbr: 'Сб', name: 'Суббота'},
					{abbr: 'Вс', name: 'Воскресенье'}
				],

				prev_month: 'Предыдущий',
				current_month: 'Текущий',

				next_month: 'Следующий',

				yesterday: 'Вчера',

				today: 'Сегодня',
				tomorrow: 'Завтра',

				now: 'Сейчас',
				close_popup:  'закрыть',

				file_size: [
					'Б',
					'КБ',
					'МБ',
					'ГБ',
					'ТБ'
				]
			},
			"en-GB" : {
				abbr: 'en',

				number: {decimal: '.', grouping: ','},

				month: [
					{abbr: 'jan', name: 'January',   name_genitive: 'january'},
					{abbr: 'feb', name: 'February',  name_genitive: 'february'},
					{abbr: 'mar', name: 'March',     name_genitive: 'march'},
					{abbr: 'apr', name: 'April',   name_genitive: 'april'},
					{abbr: 'may', name: 'May',      name_genitive: 'may'},
					{abbr: 'jun', name: 'June',     name_genitive: 'june'},
					{abbr: 'jul', name: 'July',     name_genitive: 'july'},
					{abbr: 'aug', name: 'August',   name_genitive: 'august'},
					{abbr: 'sep', name: 'September', name_genitive: 'september'},
					{abbr: 'oct', name: 'October',  name_genitive: 'october'},
					{abbr: 'nov', name: 'November',   name_genitive: 'november'},
					{abbr: 'dec', name: 'December',  name_genitive: 'december'}
				],

				weekday: [
					{abbr: 'Mo', name: 'Monday'},
					{abbr: 'Tu', name: 'Tuesday'},
					{abbr: 'We', name: 'Wednesday'},
					{abbr: 'Th', name: 'Thursday'},
					{abbr: 'Fr', name: 'Friday'},
					{abbr: 'Sa', name: 'Saturday'},
					{abbr: 'Su', name: 'Sunday'}
				],

				prev_month: 'Previous',
				current_month: 'Current',

				next_month: 'Next',

				yesterday: 'Yesterday',

				today: 'Today',
				tomorrow: 'Tomorrow',

				now: 'Now',
				close_popup:  'close',

				file_size: [
					'B',
					'KB',
					'MB',
					'GB',
					'TB'
				]
			}
		},

		destroy: function(){
		},

		load_locale: function(locale){
			var that = this;

			$.each(this.items[that['default']], function( key, value){
				if(!locale[key]){
					locale[key] = that.items[that['default']][key];
				}
			});
			for(var k in locale){
				this[k] = locale[k];
			}
			if(xP.locale.parse_date_months.indexOf(that.month[0].name) == -1){
				$.each(that.month, function(index, value){
					xP.locale.parse_date_months.push(value.abbr);
				});
				$.each(that.month, function(index, value){
					xP.locale.parse_date_months.push(value.name.toLowerCase());
				});
				$.each(that.month, function(index, value){
					xP.locale.parse_date_months.push(value.name_genitive.toLowerCase());
				});
			}
		},

		add: function(id, params, default_id){
			var that = this;

			this.items[id] = params;

			$.each(this.items[default_id], function( key, value){
				if(!that.items[id][key]){
					that.items[id][key] = that.items[default_id][key];
				}
			});
		},

		set: function(lang){
			if(!lang){
				lang = this['default'];
			}
			lang = this.normalize_id(lang);

			if(this.items[lang]){
				this.load_locale(this.items[lang]);
			}else{
				this.load_locale(this.items[that['default']]);
			}
		},

		get: function(lang){
			var that = this;
			if(!lang){
				lang = that['default'];
			}
			lang = this.normalize_id(lang);

			var return_locale;

			if(this.items[lang]){
				return_locale =  this.items[lang];
			}else{
				return_locale =  this.items[that['default']];
			}

			var t = return_locale.number;

			$.extend(
				t,
				{
					format: {
						decimal: /\./,
						grouping: /(\d\d|\d(?=\d{4}))(?=(\d{3})+([^\d]|$)())/g
					},

					unformat: {
						decimal: new RegExp('[\\.\\' + t.decimal + ']'),
						grouping: new RegExp('\\' + t.grouping, 'g')
					}
				}
			);
			if(xP.locale.parse_date_months.indexOf(return_locale.month[0].name.toLowerCase()) == -1){
				$.each(return_locale.month, function(index, value){
					xP.locale.parse_date_months.push(value.abbr);
				});
				$.each(return_locale.month, function(index, value){
					xP.locale.parse_date_months.push(value.name.toLowerCase());
				});
				$.each(return_locale.month, function(index, value){
					xP.locale.parse_date_months.push(value.name_genitive.toLowerCase());
				});
			}
			$.each(this.items[that['default']], function( key, value){
				if(!return_locale[key]){
					return_locale[key] = that.items[that['default']][key];
				}
			});
			return return_locale;
		},

		normalize_id: function(lang){
			if(lang == 'en'){
				return 'en-GB';
			}else{
				return lang;
			}
		}
	};

	xP.locale.init();


/* Base */

	xP.base = xP.register({name: 'xP.base', prototype: {

		init: function(params){
			this._.on_destroy = new xP.list();
			this._.on_change  = new xP.list();

			$.extend(this, params);
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				clearTimeout(this._.change_inquiry);

				var that = this;

				this._.on_destroy.each(function(){
					this.call(that);
				});
			}else{
				if(remove){
					this._.on_destroy.remove(handler);
				}else{
					this._.on_destroy.append(handler);
				}
			}

			return this;
		},

		change: function(handler, remove){
			if(!arguments.length){
				if(!this._.change_inquiry){
					clearTimeout(this._.change_inquiry);

					var that = this;

					that._.change_inquiry = xP.after(function(){
						that._.change_inquiry = null;

						that._.on_change.each(function(){
							this.call(that);
						});
					});
				}
			}else{
				if(remove){
					this._.on_change.remove(handler);
				}else{
					this._.on_change.append(handler);
				}
			}

			return this;
		},

		param: function(name, value){
			if(arguments.length === 2){
				this[name] = value;
			}

			return this[name];
		},

		_param: function(name, value){
			if(arguments.length === 2){
				this._[name] = value;
			}

			return this._[name];
		}
	}});


/* Controls */

	var xP_controls_registered = [], xP_controls_params = {};

	xP.controls = {
		register: function(params){
			var name = params.name;

			if(!params.prototype){
				params.prototype = {};
			}

			params.prototype.type = name;

			this[params.name] = xP.register(
				$.extend(
					params,
					{
						name: 'expromptum.controls.' + name,
						base: $.type(params.base) === 'string'
							? this[params.base]
							: params.base
					}
				)
			);

			if(params.prototype && params.prototype.element_selector){
				xP_controls_registered.push(name);
			}
		},

		init: function($elements){
			var result = new xP.list(), that = this;

			$elements.each(function(){
				var $element = $(this), control = that.link($element);

				if(!control){
					var params = $element.data('xp')
						|| $element.data('expromptum');

					if($.type(params) === 'string'){
						if(!params.match(/^^\s*{/)){
							params = '{' + params + '}';
						}

						if(!xP_controls_params[params]){
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

					if(!params){
						params = {};
					}

					if(!params.type){
						var i = xP_controls_registered.length;

						while(i--){
							if(
								xP.css_selector_match(
									$element,

									xP.controls[xP_controls_registered[i]]
										.prototype.element_selector
								)
							){
								params.type = xP_controls_registered[i];

								break;
							}
						}
					}

					if(
						xP.controls[params.type]
						&& xP.controls[params.type].base
					){
						params.$element = $element;

						control = new xP.controls[params.type](params);
					}
				}

				if(control){
					result.append(control);
				}
			});

			return result;
		},

		link: function($element, control){
			if(control){
				$element.data('expromptum.control', control);

				if($element[0]){
					$element[0].expromptum = control;
				}
			}else{
				return $element.data('expromptum.control');
			}
		}
	};


	xP.controls.register({name: '_item', base: xP.base,  prototype: {
		init: function(params){
			xP.init.add();

			var that = this;

			xP.controls._item.base.init.apply(this, arguments);

			if(!this.$element){
				this.create();
			}

			this.name = this.$element.attr('name') || this.name;

			xP.debug('controls', 'init control ' + this.type, this, {control: this});

			if(!this.$container && this.container_selector){
				var $container = this.$element.parents(this.container_selector).first();

				if(!xP.controls.link($container)){
					this.$container = $container;
				}
			}

			if(!this.$container || !this.$container.length){
				this.$container = this.$element;
			}

			var a = ['disabled', 'required', 'autofocus', 'min', 'max', 'step'],
				i = a.length, v;

			while(i--){
				v = this.$element.attr(a[i]);

				if(v !== undefined && !this[a[i]] !== undefined){
					this[a[i]] = v === a[i] | v;
				}
			}

			if(this.autofocus){
				// TODO: Надо подумать, как лучше поступать при disabled.
				this.$element.focus();
			}

			this._init_val();

			if(this.disabled || this.enabled === false){
				this.disabled = false;
				// Чтобы отключить добавленные элементы (secret).
				xP.after(function(){
					that.disable();
				});
			}

			xP.after(function(){
				that.change();
				that._init_val();
			});

			if(!this._.parent){
				this.$container.parentsUntil('body').each(function(){
					var control = xP.controls.link($(this));

					if(control){
						that._.parent = control;

						return false;
					}
				});
			}
			if(this._.parent && !(this instanceof xP.controls.form)){
				this._.parent.children().each(function(){
					var parent = this.$container[0];

					while(parent = parent.parentNode){
						if(parent === that.$container[0]){
							that._.parent._.children.remove(this);

							this._.parent = that;

							that._.children.append(this);

							break;
						}else if(parent === this._.parent.$container[0]){
							break;
						}
					}
				});

				this._.no_root_dependencies
					= this._.parent._.no_root_dependencies;

				this._.parent._.children.append(this);

				this._.root = this._.parent._.root;
			}else{
				this._.root = xP.root || this;
			}

			xP.controls.link(this.$element, this);
			xP.controls.link(this.$container, this);

			if(xP.repeats){
				xP.repeats.init(this);
			}

			xP.dependencies.init(this);

			xP.init.remove();
		},

		init_locale: function(params){
			if(params.locale){
				this.locale = xP.locale.get(params.locale);
			}else if(this.$element.attr('xml:lang')){
				this.locale = xP.locale.get(this.$element.attr('xml:lang'));
			}else{
				var parent4locale = this._.parent || this._.root;

				if(parent4locale){
					while(
						!parent4locale.locale
						&& parent4locale._.parent
						&& parent4locale !== this._.root
					){
						parent4locale = parent4locale._.parent;
					}
				}
				if(parent4locale && parent4locale.locale){
					this.locale = parent4locale.locale;
				}else if($('html').attr('xml:lang')){
					this.locale = xP.locale.get($('html').attr('xml:lang'));
				}else{
					this.locale = xP.locale.get();
				}
			}
		},

		remove: function(){
			var $container = this.$container,
				// TODO: Вынести эту функцию.
				destroy_with_children = function(parent){
					if(parent.children){
						parent.children().each(function(){
							destroy_with_children(this);
						});
					}
					parent.destroy();
				};

			destroy_with_children(this);

			$container.remove();

			var parent = this.parent();

			if(parent){
				parent.change();
			}
		},

		destroy: function(handler, remove){
			xP.controls._item.base.destroy.apply(this, arguments);

			if(!arguments.length){
				if(this._.parent){
					this._.parent._.children.remove(this);
				}

				this.$container
					= this.$element
					= null;
			}
			return this;
		},

		parent: function(){
			return this._.parent;
		},

		root: function(){
			return this._.root;
		},

		_init_val: function(){
			this._.initial_value
				= this._.value
				= this.val();
		},

		val: function(value){
			if(!arguments.length){
				return '';
			}else{
				this.change();

				return this;
			}
		},

		disable: function(disabled){
			disabled = !arguments.length || disabled;

			if(this.disabled !== disabled){
				if(disabled){
					this.$element.add(
						this.$container.addClass(
							this.container_disabled_class
						)
					).attr('disabled', true);
				}else{
					var parent = this;

					while((parent = parent.parent()) && parent != this){
						if(parent.disabled){
							return this;
						}
					}

					this.$element.add(
						this.$container.removeClass(
							this.container_disabled_class
						)
					).removeAttr('disabled');
				}

				this.disabled = disabled;

				this.change();
			}
			return this;
		},

		container_disabled_class: 'disabled',

		_get_html: function(){
			return this.html;
		},

		reset: function(){
			return this;
		}
	}});


	xP.controls.register({name: 'html', base: '_item', prototype: {
		element_selector: '.xp_html',

		init: function(params){
			xP.controls.html.base.init.apply(this, arguments);

			this.init_locale(params);
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled ? undefined : this.$element.html();
			}else{
				this.$element.html(value);

				this.change();

				return this;
			}
		}
	}});


	xP.controls.register({name: '_parent', base: '_item', prototype: {
		element_selector: '.xp',

		init: function(params){
			this.changed = {};

			this._.children = new xP.list();

			xP.controls._parent.base.init.apply(this, arguments);

			this._.$pocus = this.$element;

			this._.children_values = {};

			var parent4values = this._.parent || this._.root;

			while(
				!parent4values.name
				&& !parent4values.repeat
				&& parent4values._.parent
				&& parent4values !== this._.root
			){
				parent4values = parent4values._.parent;
			}

			this._.parent4values = parent4values;
		},

		children: function(){
			return this._.children;
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this._.parent4values._unsave_val(this);
			}

			return xP.controls._parent.base.destroy.apply(this, arguments);
		},

		disable: function(disabled){
			disabled = !arguments.length || disabled;

			if(this.disabled !== disabled){
				xP.controls._parent.base.disable.apply(this, arguments);

				if(this.disabled){
					this._.parent4values._unsave_val(this);
				}

				this._.children.each(function(){
					this.disable(disabled);
				});
			}

			return this;
		},

		val: function(value, params){
			if(!arguments.length){
				return this._.children_values;
			}else{
				if(!params){
					params = {suffix: ''};
				}
				if(this.repeat){
					var that = this;
					xP.after(function(){
						if($.type(value) !== 'array'){
							value = [value];
						}

						var siblings = that.repeat.children(),
							l = value.length,
							sibling;

						while(siblings.length > l){
							that.repeat.remove(siblings[siblings.length - 1]);
						}

						for(var i = 0; i < l; i++){
							sibling = siblings[i];
							if(!sibling){
								sibling = that.repeat.append(siblings[i - 1]);
							}
							sibling._set_vals(
								value[i],
								{
									suffix: params.suffix + that.repeat.name_suffix_before
										+ i + that.repeat.name_suffix_after,
									unchanged: params.unchanged,
									unchange: params.unchange
								}
							);
						}
					}, 4);
					// TODO: Ох уж эти мне таймауты. Нужно с ними разбираться.
				}else{
					this._set_vals(value, params);
				}

				return this;
			}
		},

		_set_vals: function(value, params){
			if(!params){
				params = {suffix: ''};
			}
			var that = this;

			$.each(value, function(name, value){
				var controls = that._find_by_name(name + params.suffix)
						|| that._find_by_name(name);

				if(controls){
					for(var i = 0, l = controls.length; i < l; i++){
						if(!params.unchanged || !controls[i].changed[0] || !controls[i].changed[0].result){
							if(params.unchange){
								controls[i]._.initial_value = Array.isArray(value) ? value[i] : value;
							}
							controls[i].val(value, params);

							if(params.unchange){
								controls[i]._.initial_value = controls[i].val();
							}
						}
					}
				}
			});
		},

		change: function(handler, remove){
			if(!arguments.length && this._.parent4values){
				this._.parent4values._save_val(this);
			}

			return xP.controls._parent.base.change.apply(this, arguments);
		},

		_save_val: function(child){
			if(child.name){
				if(child.repeat){
					var values = this._.children_values[child.name];

					if($.type(values) !== 'array'){
						values = this._.children_values[child.name] = [];
					}

					if(!child._.repeat_template){
						values[child._.repeat_position] = child.val();
					}
				}else{
					// TODO: Надо избавиться от этого, сохранять name в неизменном виде.
					var name = this.repeat
							? child.name.split(
									this.repeat.name_suffix_splitter
								)[0]
							: child.name;

					if(child instanceof xP.controls.checkbox){
						// TODO: Надо это в соответствующий контрол утащить. Да и обо всем остальном подумать.
						this._.children_values[name] = values = [];

						if(!child._.group){
							return;
						}

						child._.group.siblings.each(function(){
							var value = this.val();

							if(value !== ''){
								values.push(value);
							}
						});
					}else{
						this._.children_values[name] = child.val();
					}
				}
			}
		},

		_unsave_val: function(child){
			if(child.name){
				if(child.repeat){
					var values = this._.children_values[child.name];

					if(!child._.repeat_template){
						values.splice(child._.repeat_position, 1);
					}
				}else{
					var name = this.repeat
							? child.name.split(
									this.repeat.name_suffix_splitter
								)[0]
							: child.name;

					delete this._.children_values[name];
				}
			}
		},

		focus: function(){
			var that = this, f = function(){
					that._.$pocus.focus()[0].scrollIntoView();
				};

			if(!this._.$pocus.is(':visible')){
				var parent = this;

				while((parent = parent.parent()) && parent != this){
					if(parent.show){
						parent.show(f);
					}
				}
			}else{
				f();
			}

			return this;
		},

		_find_by_name: function(name){
			var result = [], subresult;

			this.children().each(function(){
				if(this.name == name){
					subresult = [this];
				}else if(this._find_by_name){
					subresult = this._find_by_name(name);
				}else{
					subresult = null;
				}

				if(subresult){
					result = result.concat(subresult);

					if(!(subresult[0] instanceof xP.controls._option)){
						return false;
					}
				}
			});

			return result.length ? result : null;
		},

		reset: function(){

			this.children().each(function(){

				this.reset();
			});
			return this;
		}
	}});


	xP.controls.register({name: 'form', base: '_parent', prototype: {
		element_selector: 'form',

		init: function(params){

			this.completed_on_required = true;
			this.completed_on_valid_required = true;
			//this.completed_on_valid = false;
			//this.completed_on_changed = false;

			xP.controls.form.base.init.apply(this, arguments);

			this.init_locale(params);

			this._.root = this;

			// Обратная совместимость
			if(this.uncomplete_if_invalid !== undefined){
				this.completed_on_valid = this.uncomplete_if_invalid;
			}

			if(this.uncomplete_if_unchanged !== undefined){
				this.completed_on_changed = this.uncomplete_if_unchanged;
			}
			// Обратная совместимость

			this._.onsubmit = new xP.list();

			var that = this;

			this.$element.on('submit', function(){
				return that.submit();
			});

			this.submit(function(){
				var uncompleted = this.uncompleted();

				if(uncompleted){
					xP.debug('submit', uncompleted);

					return false;
				}else if(this.locked){
					xP.debug('submit', 'locked');

					return false;
				}else{
					this.locked = true;
				}

				return !xP.debug('submit', 'submit');
			});
		},

		submit: function(handler, remove){
			if(!arguments.length){
				var that = this, result = true;

				this._.onsubmit.each(function(){
					if(!this.call(that)){
						result = false;
					}
				});

				return result;
			}else{
				if(remove){
					this._.onsubmit.remove(handler);
				}else{
					this._.onsubmit.append(handler);
				}
				return this;
			}
		},

		uncompleted: function(){
			if(
				this.completed_on_required
				&& this._.required
				&& $.grep(
					this._.required,
					function(ctrl){return !ctrl.disabled}
				).length
			){
				return 'required';
			}

			if(
				this.completed_on_valid_required
				&& this._.invalid
				&& $.grep(
					this._.invalid,
					function(ctrl){return !ctrl.disabled && (ctrl.required || (ctrl.pseudo && ctrl._.parent.required))}
				).length
			){
				return 'invalid_required';
			}

			if(
				this.completed_on_valid
				&& this._.invalid
				&& $.grep(
					this._.invalid,
					function(ctrl){return !ctrl.disabled}
				).length
			){
				return 'invalid';
			}

			if(
				this.completed_on_changed
				&& !(
					this._.changed
					&& $.grep(
						this._.changed,
						function(ctrl){return !ctrl.disabled}
					).length
				)
			){
				return 'unchanged';
			}

			return null;
		}
	}});


	xP.controls.register({name: '_labeled', base: '_parent', prototype: {
		init: function(params){
			xP.controls._labeled.base.init.apply(this, arguments);

			this.find_label();

			xP.controls.link(this.$label, this);
		},

		find_label: function(){

			var id = this.$element.attr('id');

			if(!this.$label){
				this.$label = this.$element.parents('label').first();
			}

			if(!this.$label[0] && id){
				var s = "[for='" + xP.taint_css(id) + "']";

				this.$label = $(s, this.$container != this.$element ? this.$container : this.root().$container);

				if(!this.$label.length){
					this.$label = $(s);
				}
			}
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this.$label = null;
			}

			return xP.controls._labeled.base.destroy.apply(this, arguments);
		}
	}});


	xP.controls.register({name: 'fields', base: '_labeled', prototype: {
		element_selector: 'fieldset, .fields, .sheets',

		init: function(params){
			xP.controls.fields.base.init.apply(this, arguments);

			this.init_locale(params);
		},

		count: function(){
			if(this.disabled || !this.children().length){
				return undefined;
			}

			var result = 0;

			this.children().each(function(){
				if(this instanceof xP.controls.fields){
					if(this.count()){
						result++;
					}
				}else if(this.val()){
					result++;
				}
			});

			return result;
		}
	}});


	xP.controls.register({name: 'sheet', base: 'fields', prototype: {
		element_selector: '.sheet',

		init: function(params){
			xP.controls.sheet.base.init.apply(this, arguments);

			this.init_locale(params);

			if(this.$label && this.$label[0]){
				var parent = this.parent(), that = this;

				this.select(
					!parent._param('selected_sheet')
					|| this.selected
					|| this.$label.hasClass(this.selected_class)
				);

				this.$label.click(function(){
					that.select();
				});
			}
		},

		show: function(complete){
			if(!this.selected){
				this.select();

				if(complete){
					complete();
				}
			}

			return this;
		},

		select: function(select){
			if(this.disabled){
				return this;
			}

			this.selected = !arguments.length || select;

			if(this.selected){
				var parent = this.parent(),
					previous = parent._param('selected_sheet');

				if(previous !== this){
					if(previous){
						previous.select(false);
					}

					parent._param('selected_sheet', this);

					this.$container.add(this.$label)
						.removeClass(this.unselected_class)
						.addClass(this.selected_class);
				}
			}else{
				this.$container.add(this.$label)
					.removeClass(this.selected_class)
					.addClass(this.unselected_class);
			}
			return this;
		},

		disable: function(disabled){
			xP.controls.sheet.base.disable.apply(this, arguments);

			if(this.disabled){
				this.$label
					.addClass(this.container_disabled_class)
					.attr('disabled', true);
			}else{
				this.$label
					.removeClass(this.container_disabled_class)
					.removeAttr('disabled', true);
			}

			return this;
		},

		selected_class: 'selected',
		unselected_class: 'unselected'
	}});


	xP.controls.register({name: 'foldable', base: 'fields', prototype: {
		element_selector: '.foldable',
		duration: 200,

		init: function(params){
			// TODO: Надо будет на этой базе и аккордеон сделать.
			xP.controls.foldable.base.init.apply(this, arguments);

			if(this.$label && this.$label[0]){
				this.fold(
					!(
						this.unfolded
						|| this.$label.hasClass(this.unfolded_class)
						|| decodeURI(document.location.hash) == '#' + this.$label.attr('id')
					),
					null,
					1
				);

				var that = this;

				this.$label.click(function(){
					that.fold(that.unfolded);
					return false;
				});
			}
		},

		show: function(complete){
			return this.fold(false, complete);
		},

		fold: function(fold, complete, _duration){
			this.unfolded = !fold;

			var that = this;

			if(fold){
				this.$container.slideUp(
					_duration || this.duration,
					function(){
						that.$container.add(that.$label)
							.removeClass(that.unfolded_class)
							.addClass(that.folded_class);

						if(complete){
							complete();
						}
					}
				);
			}else{
				this.$container.slideDown(
					_duration || this.duration,
					function(){
						that.$container.add(that.$label)
							.removeClass(that.folded_class)
							.addClass(that.unfolded_class);

						if(complete){
							complete();
						}
					}
				);
			}

			return this;
		},

		folded_class: 'folded',
		unfolded_class: 'unfolded'
	}});


	xP.controls.register({name: '_field', base: '_labeled', prototype: {
		element_selector: 'input',
		container_selector: '.field',

		init: function(params){
			xP.controls._field.base.init.apply(this, arguments);

			var that = this;

			this.$element.on(this.change_events, function(){
				that.change();
			});

			this.$element.blur(function(){
				that.$container.addClass(that.container_blured_class);
			});

			if(this.$container == this.$element){
				if(this.$label[0] && this.$element.parents().is(this.$label)){
					this.$container = this.$label;
				}else{
					this.$container = this.$container.add(this.$label);
				}
			}

			if(this.allow_chars_pattern){
				this.$element.keypress(function(ev){
					if(
						ev.charCode
						&& !(ev.metaKey || ev.ctrlKey || ev.altKey)
						&& !String.fromCharCode(ev.charCode).match(
							that.allow_chars_pattern
						)
					){
						return false;
					}
				});
			}

			xP.controls._field.base.change.apply(this);
		},

		change_events: 'keyup input change',
		container_blured_class: 'blured',

		change: function(handler, remove){
			if(!arguments.length){
				var that = this,
					changed = false,
					old = this._param('value'),
					cur = this.val();

				if(old !== cur){
					changed = true;
					this._param('value', cur);
				}

				if(changed){
					return xP.controls._field.base.change.apply(
						this,
						arguments
					);
				}else{
					return this;
				}
			}else{
				return xP.controls._field.base.change.apply(this, arguments);
			}
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled ? undefined : this.$element.val();
			}else{
				var el = this.$element[0];

				if(this.$element.is(':focus')){
					var start = el.selectionStart,
						end = el.selectionEnd;
				}

				if(el.value + '' != value + ''){
					el.value = value;

					if(this.$element.is(':focus')){
						el.selectionStart = start;

						el.selectionEnd = end;
					}

					this.change();
				}

				return this;
			}
		},

		reset: function(){
			this.val('');
			return this;
		}
	}});


	xP.controls.register({name: 'string', base: '_field', prototype: {
		element_selector: '[type=text], input:not([type])'
	}});


	xP.controls.register({name: 'text', base: '_field', prototype: {
		element_selector: 'textarea'
	}});


	xP.controls.register({name: 'file', base: '_field', prototype: {
		element_selector: '[type=file]',

		init: function(params){
			xP.controls.file.base.init.apply(this, arguments);

			this.init_locale(params);

			this.$selected = this.$container.find('.' + this.selected_class);

			if(!this.$selected[0]){
				this.$selected = $('<ins class="' + this.selected_class + '" tabindex="0"></ins>').insertAfter(this.$element);
			}

			var that = this;

			this.$element.change(function(){
				var html = '';

				if(this.files){
					for(var i = 0, ii, size; i < this.files.length; i++){
						ii = 0;
						size = this.files[i].size;
						while(size > 1023){
							size = size / 1024;
							ii++;
						}
						html += '<ins class="file '
							+ this.files[i].type.replace('/', ' ')
							+ '"><ins class="name">'
							+ this.files[i].name
							+ '</ins> <ins class="size">'
							+ Math.round(size)
							+ ' ' + that.locale.file_size[ii]
							+ '</ins></ins>';
					}
				}
				that.$selected.html(html);
			});
		},

		selected_class: 'selected'
	}});


	xP.controls.register({name: 'button', base: '_parent', prototype: {
		element_selector: '[type=button], [type=reset], button, .button',

		init: function(params){
			xP.controls.button.base.init.apply(this, arguments);

			this._.on_click = new xP.list();

			var that = this;

			this.$element.click(function(){
				that.root()._.last_clicked = that;

				if(that._.on_click.length){
					that.click();

					return false;
				}
			});
		},

		click: function(handler, remove){
			if(!arguments.length){
				if(!this.disabled){
					var that = this;

					this._.on_click.each(function(){
						this.call(that);
					});
				}
			}else{
				if(remove){
					this._.on_click.remove(handler);
				}else{
					this._.on_click.append(handler);
				}
			}

			return this;
		},

		reset: function(){
			return this;
		}
	}});


	xP.controls.register({name: 'submit', base: '_item', prototype: {
		element_selector: '[type=submit]',

		init: function(params){
			xP.controls.button.base.init.apply(this, arguments);

			var that = this;

			this.$element.click(function(){
				that.root()._.last_clicked = that;
			});
		}
	}});


	xP.controls.register({name: 'select', base: '_field', prototype: {
		element_selector: 'select',

		hide_disabled_option: true,
		enable_by: 'value',

		init: function(params){
			xP.controls.select.base.init.apply(this, arguments);

			this._.element = this.$element[0];
			this._.options = this._.element.options;

			this._.all_options = xP.list(this._.all_options);
			this._.enabled_options = xP.list(this._.enabled_options);

			for(var i = 0, l = this._.options.length; i < l; i++){
				this._.all_options.append(this._.options[i]);
				this._.enabled_options.append(this._.options[i]);
			}

			var that = this;

			this.$element.on('mousedown keydown', function(e){
				if(that.readonly && e.key != 'Tab'){
					return false;
				}
			});
		},

		append: function(params){
			if($.type(params) !== 'array'){
				params = [params];
			}

			var options = this._.options, i = 0, l = params.length, ii;

			for(; i < l; i++){
				ii = options.length;

				options[ii] = $.type(params[i]) === 'array'
					? new Option(params[i][0], params[i][1])
					: (
						$.type(params[i]) !== 'object'
						? new Option(params[i])
						: (
							params[i] instanceof Option
							? params[i]
							: new Option(params[i].label, params[i].value)
						)
					);

				this._.all_options.push(options[ii]);

				this._.enabled_options.push(options[ii]);
			}

			return this;
		},

		remove: function(){
			this._.options.length = 0;
			this._.all_options.length = 0;
			this._.enabled_options.length = 0;

			return this;
		},

		disable: function(disabled, dependence){
			if(dependence && dependence.values !== undefined){
				// TODO: Добавить поддержку optgroup.
				var that = this, values = dependence.values,
					i, l = values.length;

				if(!this._.enable_options){
					this._.enabled_options.length = 0;
				}

				this._.all_options.each(function(){
					var disable = true;

					if(!disabled){
						for(i = 0; i < l; i++){
							if($.type(values[i]) === 'regexp'){
								disable
									= !this[that.enable_by].match(values[i]);
							}else{
								disable = this[that.enable_by] != values[i];
							}

							if(!disable){
								that._.enabled_options.append(this);

								break;
							}
						}
					}

					if(disable){
						this.disabled = 'true';
					}
				});

				clearTimeout(this._.enable_options);

				this._.enable_options = xP.after(function(){
					that._.enable_options = null;

					var options =  that._.options;

					if(that.hide_disabled_option){
						options.length = 0;

						that._.enabled_options.each(function(i){
							this.disabled = '';

							if(!this.parentNode){
								options[options.length] = this;
							}
						});
					}else{
						that._.enabled_options.each(function(i){
							this.disabled = '';
						});

						var selected = that._.element.selectedIndex;

						if(!options[selected] || options[selected].disabled){
							that._.element.selectedIndex =
								that._.all_options.index(
									that._.enabled_options.first()
								);
						}
					}

					that.change();

					//that._.enabled_options.length = 0;
				});

				return this;
			}else{
				return xP.controls.select.base.disable.apply(this, arguments);
			}
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled ? undefined : this.$element.val();
			}else{
				if(this._.element.value != value){
					this.$element.val(value);

					this.change();
				}

				return this;
			}
		},

		text: function(){
			if(this.disabled){
				return undefined;
			}else{
				var option = this._.options[this._.element.selectedIndex];
				return option ? option.text : null;
			}
		},

		change: function(handler, remove){
			if(!arguments.length){
				if(this.readonly && this.$selected){
					this.$selected[0].selected = true;
				}else{
					this.$selected = $(this._.options[this._.element.selectedIndex]);
				}
			}

			return xP.controls.select.base.change.apply(this, arguments);
		},

		reset: function(){
			this.$element[0].selectedIndex = 0;
			return this;
		}
	}});


	xP.controls.register({name: 'options', base: 'fields', prototype: {
		element_selector: '.options',
		selectors_class: 'selectors',

		init: function(params){
			this._.options_by_value = {};

			xP.controls.options.base.init.apply(this, arguments);

			if(this.readonly){
				this.$container.addClass('readonly')
			}

			var that = this;
			xP.after(function(){that.after_init()});
		},

		after_init: function(){
			var $options = this.$element.find('[type=radio], [type=checkbox]'),
				that = this;

			this.$selectors = this.$container.find('.' + this.selectors_class);

			this.options_init($options);

			if(!this.$selectors[0]){
				var $containers = [];

				this.options.each(function(){
					for(var i = 0; i < this.$container.length; i++){
						$containers.push(this.$container[i]);
					}
				});

				this.$selectors = $($containers)
					.wrapAll('<div class="' + this.selectors_class + '"></div>')
					.parents('.' + this.selectors_class);
			}
		},

		options_init: function($options){
			if(!(this.options instanceof Array) || !this.options.append){
				this.options = new xP.list();
			}

			var that = this, options = xP($options);

			options.each(function(){
				that._.options_by_value[this.$element.val()] = this;
			});

			this.options.append(options);

			if(this.options[0]){
				this.subtype = this.options[0] instanceof xP.controls.radio ? 'radio' : 'checkbox';
				this.$container.attr('data-name', this.options[0].name);
			}
		},

		count: function(){
			if(this.disabled || !this.children().length){
				return undefined;
			}

			var result = 0;

			this.children().each(function(){
				if(this instanceof xP.controls._option){
					if(this.val() && this.selected){
						result++;
					}
				}else if(this instanceof xP.controls.fields && this.count()){
					result++;
				}
			});

			if(result == 0){
				result = undefined;
			}

			return result;
		}
	}});


	xP.controls.register({name: 'selectus', base: 'options', prototype: {
		element_selector: '.selectus',

		init: function(params){
			var that = this;

			this.search_text = '';

			if(params.search !== false){

				var $search = $(this.search_html).on('keydown', function(ev){
					if(ev.keyCode == 40){
						that.focus_selectors();
					}
				}).on('input', function(ev){

					that.search_text = that.normalize_text(ev.target.value);

					that.find_option();
				}).on('mouseup', function(){
					return false;
				}).insertAfter(params.$element);

				this._.search = new xP.controls.string({'$element': $search, '$container': $search});
			}

			xP.controls.selectus.base.init.apply(this, arguments);
		},

		after_init: function(){
			var that = this;
			// TODO: Добавить поддержку append

			this.$select = this.$container.find('.' + this.select_class);

			if(!this.$select[0]){
				this.$select = $('<ins class="' + this.select_class + '" tabindex="0"></ins>');
			}

			this.select_html = new xP.controls.html({
					$element: $('<ins/>').appendTo(this.$select),
					type: 'html'
				});

			xP.controls.selectus.base.after_init.apply(this, arguments);

			this.$suggest = this.$container.find('.' + this.suggest_class);

			if(!this.$suggest[0]){

				this.$suggest = $('<ins class="' + this.suggest_class + '" tabindex="0"></ins>');

				this.$suggest.insertBefore(this.$selectors);

				this.$selectors.appendTo(this.$suggest);
			}

			this.$wrapper = $(this.element_wrap_html).insertBefore(this.$suggest);

			this.$select.appendTo(this.$wrapper);

			this.$suggest.appendTo(this.$wrapper);

			if(this._.search){
				this._.search.$element.insertBefore(this.$selectors);
			}

			this.close();

			this.$select.on('mouseup keypress', function(ev){
				if(
					!that.disabled
					&& (
						ev.type === 'mouseup'
						|| ev.keyCode === 13
						|| ev.keyCode === 40
					)
				){
					if(
						that.$suggest.hasClass('hidden')
						&& !(
							ev.target
							&& ev.target.className == 'unselect'
						)
					){
						that.open();

						return false;
					}
				}
			});

			this.$suggest.on('keydown', function(ev){
				if(ev.keyCode === 13 || ev.keyCode === 27){
					that.close();

					that.$select.focus();

					return false;
				}
			}).on('mouseup', function(){
				return false;
			});
		},

		options_init: function($options){

			var that = this;

			xP.controls.selectus.base.options_init.apply(this, arguments);

			var options = xP($options);

			options.each(function(i){
				var option = this, label_html = this.$label.html() || '';

				this.label_text = that.normalize_text(label_html.replace(/<\/?[a-z][^>]*>/g, '').replace(/&(#\d+|\w+);/g, ' '));

				this.label_html = label_html.replace(/<input[^>]*>/g, '');

				option.$element.on('focus', function(){
					option.$container.addClass('focus');
				}).on('blur', function(){
					option.$container.removeClass('focus');
				}).on('keydown', function(ev){
					if(ev.keyCode === 40 || ev.keyCode === 38){
						var ii = i + (ev.keyCode === 40 ? 1 : -1);

						if(ii >= 0 && ii < that.options.length){
							that.options.eq(ii).$element.focus()
								.not('[type=checkbox]').click();
						}
						return false;
					}
				});
				if(that.subtype == 'radio'){
					option.$element.on('mouseup', function(){that.close()});
					option.$label.on('mouseup', function(){that.close()});
				}
			});

			if(this.options.length && options.length){
				new xP.dependencies.computed(
					{
						from: options,
						on: function(){
							var html = ''
								first_option = that.options.first(),
								selected_count = 0,
								selected_with_value = 0;

							if(first_option && first_option._.group){
								first_option._.group.siblings.each(function(){
									if(this.selected && !this.disabled){
										var id = this.$element.attr('id');
										if(!id){
											id = 'xP' + (Math.random() + '').substr(2, 8);
											this.$element.attr('id', id);
										}
										html += '<ins class="selected">'
											+ this.label_html;
										if(that.subtype == 'checkbox'){
											html += '<label for="' + id + '" class="unselect"></label>';
										}
										html += '</ins>';
										selected_count++;
										if(this.val()){
											selected_with_value++;
										}
									}
								});
								if(first_option._.group.selected_count != selected_count){
									first_option._.group.selected_count = selected_count;

									xP.after(function(){
										xP.offset_by_viewport(that.$suggest, that.$element);
									});
								}
							}
							//that.$container.toggleClass('unselected', !selected_with_value);
							that.$container.toggleClass('unselected', html == '');
							if((html == '' || !selected_with_value) && that.placeholder){
								html = '<ins class="placeholder">' + that.placeholder + '</ins>';
							}
							return html;
						}
					},
					this.select_html
				);
			}
		},

		select_class: 'select',

		suggest_class: 'suggest',

		element_wrap_html: '<ins class="selectus_control with_suggest"/>',

		search_html: '<input type="search"/>',

		open: function(){
			if(xP.controls.opened){
				xP.controls.opened.close();
			}
			if(this.readonly){
				return this;
			}

			xP.controls.opened = this;

			var that = this;

			this.$wrapper.addClass('focus');

			this.$suggest.removeClass('hidden');

			xP.offset_by_viewport(this.$suggest, this.$element);

			if(this._.search){
				this._.search.$element.focus();
			}

			return this;
		},

		focus_selectors: function(){
			var first_option = this.options.first();

			if(first_option){
				if(first_option._.group.selected){
					first_option._.group.selected.$element.focus();
				}else{
					first_option.$element.focus();
				}
			}
		},

		close: function(){
			xP.controls.opened = null;

			this.$wrapper.removeClass('focus');

			this.$suggest.addClass('hidden');

			return this;
		},


		find_option: function(){
			var that = this, found = false;

			this.options.each(function(){

				if(!that.search_text || this.label_text.indexOf(that.search_text) > -1){

					this.$container.show();
				}else{

					this.$container.hide();
				}
			});
		},


		find_option1: function(){
			var that = this, found = false;

			if(!that.search_text){
				this.unhighlight_option();

				return;
			}

			this.options.each(function(){
				if(this.label_text.indexOf(that.search_text) > -1){
					found = true;

					that.unhighlight_option();

					that.found_option = this;

					this.$label.contents().each(function(){
						var $this = $(this);

						if(this.nodeType == 3){
							$this = $('<span>' + this.nodeValue + '</span>');

							$(this).replaceWith($this);
						}
						$this.html($this.html().replace(
							new RegExp('(' + that.search_text + ')', 'ig'),
							'<u>$1</u>'
						));
					});

					this.$label[0].focus();

					that.$selectors.scrollTop(that.$selectors.scrollTop() + this.$label.offset().top - that.$selectors.offset().top);

					if(that._.search){
						that._.search.$element.focus();
					}

					return false;
				}
			});
		},

		unhighlight_option: function(){
			if(this.found_option){
				this.found_option.$label.find('u').contents().unwrap();
			}
		},

		normalize_text: function(text){
			return text.replace(/[^\p{L}\s\d]+/ug, '').replace(/\s+/g, ' ').replace(/(^\s|\s$)/g, '').toLowerCase();
		}
	}});


	$(document).on('mouseup.expromptum_controls_opened', function(ev){
		if(xP.controls.opened){
			xP.controls.opened.close();
		}
	});


	xP.controls.register({name: '_option', base: '_field', prototype: {
		container_selector: '.option',

		init: function(params){
			xP.controls._option.base.init.apply(this, arguments);

			if(!this.root()._param('_option')){
				this.root()._param('_option', {});
			}

			if(!this.root()._param('_option')[this.name]){
				this.root()._param('_option')[this.name]
					= {siblings: new xP.list(), enabled_options: new xP.list()};
			}

			this._.group = this.root()._param('_option')[this.name];

			this._.group.siblings.append(this);

			this.selected = null;

			this._init_val();
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				if(this._.group.selected === this){
					this._.group.selected = null;
				}

				this.disable();

				this._.group.siblings.remove(this);
			}

			return xP.controls._option.base.destroy.apply(this, arguments);
		},

		append: function(params){
			if($.type(params) !== 'array'){
				params = [params];
			}

			var i = 0, l = params.length, html = '', id;

			for(; i < l; i++){
				id = this.name + '_' + (this._.group.siblings.length + i);

				html += '<div class="option"><input type="' + this.type
					+ '" name="' + this.name + '" id="' + id
					+ '" value="' + (
						$.type(params[i]) === 'array'
						? params[i][1]
						: params[i]
					) + '"/><label for="' + id + '">' + (
						$.type(params[i]) === 'array'
						? params[i][0]
						: params[i]
					) + '</label></div>'
			}

			return xP($(html).insertAfter(this.$container).find('input'));
		},

		change_events: 'change',

		change: function(handler, remove){

			if(!arguments.length && this.parent() && this.parent().readonly){
				if(
					(this.$element[0].checked === true && this.selected === false && this._.value === '')
					|| (this.$element[0].checked === false && this._.value !== '')
				){
					this.$element[0].checked = !this.$element[0].checked;
				}
			}

			this.select(this.$element.is(':checked'), true);

			xP.controls._option.base.change.apply(this, arguments);

			return this;
		},

		_init_val: function(){
//			this.select(this.$element.is(':checked'));

			if(this.selected){
				this.$container.addClass(this.container_initial_selected_class);
			}

			xP.controls._option.base._init_val.apply(this, arguments);
		},

		container_initial_selected_class: 'initial_selected',
		container_selected_class: 'selected',

		val: function(value){
			if(!arguments.length){
				return !this.selected
					? (this.disabled ? undefined : '')
					: xP.controls._option.base.val.apply(this, arguments);
			}else if($.type(value) === 'array'){
				var i = value.length;

				while(i--){
					if(this.$element[0].value == value[i]){
						break;
					}
				}

				this.select(i > -1);
			}else{
				this.select(this.$element[0].value == value);
			}

			return this;
		},

		select: function(selected, _onchange){
			selected = !arguments.length || selected;

			if(this.selected !== selected){
				this.selected = selected;

				this.$container.toggleClass(
					this.container_selected_class,
					selected
				);

				if(selected){
					this.$element.attr('checked', true).prop('checked', true);
					this.$element[0].checked = true; // For FF 18.
				}else{
					this.$element.removeAttr('checked').prop('checked', false);
				}

				if(!_onchange){
					this.change();
				}
			}
			return this;
		},

		disable: function(disabled, dependence){
			if(dependence && dependence.values !== undefined){
				if(!this._.group.enable_options){
					this._.group.enabled_options.length = 0;
				}

				if(!disabled){
					this._.group.enabled_options.append(this);
				}else if(this._.group.enabled_options.index(this) == -1){
					this.disable(true);
				}

				clearTimeout(this._.group.enable_options);

				var that = this;

				this._.group.enable_options = xP.after(function(){
					that._.group.enable_options = null;

					that._.group.enabled_options.each(function(i){
						this.disable(false);
					});

					//that.change();
				});

				return this;
			}else{
				return xP.controls._option.base.disable.apply(this, arguments);
			}
		}
	}});


	xP.controls.register({name: 'radio', base: '_option', prototype: {
		element_selector: '[type=radio]',

		disable: function(disabled, dependence){
			disabled = !arguments.length || disabled;

			var that = this;

			if(dependence){
				if(this.selected && !this._.group.previous_selected){
					this._.group.previous_selected = this;
				}

				clearTimeout(this._.group.select_option);

				this._.group.select_option = xP.after(function(){
					if(that._.group.previous_selected){
						if(!that._.group.previous_selected.disabled){
							that._.group.previous_selected.select();
						}
						that._.group.previous_selected = null;
					}
				}, 1);
			}

			if(this.disabled !== disabled){
				xP.controls.radio.base.disable.apply(this, arguments);

				if(disabled){
					if(this.selected){
						this._.group.siblings.each(function(){
							if(!this.disabled && this !== that){
								this.select();

								return false;
							}
						});
					}
				}else if(
					this._.group.selected
					&& this._.group.selected.disabled
					&& this._.group.selected != this
				){
					this.select();

					this.change();
				}
			}else{
				xP.controls.radio.base.disable.apply(this, arguments);
			}

			return this;
		},

		select: function(selected, _onchange){
			selected = !arguments.length || selected;

			if(this.selected !== selected){
				if(selected && this._.group){
					var that_selected = this._.group.selected;

					this._.group.selected = this;

					if(that_selected){
						that_selected.select(false);
					}
				}
				xP.controls.radio.base.select.apply(this, arguments);
			}

			return this;
		},

		reset: function(){
			if(this._.group.siblings){
				var first = this._.group.siblings.first();
				if(first){
					first.select();
				}
			}
			return this;
		}
	}});


	xP.controls.register({name: 'checkbox', base: '_option', prototype: {
		element_selector: '[type=checkbox]'
	}});


	xP.controls.register({name: 'email', base: '_field', prototype: {
		element_selector: '.email input, input.email',
		valid: /^\S+@\S+\.\S{2,}$/
	}});


	xP.controls.register({name: 'phone', base: '_field', prototype: {
		element_selector: '.phone input, input.phone',
		valid: /^(?=[^()]*\(([^()]*\)[^()]*)?$|[^()]*$)(?=[\s(]*\+[^+]*$|[^+]*$)([-+.\s()]*\d){10,18}$/
	}});


	xP.controls.register({name: '_secret', base: '_field', prototype: {
		init: function(params){
			xP.controls._secret.base.init.apply(this, arguments);

			this.$secret = $(
				$('<div>')
					.append(this.$element.clone().hide())
					.html()
					.replace(/\s+(type|id)\s*=\s*[^\s>]+/g, '')
			).insertAfter(this.$element);

			this.$element.removeAttr('name');

			xP.controls.link(this.$secret, this);
		},

		change: function(handler, remove){
			if(!arguments.length && this.$secret){
				var value = this.val();
				if(this.$secret.val() != value){
					this.$secret.val(value);
				}
			}

			return xP.controls._secret.base.change.apply(this, arguments);
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this.$secret = null;
			}

			return xP.controls._secret.base.destroy.apply(this, arguments);
		},

		disable: function(disabled){
			disabled = !arguments.length || disabled;

			if(this.disabled !== disabled){
				if(disabled){
					this.$secret.attr('disabled', true);
				}else{
					this.$secret.removeAttr('disabled');
				}
				xP.controls._secret.base.disable.apply(this, arguments);
			}

			return this;
		}
	}});


	xP.controls.register({name: 'password', base: '_secret', prototype: {
		element_selector: '[type=password]',

		init: function(params){
			xP.controls.password.base.init.apply(this, arguments);

			var that = this;

			this.$secret.on(this.change_events, function(){
				that.val(that.$secret.val());
			});

			this.control_button_view
				= $(this.control_button_view_html)
					.insertAfter(this.$secret)
					.click(function(){
						if(that.disabled){
							return false;
						}

						that.$container.toggleClass(
							that.container_view_class
						);

						that.control_button_view.toggleClass(
							that.control_button_view_class
						);

						that.$element.toggle();

						that.$secret.toggle();

						(
							that.$secret.is(':visible')
								? that.$secret
								: that.$element
						).focus()[0].selectionStart = 1000;
					});
		},

		container_view_class: 'alt',
		control_button_view_class: 'control_button_password_view',
		control_button_view_html:
			'<span class="control_button control_button_password"/>'
	}});


	xP.controls.register({name: 'number', base: '_secret', prototype: {
		element_selector: 'input.number, .number input',

		step: 1,
		min: 1 - Number.MAX_VALUE,
		def: 0,
		max: Number.MAX_VALUE - 1,
		allow_chars_pattern: /^[-0-9.,\s]$/,

		init: function(params){
			var that = this;

			this.valid = '[this].min <= [this] && [this] <= [this].max';

			xP.controls.number.base.init.apply(this, arguments);

			this.init_locale(params);

			this.$element.wrap(this.element_wrap_html);

			$(this.control_button_dec_html)
				.insertBefore(this.$element)
				.mousedown(function(){
					if(!that.disabled){
						that.dec();
					}

					return false;
				});

			$(this.control_button_inc_html)
				.insertAfter(this.$element)
				.mousedown(function(){
					if(!that.disabled){
						that.inc();
					}

					return false;
				});

			this.$element
				.val(this._format(this.$element.val()))
				.keydown(function(ev){
					if(ev.which === 38){ // up.
						that.inc();

						return false;
					}else if(ev.which === 40){ // down.
						that.dec();

						return false;
					}
				});

			this.$element.blur(function(){
				that.val(that.val());
			});
		},

		element_wrap_html: '<ins class="number_control"/>',

		control_button_dec_html:
			'<span class="control_button control_button_dec"/>',

		control_button_inc_html:
			'<span class="control_button control_button_inc"/>',

		inc: function(){
			var value = this.val();

			if(!value && value !== 0){
				this.val(value = this.def);
			}

			value = value - 0 + this.step * 1;

			if(value > this.max * 1){
				return false;
			}else if(value < this.min * 1){
				value = this.min;
			}

			return this.val(value);
		},

		dec: function(){
			var value = this.val();

			if(!value && value !== 0){
				this.val(value = this.def);
			}

			value = value - this.step * 1;

			if(value < this.min * 1){
				return false;
			}else if(value > this.max * 1){
				value = this.max;
			}

			return this.val(value);
		},

		param: function(name, value){
			if(
				(name === 'min' && this.val() < value)
				|| (name === 'max' && this.val() > value)
			){
				this.val(value);
			}

			if((name === 'min' || name === 'max') && this.valid.process){
				var result = xP.controls.number.base.param.apply(
						this, arguments
					);

				this.valid.process();

				return result;
			}

			return xP.controls.number.base.param.apply(
					this, arguments
				);
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled
					? undefined
					: this._unformat(this.$element.val());
			}else{
				value = this._unformat(value);
				this.$secret.val(value);

				if(!this.$element.is(':focus')){
					value = this._format(value);
				}
				return xP.controls.number.base.val.apply(
					this,
					[value]
				);
			}
		},

		_format: function(value){
			var num = this.locale.number;

			value = (value + '').split('.');

			return value[0].replace(num.format.grouping, '$1' + num.grouping)
					+ (value[1]
						? num.decimal + value[1]
						: '');
		},

		_unformat: function(value){
			var num = this.locale ? this.locale.number : null;

			if(!num) return value;

			if(!value && value !== 0) return '';

			return value !== '' && value !== undefined
					? ((value + '')
						.replace(num.unformat.grouping, '')
						.replace(num.unformat.decimal, '.')
						.replace(/[^-.0-9]/g, '') * 1)
							.toPrecision(15) * 1
					: '';
		}
	}});


	xP.controls.register({name: 'datemonth', base: '_field', prototype: {
		element_selector: 'input.datemonth, .datemonth input',

		init: function(params){

			xP.controls.datemonth.base.init.apply(this, arguments);

			this.init_locale(params);

			this.$element.wrap(this.element_wrap_html);

			this.$element.hide();

			this._.values = params.$element.val().split(this._split_pattern);

			if(this._.values.length < 2){
				this._.values = ['','','','',''];
			}
			var html = '',
				format = this.locale.date_format.split(this._split_pattern);

			for(var i = 0, l = format.length; i < l; i++){
				if(format[i] == 'yy'){
					html += this._number_begin_html + ', min: 0" value="'
						+ this._.values[0]
						+ '" size="4" maxlength="4" class="year"/>';
				}else if(format[i] == 'mm'){
					html += '<select class="month">';
					for(var ii = 1; ii < 13; ii++){
						html += '<option value="' + ii + '"'
							+ (ii == this._.values[1] ? ' selected="true"' : '')
							+ '>'
							+ this.locale.month[ii - 1][this._month_name]
							+ '</option>';
					}
					html += '</select>';
				}else if(format[i] == 'dd'){
					if(this._month_name === 'name'){
						html += '<input type="hidden" data-xp="type: \'hidden\'" value="1"';
					}else{
						html += this._number_begin_html
							+ ', min: 1, max: 31" value="'
							+ (this._.values[2] !== undefined ? this._.values[2] : '')
							+ '" size="2" maxlength="2"';
					}
					html += ' class="day"/>';
				}
			}

			var $pseudo = $(html).insertBefore(this.$element);

			this._.$pocus = $pseudo.filter('input, select').first();

			this._.$pseudo = $(
				[$pseudo.filter('.year'),
				$pseudo.filter('.month'),
				$pseudo.filter('.day')]
			);

			var that = this;

			this._.pseudo = xP(this._.$pseudo).each(function(){
				if(this.max !== 31){
					this.change(function(){
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

				this.change(function(){
					that._change_pseudo();
				});
			});

			this.change(function(){
				that._change_val();

				var val = this.val();

				if(val){
					var m = val.match(/(\d+)/g);

					this._.date = new Date(
						m[0], m[1] - 1, m[2] || 1, m[3] || 0, m[4] || 0, 0
					);
				}
			});
		},

		element_wrap_html: '<ins class="date_control"/>',

		_month_name: 'name',

		_split_pattern: /[-\s:./\\]/,

		_spliters: ['-', ''],

		_number_begin_html: '<input data-xp="type: \'number\','
			+ 'pseudo: true,'
			+ 'container_selector: \'.none\','
			+ 'allow_chars_pattern: /\\d/,'
			+ '_format: function(v){return v ? v * 1 : v},'
			+ '_unformat: function(v){return v}',

		date: function(date){
			if(!arguments.length){
				return this._.date;
			}else{
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

		_change_pseudo: function(){
			if(!this.disabled){
				var i = 0, l = this._spliters.length, val, value = '', s;

				for(; i < l; i ++){
					val = this._.pseudo[i].val();

					if(!val && val !== 0){
						value = '';

						break;
					}else{
						s = '000' + val;
						value += s.substr(s.length - (!i ? 4 : 2))
								+ this._spliters[i];
					}
				}

				this.val(value);
			}
		},

		_change_val: function(){
			var a;

			if(
				!this.disabled
				&& (a = this.val())
				&& (a = a.split(this._split_pattern)).length
			){
				var i = 0,
					l = this._.pseudo.length < a.length
						? this._.pseudo.length : a.length;

				for(; i < l; i++){
					if(a[i] && a[i] != this._.pseudo[i].val()){
						this._.pseudo[i].val(a[i] * 1);
					}
				}
			}
		}
	}});


	xP.controls.register({name: 'date', base: 'datemonth', prototype: {
		element_selector: 'input.date, .date input',

		_month_name: 'name_genitive',

		_spliters: ['-', '-', '']
	}});


	xP.controls.register({name: 'datetime', base: 'date', prototype: {
		element_selector: 'input.datetime, .datetime input',

		_spliters: ['-', '-', ' ', ':', ''],

		init: function(params){
			xP.controls.datetime.base.init.apply(this, arguments);

			this.init_locale(params);

			var html = this._number_begin_html + ', min: 0, max: 23" value="'
					+ (this._.values[3] !== undefined ? this._.values[3] : '')
					+ '" size="2" maxlength="2" class="hours"/>'
					+ '<span class="time_spliter"></span>'
					+ this._number_begin_html + ', min: 0, max: 59,'
					+ '_format: function(v){return (v + \'\').replace(/^(\\d)$/, \'0$1\')},'
					+ '_unformat: function(v){return v !== \'\' ? v * 1 : \'\'}'
					+ '" value="'
					+ (this._.values[4] !== undefined ? this._.values[4] : '')
					+ '" size="2" maxlength="2" class="minutes"/>';

			var $time = $(html).insertBefore(this.$element), that = this;

			this._.pseudo.append(xP($time.filter('input')).each(function(){
				this.change(function(){
					that._change_pseudo();
				});
			}));

			this._.$pseudo.add($time);
		}

	}});


	xP.controls.register({name: 'date_picker', base: '_secret', prototype: {
		element_selector: 'input.date.picker, .date.picker input, input.datemonth.picker, .datemonth.picker input, input.datetime.picker, .datetime.picker input',

		min: new Date(1000,0,1),
		max: new Date(9999,0,1),

		init: function(params){
			var that = this;

			xP.controls.date_picker.base.init.apply(this, arguments);

			this.init_locale(params);


			if(this.$element.is('.date, .date input')){
				this.subtype = 'date_picker';
			}else if(this.$element.is('.datetime, .datetime input')){
				this.subtype = 'datetime_picker';
			}else{
				this.subtype = 'datemonth_picker';
			}

			if(this.val().length != 0){
				this._set_value(xP.parse_date(this.val(), this.locale));
				this.$element.val(this._format(this.val()));
			}

			
			this.$wrapper = this.$element
				.wrap(this.element_wrap_html).parent().addClass(this.subtype);

			this._draft_state = [];

			this.last_build = [0,0,0];

			this.change(function(){
				var value = that.val();

				if(!value || value.length == 0){
					that.$element.removeClass(that.container_invalid_class);
					that.$secret.val('');
					return;
				}

				var d = xP.parse_date(that.val(), this.locale);

				if(
					!isNaN(d[0]) && !isNaN(d[1])
					&& (!isNaN(d[2]) && this.subtype == 'date_picker' || this.subtype == 'datemonth_picker')
				){
					that._current_day = d[2];

					that._current_month = d[1];

					that._current_year = d[0];

					that.build(d, false);
				} else if (
							this.subtype == 'datetime_picker'
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
				} else {
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

			switch (this.subtype){
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
				.mousedown(function(){
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
				.mousedown(function(){
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
				.mousedown(function(){

					var d_tmp = that._draft_state;
					var d_tmp = that._draft_state;
					d_tmp[0] = that.$calendar_year_title.data('val');
					d_tmp[1] = that.$calendar_month_title.data('val');
					var new_month = d_tmp[1] - 1,
						new_year = d_tmp[0];

					if(new_month < 1){
						new_month = 12;
						new_year = d_tmp[0] - 1;
					}

					that.build([new_year, new_month, d_tmp[2], d_tmp[3], d_tmp[4]]);

					return false;
				});

			this.$calendar_month.append(this.$calendar_month_title);

			$(this.control_calendar_inc_html)
				.appendTo(this.$calendar_month)
				.mousedown(function(){

					var d_tmp = that._draft_state;
					var d_tmp = that._draft_state;
					d_tmp[0] = that.$calendar_year_title.data('val');
					d_tmp[1] = that.$calendar_month_title.data('val');
					var new_month = d_tmp[1] + 1,
						new_year = d_tmp[0];

					if(new_month > 12){
						new_month = 1;

						new_year = d_tmp[0] + 1;
					}

					that.build([new_year, new_month, d_tmp[2], d_tmp[3], d_tmp[4]]);

					return false;
			});

			// hours
			$(this.control_calendar_dec_html)
				.appendTo(this.$calendar_hour)
				.mousedown(function(e){
					e.stopPropagation();
					that._draft_state[3] = (that._draft_state[3]) ? (that._draft_state[3] - 1) : 23;
					that.$calendar_hour_select.val(that._draft_state[3])
					if(that.$calendar_minute_select.val() == ''){
						that.$calendar_minute_select.val(0);
						that._draft_state[4] = 0;
					}
					that._set_value(that._draft_state, false);
					return false;
				});

			var hours_options = '<option value=""></option>';

			for(var i = 0; i < 24; i++){
				hours_options += '<option value="' + i + '">' + xP.leading_zero(i) + '</option>';
			}

			this.$calendar_hour_select.html(hours_options);

			this.$calendar_hour.append(this.$calendar_hour_select);

			$(this.control_calendar_inc_html)
				.appendTo(this.$calendar_hour)
				.mousedown(function(e){
					e.stopPropagation();
					that._draft_state[3] = that._draft_state[3] + 1;
					if(that._draft_state[3] > 23 || !that._draft_state[3]){ that._draft_state[3] = 0;}
					that.$calendar_hour_select.val(that._draft_state[3]);
					if(that.$calendar_minute_select.val() == ''){
						that.$calendar_minute_select.val(0);
						that._draft_state[4] = 0;
					}
					that._set_value(that._draft_state, false);
					return false;
			});

			this.$calendar_hour_select.change(function(e){
				e.stopPropagation();

				that._draft_state[3] = $(this).val() * 1;
				that._set_value(that._draft_state, false);
				if(that.$calendar_minute_select.val() == ''){
					that.$calendar_minute_select.val(0).change();
				}
			});

			//minutes
			$(this.control_calendar_dec_html)
				.appendTo(this.$calendar_minute)
				.mousedown(function(e){
					e.stopPropagation();

					if(that.$calendar_minute_select.val() != ''){
						that._draft_state[4] = that._draft_state[4] - 1 * that.minute_round;
					}else{
						that._draft_state[4] = 60 - that.minute_round;
					}
					if(that._draft_state[4] < 0){ that._draft_state[4] = 60 - that.minute_round;}
					that.$calendar_minute_select.val(that._draft_state[4]);
					that._set_value(that._draft_state, false);

					return false;
				});

			var minutes_options = '<option value=""></option>';

			for(var i = 0; i < 60; i = i + this.minute_round){
				minutes_options += '<option value="' + i + '">' + xP.leading_zero(i) + '</option>';
			}

			this.$calendar_minute_select.html(minutes_options);

			this.$calendar_minute.append(this.$calendar_minute_select);

			$(this.control_calendar_inc_html)
				.appendTo(this.$calendar_minute)
				.mousedown(function(e){
					e.stopPropagation();
					if(that.$calendar_minute_select.val() != ''){
						that._draft_state[4] = that._draft_state[4] + 1 * that.minute_round;
					}else{
						that._draft_state[4] = 0;
					}
					if(that._draft_state[4] > 60 - that.minute_round){ that._draft_state[4] = 0;}

					that.$calendar_minute_select.val(that._draft_state[4]);
					that._set_value(that._draft_state, false);

					return false;
			});

			this.$calendar_minute_select.change(function(e){
				e.stopPropagation();

				that._draft_state[4] = $(this).val() * 1;

				that._set_value(that._draft_state, false);
			});

			$(this.$calendar_close).click(function(){
				that.close();
			});
			this.$calendar_time
					.append(this.$calendar_hour)
					.append(this.$calendar_minute);

			if(this.subtype != 'datetime_picker'){
				this.$calendar_close = null;

				this.$calendar_time = null;
			}

			if(this.subtype != 'datetime_picker' && this.subtype != 'date_picker'){
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
					.insertAfter(this.$element);

			this.$control_calendar.append(this.$control_calendar_now);

			this.$control_calendar_now.on('click', function(){
				var now = new Date();

				that._set_value([now.getFullYear(),
					now.getMonth() + 1,
					now.getDate(),
					now.getHours(),
					now.getMinutes()], true);

				that.$calendar_hour_select.val(that._draft_state[3]);

				that.$calendar_minute_select.val(
					Math.ceil(that._draft_state[4] / that.minute_round) * that.minute_round
				);
			});

			this.$control_calendar.on('click', 'td.option', function(e){
				e.stopPropagation();

				if($(this).hasClass('invalid')){
					return false;
				}

				that.$control_calendar.find('.selected').removeClass('selected');
				$(this).addClass('selected');

				var new_day = parseInt($(this).html(), 10),
					year = parseInt(that.$control_calendar.find('.year .title').data('val'), 10),
					month = parseInt(that.$control_calendar.find('.month .title').data('val'), 10);

				that._set_value([year,
					month,
					new_day,
					that._draft_state[3],
					that._draft_state[4]],
					(that.subtype != 'datetime_picker') );
			});

			this.$control_calendar.on('click', 'td.prev', function(e){
				e.stopPropagation();
				if($(this).hasClass('invalid')){
					return false;
				}
				var new_day = $(this).html() * 1,
					new_month = that.$calendar_month_title.data('val') - 1,
					new_year = that.$calendar_year_title.data('val'),
					is_close = !(that.subtype == 'datetime_picker');

				if(new_month < 1){
					new_month = 12;
					new_year = new_year - 1;
				}

				that._set_value([new_year,
					new_month,
					new_day,
					that._draft_state[3],
					that._draft_state[4]], is_close);
			});

			this.$control_calendar.on('click', 'td.next', function(e){
				e.stopPropagation();
				if($(this).hasClass('invalid')){
					return false;
				}
				var new_day = $(this).html() * 1,
					new_month = that.$calendar_month_title.data('val') + 1,
					new_year = that.$calendar_year_title.data('val'),
					is_close = !(that.subtype == 'datetime_picker');

				if(new_month > 12){
					new_month = 1;
					new_year = new_year + 1;
				}

				that._set_value([new_year,
					new_month,
					new_day,
					that._draft_state[3],
					that._draft_state[4]], is_close);
			});

			if(this.subtype == 'datemonth_picker'){
				this.$control_calendar.on('click', '.month .title, .year .title', function(e){
					e.stopPropagation();
					if($(this).hasClass('invalid')){
						return false;
					}

					that._draft_state[0] = parseInt(that.$control_calendar.find('.year .title').data('val'), 10);

					that._draft_state[1] = parseInt(that.$control_calendar.find('.month .title').data('val'), 10);

					if(that.subtype == 'datemonth_picker'){
						that._draft_state[2] = 1;
					}

					that._set_value(that._draft_state, true);
				});
			}

			this.$element.focus(function(){
				that.build();

				that.open();
			});

			this.$element.on('keyup', function(event){
				var keyCode = event.keyCode || event.which;

				if(keyCode == 9 || keyCode == 13 || keyCode == 27){ /*tab  enter  escape*/
					event.stopPropagation();
					that._set_value(xP.parse_date(that.val(), this.locale));
					that.close();
				}else{
					that.$element.focus();
				}
			});

			this.initial_date = xP.parse_date(this.val(), this.locale);

			if(
				!this.initial_date[0] && !this.initial_date[1] && !this.initial_date[2]
			){
				this.$element.val('');
			}

			this.build();
		},

		open: function(){
			var that = this;

			if(xP.controls.opened){
				xP.controls.opened.close();
			}
			if(!this.readonly){
				xP.controls.opened = this;

				that.$wrapper.addClass('focus');

				that.$control_calendar.removeClass('hidden');

				xP.offset_by_viewport(that.$control_calendar, that.$element);
			}
			return this;
		},

		close: function(){
			var that = this;
			var keyCode = event.keyCode || event.which;

			if(keyCode == 3) return this;

			if(
				( !$(event.target).parents('.calendar').length )
				|| (that.$calendar_close && that.$calendar_close.is(event.target))
			){
				if(that.$element && (!that.$element.is(':focus') || (keyCode == 9 || keyCode == 13 || keyCode == 27) )){


					var entered_date = xP.parse_date(that.val(), this.locale);

					if(entered_date[0] && entered_date[1] && entered_date[2]){
						that._set_value(entered_date, true);
					}else{
						that._set_value(entered_date, true);
					}

					xP.controls.opened = null;

					that.$wrapper.removeClass('focus');

					that.$control_calendar.addClass('hidden');
				}
			}

			return this;
		},

		_set_value: function(d, closePopup){
			var that = this;
			var valid = true;

			if(isNaN(d[0]) && isNaN(d[1]) && isNaN(d[2])){
				// empty date
				this.$element.removeClass(that.container_invalid_class);
				return;
			}

			if(d[0] * 1 < 1){
				valid = false;
			}

			if( this.subtype == 'datemonth_picker'){
				d[2] = 1;
			}

			var result = '';

			if(d[2] && d[1] && d[0]){
				result = xP.locale.date_format.replace('dd', xP.leading_zero(d[2]));

				result = result.replace('mm', xP.leading_zero(d[1]));

				result = result.replace('yy', d[0]);

				if(!isNaN(d[3]) && !isNaN(d[4])){

					result += ' ' + xP.leading_zero(d[3]) + ':' + xP.leading_zero(d[4]);

				}
			}else{
				valid = false;
			}

			var draft_state = new Date(d[0], d[1] * 1 - 1, d[2]), d_tmp, _min, _max;

			if(this.min && typeof this.min == 'string'){
				d_tmp = xP.parse_date(this.min, this.locale);

				_min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_min = this.min;
			}

			if(this.max && typeof this.max == 'string'){
				d_tmp = xP.parse_date(this.max, this.locale);

				_max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_max = this.max;
			}

			if(draft_state && _min && draft_state < _min){
				valid = false;
			}
			if(draft_state && _max && draft_state > _max){
				valid = false;
			}

			if(!valid){
				this.$element.addClass(that.container_invalid_class);
					closePopup = false;
			}else{
				this.$element.removeClass(that.container_invalid_class);
			}

			if(!((_min <= draft_state || !_min) && (draft_state <= _max || !_max))){
				if(closePopup){

					that.$wrapper.removeClass('focus');

					that.$control_calendar.addClass('hidden');
				}
				return false;
			}

			this._draft_state = [d[0], d[1] * 1, d[2], d[3], d[4]];

			this._set_value_secret(this._draft_state);

			this.val(result);

			if(closePopup){
				that.$wrapper.removeClass('focus');

				that.$control_calendar.addClass('hidden');
			}

			return false;
		},

		_set_value_secret: function(d){
			var that = this;

			if(d[0] && d[1] && d[2]){
				var date_tmp = d[0] + '-' + ('0' + d[1]).slice(-2) + '-' + ('0' + d[2]).slice(-2);
			}

			switch (this.subtype){
				case 'datetime_picker':
					if(date_tmp && !isNaN(d[3]) && !isNaN(d[4])){
						this.$secret.val(date_tmp + ' ' + ('0' + d[3]).slice(-2) + ':' + ('0' + d[4]).slice(-2));
					}else{
						this.$secret.val(date_tmp);
					}
					break;
				case 'date_picker':
					if(date_tmp){
						this.$secret.val(date_tmp);
					}
					break;
				default:
					if(d[0] && d[1]){
						this.$secret.val(d[0] + '-' + ('0' + d[1]).slice(-2) + '-' + '01');
					}
			}

			var draft_state = new Date(d[0], d[1] * 1 - 1, d[2]), d_tmp, _min, _max;

			if(this.min && typeof this.min == 'string'){
				d_tmp = xP.parse_date(this.min, this.locale);

				_min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_min = this.min;
			}

			if(this.max && typeof this.max == 'string'){
				d_tmp = xP.parse_date(this.max, this.locale);

				_max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_max = this.max;
			}

			var valid = true;

			if(draft_state && _min && draft_state <= _min){
				valid = false;
			}
			if(draft_state && _max && draft_state >= _max){
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

		val: function(value){
			var that = this;

			if(!arguments.length){
				return this.disabled
					? undefined
					: this.$element.val();
			}else{
				return xP.controls.date_picker.base.val.apply(
					this,
					[this._format(value)]
				);
			}
		},

		_format: function(value){
			var d = xP.parse_date(value, this.locale),
				result = '';

			if(d.length){
				if(this.subtype != 'datemonth_picker'){
					result = this.locale.date_format.replace('dd', xP.leading_zero(d[2]));
				}else{
					result = this.locale.date_format.replace('dd.', '');
				}

				result = result.replace('mm', xP.leading_zero(d[1]));

				result = result.replace('yy', d[0]);

				if(this.subtype == 'datetime_picker' && !isNaN(d[3]) && !isNaN(d[4])){
					result += ' ' + xP.leading_zero(d[3]) + ':' + xP.leading_zero(d[4]);
				}

				if(!isNaN(d[0]) && !isNaN(d[1]) && !isNaN(d[2])){
					switch (this.subtype){
						case 'datetime_picker':
							var secret_result = this.locale.date_value_format.replace('yyyy', d[0]) + ' HH:MM';

							secret_result = secret_result.replace('mm', ('0' + d[1]).slice(-2));

							secret_result = secret_result.replace('dd', ('0' + d[2]).slice(-2));

							if(!isNaN(d[3]) && !isNaN(d[4]) ){
								secret_result = secret_result.replace('HH', ('0' + d[3]).slice(-2));
								secret_result = secret_result.replace('MM', ('0' + d[4]).slice(-2));
							}else{
								secret_result = secret_result.replace('HH', '');
								secret_result = secret_result.replace('MM', '');
							}

							this.$secret.val(secret_result);

							break;
						default:
							var secret_result = this.locale.date_value_format.replace('yyyy', d[0]);

							secret_result = secret_result.replace('mm', ('0' + d[1]).slice(-2));

							secret_result = secret_result.replace('dd', ('0' + d[2]).slice(-2));

							this.$secret.val(secret_result);
					}
				}
			}
			return result;
		},

		get_now_array: function(){
			today = new Date();
			return [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(),  Math.ceil(today.getMinutes() / this.minute_round) * this.minute_round];
		},

		build: function(d, update_value){
			if(typeof update_value == 'undefined'){
				update_value = false;
			}
			var current_value = null,
				today = new Date();

			if(d === undefined){
				if(this.val().length == 0){
					if(!this.initial_date){
						d = this.get_now_array();
					}else{
						d = this.initial_date;
					}
				}else{
					d = xP.parse_date(this.val(), this.locale);
					current_value = d[2];
				}
			}else if(update_value){
				this._draft_state = d;

				if(
					this._current_year === this._draft_state[0]
					&& this._current_month === this._draft_state[1]
				){
					current_value = this._current_day;
				}
			}
			var d_tmp, _min, _max;

			if(this.min && typeof this.min == 'string'){
				d_tmp = xP.parse_date(this.min, this.locale);

				_min = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_min = this.min;
			}

			if(this.max && typeof this.max == 'string'){
				d_tmp = xP.parse_date(this.max, this.locale);
				_max = new Date(d_tmp[0], d_tmp[1] - 1, d_tmp[2]);
			}else{
				_max = this.max;
			}

			if(d[1] < 1 || d[1] > 12 || isNaN(d[1])){
				// no month value, replace with current
				if(this.last_build[1]){
					d[1] = this.last_build[1];
				}else{
					d[1] = today.getMonth() + 1;
				}
			}else{
				this.last_build[1] = d[1];
			}

			if(d[0] < 11 || d[1] > 9999 || isNaN(d[0])){
				// no year value, replace with today
				if(this.last_build[0]){
					d[0] = this.last_build[0];
				}else{
					d[0] = today.getFullYear();
				}
			}else{
				this.last_build[0] = d[0];
			}

			this.$calendar_container_inner.empty();

			this.$calendar_year_title.empty();

			this.$calendar_month_title.empty();

			this.$calendar_year_title.html(d[0]);

			this.$calendar_year_title.data('val', d[0]);

			if(this.subtype == 'datemonth_picker'){
				var tmp_date = new Date(d[0], d[1] - 1, 1);
				if((_min && _min > tmp_date) || (_max && tmp_date > _max)){
					this.$calendar_year_title.addClass('invalid');
					this.$calendar_month_title.addClass('invalid');
				}else{
					this.$calendar_year_title.removeClass('invalid');
					this.$calendar_month_title.removeClass('invalid');
				}
			}

			this.$calendar_month_title.html(this.locale.month[d[1] - 1].name);

			this.$calendar_month_title.data('val', d[1]);

			var cur_days  = 33 - new Date(d[0], d[1] - 1, 33).getDate(),
				prev_days = 33 - new Date(d[0], d[1] - 2, 33).getDate(),
				first_day = new Date(d[0], d[1] - 1, 1).getDay() - 1;

			if(first_day === -1){
				first_day = 6;  // Put sunday to the end of week
			}

			var week_shift = 0;

			var $line_pattern = $('<tr></tr>');

			var $line = $line_pattern.clone();

			for(var i = 0; i < 7; i++){
				$(this.control_calendar_daynames_item_html)
					.html(this.locale.weekday[i].abbr)
					.appendTo($line);
			}

			this.$calendar_container_inner.append($line);

			$line = $line_pattern.clone();

			for(var i = 0; i < first_day; i++){
				week_shift++;

				var class_name = 'prev disabled';

				var td_date = new Date(d[0], d[1] - 2, prev_days - first_day + i + 1);

				if( ((_min && _min > td_date) || (_max && td_date > _max) )){
					class_name += ' invalid'
				}

				$(this.control_calendar_item_html).html(prev_days - first_day + i + 1)
					.addClass(class_name)
					.appendTo($line);
			}

			for(var i = 0; i < cur_days; i++){

				var class_name = 'option';

				var td_date = new Date(d[0], d[1] - 1, i + 1);

				if((_min && _min > td_date) || (_max && td_date > _max)){
					class_name += ' invalid'
				}
				$(this.control_calendar_item_html).html(i + 1)
					.addClass((current_value && current_value === i + 1) ? 'selected' : '')
					.addClass((today.getDate() === i + 1) ? 'today' : '')
					.addClass(class_name)
					.appendTo($line);

				if((week_shift + i + 1) % 7 === 0){
					this.$calendar_container_inner.append($line);

					$line = $line_pattern.clone();
				}
			}

			for(var k = 0, ken = 42 - week_shift - cur_days; k < ken; k++){
				var class_name = 'next disabled';

				var td_date = new Date(d[0], d[1], k + 1);

				if((_min && _min > td_date) || (_max && td_date > _max)){
					class_name += ' invalid'
				}

				$(this.control_calendar_item_html).html(k + 1)
					.addClass(class_name)
					.appendTo($line);

				if((week_shift + cur_days + 1 + k) % 7 === 0){
					this.$calendar_container_inner.append($line);

					$line = $line_pattern.clone();
				}
			}

			if(typeof d[3] != 'undefined'){
				this.$calendar_hour_select.val(d[3]);
				this._draft_state[3] = d[3];
			}

			if(!isNaN(d[4])){
				this.$calendar_minute_select.val(Math.ceil(d[4] / this.minute_round) * this.minute_round);
				this._draft_state[4] = d[4];
			}

			if(this.val() && update_value){
				this._set_value(d, false);
			}else{
				if(this.val()){
					this._set_value_secret(d);
				}
			}

		},

		change: function(handler, remove){
			return xP.controls._secret.base.change.apply(this, arguments);
		},

		update: function(){
			var d = xP.parse_date(this.val(), this.locale);

			var current_value = d[2];

			this.$calendar_container_inner.find('.d.option')
				.removeClass('selected')
				.eq(current_value - 1).addClass('selected');

			this.change();
		},

		element_wrap_html:  '<ins class="date_picker_control with_suggest"></ins>',

		control_calendar_html: '<div class="calendar suggest"></div>',

		control_calendar_title_html: '<span class="title"></span>',

		control_calendar_year_html: '<div class="year"></div>',

		control_calendar_month_html: '<div class="month"></div>',

		control_calendar_days_html: '<table class="days"><tbody></tbody></table>',

		control_calendar_item_html: '<td class="d"></td>',

		control_calendar_daynames_item_html: '<th class="dn"></th>',

		calendar_close_html: '<span class="close">&times;</span>',

		control_calendar_inc_html: '<span class="control_button control_button_inc">&rarr;</span>',

		control_calendar_dec_html: '<span class="control_button control_button_dec">&larr;</span>',

		control_calendar_now_html: '<span class="control_button control_button_now"></span>',

		container_valid_class: 'valid',

		container_invalid_class: 'invalid'
	}});


	xP.controls.register({name: 'combobox', base: 'string', prototype: {
		element_selector: '.combobox input, input.combobox, input[list]',

		search_from_start: true,
		case_sensitive: false,

		init: function(params){
			xP.controls.combobox.base.init.apply(this, arguments);

			var $list = $(
					"select#" + xP.taint_css(this.$element.attr('list') + '')
				);

			if($list[0]){
				$list.addClass('combolist');

				var list = xP($list).first(),
					that = this;

				this.list = list;

				list.combobox = this;

				this.change(function(){
					if(list._param('do_not_filter')){
						return;
					}

					var value = that.val(),
						options = list._.options;

					options.length = 0;

					if(value != '' && value != undefined){
						var mask = new RegExp(
								(that.search_from_start ? '^' : '')
								+ xP.taint_css(value),
								that.case_sensitive ? '': 'i'
							);

						list._.enabled_options.each(function(i){
							if(this.text.match(mask)){
								this.disabled = '';

								options[options.length] = this;
							}
						});
					}else{
						list._.enabled_options.each(function(i){
							this.disabled = '';

							options[options.length] = this;
						});
					}

					xP.after(function(){
						var selected_index = list._.element.selectedIndex;

						list._.element.selectedIndex = -1;

						if(list._.options.length === 0){
							list.hide();
						}else if(value){
							if(!that.case_sensitive){
								value = value.toLowerCase();
							}

							var i = 0, l = list._.options.length;

							for(; i < l; i++){
								var ovalue = list._.options[i].text;

								if(!that.case_sensitive){
									ovalue = ovalue.toLowerCase();
								}

								if(value === ovalue){
									list._.element.selectedIndex = i;
									break;
								}
							}
						}

						if(selected_index !== list._.element.selectedIndex){
							list.$element.change();
						}

						if(that.$element.is(':focus')){
							list.show();
						}

						list._param('do_not_show', false);
					});
				});

				this.$element
					.on('focus', function(ev){
						list._param('do_not_filter', false);
						list.show();
					})
					.on('blur', function(ev){
						list.hide();
					})
					.on('keydown', function(ev){
						if(ev.keyCode === 38 || ev.keyCode === 40){
							// up & down.
							if(!list.$element[0].options.length){
								return;
							}
							list._param('do_not_filter', true);
							list._param('do_not_hide', true);
							list.show();
							list.$element.focus();
							if(list.$element[0].selectedIndex === -1){
								list.$element[0].selectedIndex = 0;
								list.$element.change();
							}
						}else if(ev.keyCode === 13 || ev.keyCode === 27){
							list.hide();
						}
					});

				list.$element
					.on('blur', function(ev){
						list._param('do_not_hide', false);
						list.hide();
					})
					.on('change', function(ev){
						var value = list.text();
						if(value){
							that.val(value);
						}
					})
					.on('mousedown', function(ev){
						list._param('do_not_hide', true);
					})
					.on('click keyup', function(ev){
						if(
							ev.type === 'click'
							|| ev.keyCode === 13
							|| ev.keyCode === 27
						){
							list._param('do_not_filter', false);
							list._param('do_not_show', true);
							that.val(list.text());
							that.$element.focus();
							list.hide();
						}else{
							return false;
						}
					})
					.on('keydown', function(ev){
						if(
							ev.keyCode !== 13
							&& ev.keyCode !== 27
							&& ev.keyCode !== 38
							&& ev.keyCode !== 40
						){
							return false;
						}
					});
			}
		}
	}});


	xP.controls.register({name: '_combolist', base: 'select', prototype: {
		element_selector: '.combolist select, select.combolist',

		init: function(params){
			xP.controls._combolist.base.init.apply(this, arguments);

			this.$element
				.css({'position': 'absolute', 'z-index': 888})
				.attr('size', 7).attr('tabIndex', -1)
				.hide()[0].selectedIndex = -1;
			;
		},

		show: function(){
			if(!this._param('do_not_show') && this._.options.length){
				this.$element.show();

				var offset = this.combobox.$element.offset();

				offset.top += this.combobox.$element.outerHeight();

				this.$element.offset(offset);
			}
			return this;
		},

		hide: function(){
			if(!this._param('do_not_hide')){
				this.$element.hide();
			}
			return this;
		}
	}});


	xP.controls.register({name: 'hidden', base: '_field', prototype: {
		element_selector: 'input[type=hidden]',

		find_label: function(){
			this.$label = $();
		}
	}});


/* Dependencies */

	var xP_dependencies_registered = [], xP_dependencies_on = {};

	xP.dependencies = {
		_controls: {},
		_functions: [],

		register: function(params){
			var name = params.name;

			if(!params.prototype){
				params.prototype = {};
			}

			params.prototype.type = name;

			this[params.name] = xP.register(
				$.extend(
					params,
					{
						name: 'expromptum.dependencies.' + name,
						base: $.type(params.base) === 'string'
							? this[params.base]
							: params.base
					}
				)
			);

			xP_dependencies_registered.push(name);
		},

		init: function(params, control){
			var that = this;

			xP.after(function(){
				if(!control && params instanceof xP.controls._item){
					control = params;
				}

				var i = 0, l = xP_dependencies_registered.length, param;

				for(; i < l; i++){
					param = params[xP_dependencies_registered[i]];

					if(param && !(param instanceof xP.dependencies._item)){
						if($.type(param) === 'array'){
							for(var ii = 0, ll = param.length; ii < ll; ii++){
								if(!(param[ii] instanceof xP.dependencies._item)){
									new that[xP_dependencies_registered[i]](
										param[ii], control
									);
								}
							}
						}else{
							new that[xP_dependencies_registered[i]](
								param, control
							);
						}
					}
				}
			});
		}
	};

	xP.dependencies.register({name: '_item', base: xP.base, prototype: {
		init: function(params, control){

			if($.type(params) === 'string'){
				params = {on: params};
			}

			if(!control){
				control = params.to;
			}else{
				this.to = control;
			}
			xP.dependencies._item.base.init.apply(this, [params, control]);

			var that = this,
				root = control && control.parent && control.parent()
					? control.root() : null;

			var parse_controls = function(param, values){
				if($.type(param) !== 'array'){
					param = [param];
				}

				var result = new xP.list(), c, i, l;
				for(i = 0, l = param.length; i < l; i++){
					if($.type(param[i]) === 'string'){
						c = xP(param[i]);
						if(!c.length){
							xP.debug(
								'', 'error',
								param[i] + ' in dependence not found',
								that
							);
						}else{
							result.append(c, root);
						}
					}else{
						result.append(param[i]);
					}
				}

				if(values !== undefined){
					result.filter(function(){
						if(!this.$element.is('[value]')){
							return true;
						}else{
							var i, l = values.length;
							for(i = 0; i < l; i++){
								if($.type(values[i]) === 'regexp'){
									if(
										this.$element.val()
											.match(values[i])
									){
										return true;
									}
								}else{
									if(this.$element.val() == values[i]){
										return true;
									}
								}
							}
						}
						return false;
					});
				}

				return result;
			};

			if(this.values !== undefined && $.type(this.values) !== 'array'){
				this.values = [this.values];
			}

			this.to = parse_controls(this.to, this.values);

			this.from = parse_controls(this.from);

			if($.type(this.on) === 'string'){
				this.on = this.on.replace(
					/((?:\[(?:[^[\]]+=(?:[^[\]]|\[[^[\]]*])+|this|self|search)])+)(\.?)/g,
					function(){
						var control;

						if(arguments[1] === '[search]'){
							control = that.to[0] && that.to[0]._.search ? new xP.list(that.to[0]._.search) : that.to;
						}else if(
							arguments[1] === '[this]'
							|| arguments[1] === '[self]'
						){
							control = that.to;
						}else{
							control = xP(arguments[1], root);

							if(!control[0]){
								control = xP(arguments[1]);
							}

							if(
								!control[0]
								&& root && root.$element.is(arguments[1])
							){
								control = [root];
							}
						}

						that.from.append(control);

						var id = that.from.index(control[0]);

						if(id < 0){
							// TODO: Может стоит отменить зависимость?
							xP.debug(
								'', 'error',
								arguments[1] + ' in dependence not found',
								that
							);

							return arguments[0];
						}

						return 'arguments["' + id + '"].'
							+ (arguments[2] == '.'
								? ''
								: (control[0] instanceof xP.controls.fields
									? 'count'
									: 'val') + '()'
							);
					});

				if(!xP_dependencies_on[this.on]){
					xP_dependencies_on[this.on] = eval('(function (){return ' + this.on + '})');
				}

				this.on = xP_dependencies_on[this.on];
			}

			if(!this.from.length){
				this.from.push(control);
			}

			var destroy = function(){that.destroy();};

			this.suprocess = function(){
				that.process();
			};

			this.from.each(function(){
				this.change(that.suprocess);

				this.destroy(destroy);
			});

			var dependence_init_inquiry = that.type + '_init_inquiry', dependence = control[that.type];

			if(!dependence || !dependence.append){
				dependence = control[that.type] = new xP.list();
			}

			dependence.append(that);

			this.to.each(function(){
				var control = this;

				// TODO: Нужно удалять только, когда удалены все контролы.
				control.destroy(destroy);

				//return;
				if(!control._param(dependence_init_inquiry)){
					control._param(
						dependence_init_inquiry,
						xP.after(function(){
							dependence.each(function(){
								this.to.each(function(){
									this._init_val();
								});

								this.suprocess();
							});

							control._param(dependence_init_inquiry, null);
						}, 0)
					);
				}
			});

			xP.debug(
				'dependencies', 'init dependence ' + this.type,
				this.to.first(), {dependence: this}
			);
		},

		destroy: function(){
			var that = this;

			if(this.from){
				this.from.each(function(){
					this.change(that.suprocess, true);
				});
			}

			if(this.to){
				this.to.each(function(){
					this[that.type] = null;
				});
			}

			this.from
				= this.to
				= this.on
				= this['do']
				= null;

			return this;
		},

		process: function(){
			this.result = this.on.apply(this, this.from);
		}

	}});


	xP.dependencies.register({name: 'classed', base: '_item', prototype: {
		process: function(){
			xP.debug('classed', 'classed', this.to.first(), {dependence: this});

			xP.dependencies.classed.base.process.apply(this);

			var that = this;

			this.to.each(function(){
				if(that.result){
					this.$container
						.addClass(that['do']);
				}else{
					this.$container
						.removeClass(that['do']);
				}
			});
		}
	}});


	xP.dependencies.register({name: 'computed', base: '_item', prototype: {
		process: function(){
			xP.debug('computed', 'computed', this.to.first(), {dependence: this});

			xP.dependencies.computed.base.process.apply(this);

			var that = this;

			this.to.each(function(){
				if(that['do']){
					this.param(that['do'], that.result);
				}else{
					this.val(that.result);
				}
			});
		}
	}});


	xP.dependencies.register({name: 'enabled', base: '_item', prototype: {
		process: function(){

			xP.dependencies.enabled.base.process.apply(this);

			// TODO: Вынести эту функцию.
			var subprocess = function(children){
					children.each(function(){
						if(this.enabled && this.enabled.process){
							this.enabled.process();
						}

						if(this.children){
							subprocess(this.children());
						}
					});
				};

			var that = this;

			this.to.each(function(){
				this.disable(!that.result, that);

				if(that.result && this.children){
					subprocess(this.children());
				}
			});

			xP.debug(
				'enabled', 'enabled',
				this.to.first(), {dependence: this}, this.result
			);
		}
	}});


	//TODO: Надо бы сделать ее рабочей и для sheet-ов (для кнопок next и prev).
	xP.dependencies.register({name: 'enabled_on_completed', base: '_item', prototype: {
		init: function(params, control){
			xP.dependencies.enabled_on_completed.base.init.apply(
				this,
				[{from: [control.root()]}, control]
			);
		},

		process: function(){
			xP.debug(
				'enabled_on_completed', 'enabled_on_completed',
				this.to.first(), {dependence: this}
			);

			this.result = this.to.first().root().uncompleted();

			var that = this;

			this.to.each(function(){
				this.disable(that.result);
			});
		}
	}});


	xP.dependencies.register({name: '_rooted', base: '_item', prototype: {
		init: function(params, control){
			if(!this._.root_type){
				this._.root_type = this.type;
			}

			xP.dependencies._rooted.base.init.apply(this, arguments);

			var root = this.to.first().root();

			this._.root = root._param(this._.root_type)
				|| root._param(this._.root_type, new xP.list());
		},

		destroy: function(){
			if(this.to){
				this.to_root(false);

				this.to.first().root().change();
			}

			return xP.dependencies._rooted.base.destroy.apply(this, arguments);
		},

		to_root: function(append){
			var that = this;

			this.to.each(function(){
				if(this._.no_root_dependencies){return;}

				if(append){
					that._.root.append(this);
				}else{
					that._.root.remove(this);
				}
			});
		}
	}});


	xP.dependencies.register({name: 'required', base: '_rooted', prototype: {
		init: function(params, control){
			if($.type(params) === 'string'){
				params = {on: params};
			}
			if(
				$.type(params.on) === 'string'
				&& !params.on.match(/\[(?:this|self)]/)
			){
				params.on = '(' + params.on + ') && ![this] && [this] !== 0';
			}
			if(!params.on){
				this.on = '![this] && [this] !== 0';
			}
			xP.dependencies.required.base.init.apply(this, [params, control]);
		},

		process: function(){
			xP.debug('required', 'required', this.to.first(), {dependence: this});

			xP.dependencies.required.base.process.apply(this);

			var that = this;

			this.to.each(function(){
				if(that.result){
					this.$container
						.addClass(that.container_required_class)
						.removeClass(that.container_unrequired_class);
				}else{
					this.$container
						.removeClass(that.container_required_class)
						.addClass(that.container_unrequired_class);
				}
			});

			this.to_root(this.result);
		},

		container_required_class: 'required',
		container_unrequired_class: 'unrequired'
	}});


	xP.dependencies.register({name: 'valid', base: '_rooted', prototype: {
		init: function(params, control){
			this._.root_type = 'invalid';
			if($.type(params) === 'regexp'){
				params = params.toString();
			}
			if($.type(params) === 'string' && params.indexOf('/') === 0){
				params = '[this] !== undefined && [this].val().match(' + params + ')';
			}

			xP.dependencies.valid.base.init.apply(this, [params, control]);
		},

		process: function(){
			xP.debug(
				'valid', 'valid', this.to.first(), {dependence: this}, this.result
			);

			var that = this;

			this.to.each(function(){
				// TODO: Избавиться бы от проверки типа.
				var value = this.val();
				if(
					!value && value !== 0 && !isNaN(value)
					&& !(this instanceof xP.controls.fields)
				){
					this.$container
						.removeClass(that.container_valid_class)
						.removeClass(that.container_invalid_class);

					that.result = true;
				}else{
					xP.dependencies.valid.base.process.apply(that);

					if(that.result){
						this.$container
							.addClass(that.container_valid_class)
							.removeClass(that.container_invalid_class);
					}else{
						this.$container
							.removeClass(that.container_valid_class)
							.addClass(that.container_invalid_class);
					}
				}
			});

			this.to_root(!this.result);
		},

		container_valid_class: 'valid',
		container_invalid_class: 'invalid'
	}});


	xP.dependencies.register({name: 'changed', base: '_rooted', prototype: {
		init: function(params, control){
			xP.dependencies.changed.base.init.apply(this, arguments);
		},

		process: function(){
			if(!this.to){return;} // TODO: Надо разобраться с destroy.
			xP.debug('changed', 'changed', this.to.first(), {dependence: this});

			var that = this;

			this.to.each(function(){
				// TODO: Разобраться с этой строчкой. Можно оптимизировать.
				var cur = this.val(),//this._param('value'),
					ini = this._param('initial_value');

				that.result = ini != cur;

				this.$container.toggleClass(
					that.container_changed_class,
					that.result
				);

				that.to_root(that.result);

				var parent = this.parent();

				if(parent){
					parent.change();
				}
			});
		},

		container_changed_class: 'changed'
	}});


	xP.root = new xP.controls.fields({$element: $('html')});


/* Repeats */

	xP.controls.register({name: 'repeat_append_button', base: 'button', prototype: {
		element_selector: '.repeat_append_button',

		init: function(params){
			xP.controls.repeat_append_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){repeat.append(parent);})
			.enabled = {
				on: function(){return repeat.val() < repeat.max},
				from: repeat
			};
		}
	}});

	xP.controls.register({name: 'repeat_insert_button', base: 'button', prototype: {
		element_selector: '.repeat_insert_button',

		init: function(params){
			xP.controls.repeat_insert_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){repeat.append(parent, true);})
			.enabled = {
				on: function(){return repeat.val() < repeat.max},
				from: repeat
			};
		}
	}});


	xP.controls.register({name: 'repeat_remove_button', base: 'button', prototype: {
		element_selector: '.repeat_remove_button',

		init: function(params){
			xP.controls.repeat_remove_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){
				if(repeat.val() > repeat.min){
					repeat.remove(parent);
				}else{
					parent.reset();
				}
			}).classed = {
				on: function(){return repeat.val() <= repeat.min},
				from: repeat,
				do: this.reset_class
			};
		},

		reset_class: 'repeat_reset_button'
	}});


	xP.controls.register({name: 'repeat_first_button', base: 'button', prototype: {
		element_selector: '.repeat_first_button',

		init: function(params){
			xP.controls.repeat_first_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){repeat.move(parent, 0);})
			.enabled = {
				on: function(){return 0 < parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xP.controls.register({name: 'repeat_prev_button', base: 'button', prototype: {
		element_selector: '.repeat_prev_button',

		init: function(params){
			xP.controls.repeat_prev_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){
				repeat.move(parent, parent._param('repeat_position') - 1);
			}).enabled = {
				on: function(){
					return 0 < parent._param('repeat_position') * 1
				},
				from: repeat
			};
		}
	}});


	xP.controls.register({name: 'repeat_next_button', base: 'button', prototype: {
		element_selector: '.repeat_next_button',

		init: function(params){
			xP.controls.repeat_next_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){
				repeat.move(parent, parent._param('repeat_position') * 1 + 1);
			}).enabled = {
				on: function(){
					return repeat.children().length - 1 > parent._param('repeat_position') * 1
				},
				from: repeat
			};
		}
	}});


	xP.controls.register({name: 'repeat_last_button', base: 'button', prototype: {
		element_selector: '.repeat_last_button',

		init: function(params){
			xP.controls.repeat_last_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xP.repeats.item)){
				return;
			}

			this.click(function(){
				repeat.move(parent, repeat.children().length - 1);
			}).enabled = {
				on: function(){return repeat.children().length - 1 > parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xP.repeats = {
		init: function(control){
			if(control.repeat){
				if($.type(control.repeat) !== 'object'){
					control.repeat = {};
				}

				if(!control.root()._param('repeats')){
					control.root()._param('repeats', {});
				}

				control.repeat.id = control.repeat.id || control.name;

				var id = control.repeat.id,
					repeats = control.root()._param('repeats');

				if(!repeats[id]){
					repeats[id] = new xP.repeats.item(control);
				}else{
					repeats[id].adopt(control);
				}
			}
		}
	};


	xP.repeats.item = xP.register({name: 'expromptum.repeats.item', base: xP.base, prototype: {
		min: 1,
		max: 300,

		name_suffix_before: '[', // Если пусто, то не будет суфиксов в именах.
		name_suffix_after: ']',

		id_suffix_before: '~',
		id_suffix_after: '',

		container_inited_class: 'repeated',
		container_position_class: 'repeated_',
		container_template_class: 'repeated_template',

		init: function(control){
			xP.debug(
				'repeats', 'init repeat',
				control, control.repeat.id ? control.repeat.id : '', {repeat: this}
			);

			xP.repeats.item.base.init.apply(this);

			this.name_suffix_splitter = new RegExp(
				'('
				+ xP.taint_regexp(this.name_suffix_before)
				+ '\\d+'
				+ xP.taint_regexp(this.name_suffix_after)
				+ ')(?=(?:'
				+ xP.taint_regexp(this.name_suffix_before)
				+ '\\d+'
				+ xP.taint_regexp(this.name_suffix_after)
				+ ')*$)'
			);

			this.id_suffix_pattern = new RegExp(
				xP.taint_regexp(this.id_suffix_before)
				+ '\\d+'
				+ xP.taint_regexp(this.id_suffix_after)
				+ '$'
			);

			this.container_position_class_pattern = new RegExp(
				'(^|\\s)'
				+ xP.taint_regexp(this.container_position_class)
				+ '\\d+(?=\\s|$)'
			);

			this._.children = [];

			this.nesting = 0;

			var parent = control;

			while(parent && (parent = parent.parent())){
				if(parent.repeat){
					this.parent = parent;
					this.nesting = parent.repeat.nesting + 1;
					break;
				}
			}

			this.adopt(control, true);

			// Если не был задан шаблон, создаем его сами.
			var that = this;

			xP.after(function(){
				if(!that.template){
					that.temp_template = true;
					// TODO: Добавить параметр remove_siblings.

					var children = that.children(),
						control = children[children.length - 1];

					that.append(control);

					that.temp_template = false;
				}
			}, 1);
		},

		destroy: function(handler, remove){
			xP.repeats.item.base.destroy.apply(this, arguments);

			if(!arguments.length && this.control._){
				this.control.root()._param('repeats')[this.id] = null;
			}
			return this;
		},

		val: function(value){
			return this.children().length;
		},

		children: function(){
			return this._.children;
		},

		adopt: function(control, first){

			control._param('repeat_position', 0);

			var that = this,
				template = (control.repeat.template || this.temp_template)
					&& !this.template;

			$.extend(this, control.repeat);

			if(!this.control || template){
				xP.after(function(){
					that.control = control;
				});

				control.$container
				.find('*:not([id])').addBack('*:not([id])').each(function(){
					this.id = 'xP' + (Math.random() + '').substr(2, 8);
				});

				if(!control.html){
					control.html = $('<div>')
						.append(control.$container.clone())
						.html();
				}
			}

			xP.after(function(){
				control.$container
				.find('*[id^=xP]').addBack('*[id^=xP]').each(function(){
					var $e = $(this),
						control = xP.controls.link($e);

					if(!control || control.$element[0] !== this){
						$e.removeAttr('id');
					}
				});
			});

			if(template){
				control._.repeat_template = true;
				control._.no_root_dependencies = true;
				repeat_change_suffixes(
					this,
					control,
					888
				);

				control.$container.hide();

				control.$container.addClass(this.container_template_class);

				xP.after(function(){
					control.$container
					.find('input, textarea, select, button').addBack()
					.attr('disabled', true);
				});
			}else{
				repeat_change_suffixes(
					this,
					control,
					this.position !== undefined
						? this.position
						: this.children().length
				);

				this.children().push(control);
			}

			if(this.control){
				repeat_new_control_count++;
			}

			control.repeat = this;

			control.destroy(function(){
				var children = that.children(), i = children.length;

				while(i--){
					if(control === children[i]){
						that._.children.splice(i, 1);

						break;
					}
				}

				if(!that.children().length){
					that.destroy();
				}
			});

			control.$container.addClass(this.container_inited_class);

		},

		move: function(control, new_position){
			var children = this.children(), i, l,
				old_position = control._param('repeat_position');

			if(new_position < old_position){
				control.$container.insertBefore(
					children[new_position].$container
				);

				i = new_position;
				l = children.length;
			}else{
				control.$container.insertAfter(
					children[new_position].$container
				);

				i = old_position;
				l = new_position + 1;
			}

			children.splice(
				new_position, 0, children.splice(old_position, 1)[0]
			);

			for(; i < l; i++){
				repeat_change_suffixes(
					this,
					children[i],
					i
				);
			}

			this.change();
		},

		remove: function(control){
			var children = this.children(), i = children.length, l = i - 1;

			while(i--){
				if(control === children[i]){
					children.splice(i, 1);

					break;
				}
			}

			control.remove();

			while(i < l){
				repeat_change_suffixes(
					this,
					children[i],
					i
				);

				i++;
			}

			this.change();
		},

		append: function(control, before){
			var children = this.children(), i = children.length, l = i;

			while(i--){
				if(control === children[i]){
					break;
				}
			}

			if(before){
				i--;
			}

			while(l-- && l > i){
				repeat_change_suffixes(
					this,
					children[l],
					l + 1
				);
			}

			var id_suffix = this.id_suffix_before
					+ repeat_new_control_count + this.id_suffix_after,
				$container = $(
					this.control._get_html().replace(
						/(\s(id|for|list)\s*=\s*"[^"]+)"/g,
						'$1' + id_suffix + '"'
					).replace(
						/(\sname\s*=\s*"[^"]+)"/g,
						'$1_xp_repeat_temp"'
					).replace(
						/(\sdata-name\s*=\s*"[^"]+)"/g,
						'$1_xp_repeat_temp"'
					)
				);

			$container.find('[data-xp], [data-expromptum]')
				.removeAttr('data-xp').removeAttr('data-expromptum');

			$container.find('[disabled]')
				.add($container.filter('[disabled]'))
				.removeAttr('disabled'); // For FF 28

			if(before){
				$container.insertBefore(control.$container);
			}else{
				$container.insertAfter(control.$container);
			}

			var result = repeat_init_new_control(
					this,
					$container,
					this.control,
					id_suffix,
					this.temp_template ? 888 : i + 1
				);

			var that = this;

			$container.find('input[type!=radio], textarea, select')
				.add($container.filter('input[type!=radio], textarea, select'))
				.not(function(){
					var reset = xP(this).first().reset_on_repeat;
					return that.reset && reset === false
						|| !that.reset && !reset;
				})
				.removeAttr('checked')
				.prop('checked', false)
				.not(
					'[type=button], [type=img], [type=submit],'
					+ '[type=checkbox], [type=radio]'
				)
				.val('')
				.filter('select').each(function(){this.selectedIndex = 0});

			if(!this.temp_template){
				var c = this.children().pop();

				this.children().splice(i + 1, 0, c);
			}

			this.change();

			return result;
		}

	}}, 'xP.repeats.item');


	var repeat_init_new_control = function(
			repeat, $container, control, id_suffix, position
		){
			var id = control.$element.attr('id');

			if(!id){
				return;
			}

			var selector = '#'
				+ xP.taint_css(
					id.replace(
						repeat.id_suffix_pattern, ''
					)
					+ id_suffix
				),
				$element = $container.is(selector)
					? $container
					: $(selector, $container);

			if(!$element[0]){
				if(window.console){
					// TODO: Не забыть убрать это после тестирования.
					// Возникает при вложенных repeat-ах.
					console.warn(
						'In', $container,
						'not found', selector,
						'by', control.$element.first(), 'via suffix', id_suffix
					);
				}
				return;
			}

			var params = repeat_get_params(
					repeat,
					$container,
					control,
					id_suffix
				);

			params.$element = $element;

			params.changed = undefined;

			if(control.repeat){
				if(control.repeat.id !== repeat.id){
					params.repeat = {};
					$.each(control.repeat, function(name, value){
						if(
							name.indexOf('_') != 0
							&& name !== 'position'
							&& !(value instanceof xP.controls._item)
							&& !(value instanceof jQuery)
							&& $.type(value) !== 'function'
						){
							params.repeat[name] = value;
						}
					});
					params.repeat.id = control.repeat.id + id_suffix;

					if(
						control === control.repeat.control
						&& !repeat.temp_template
					){
						params.repeat.template = true;
					}
				}else{
					control.repeat.position = position;
				}
			}

			var result = xP.controls.link(params.$element);

			if(!result){
				result = new xP.controls[params.type](params);
			}

			if(control.children){
				control.children().each(function(){
					repeat_init_new_control(
						repeat,
						$container,
						this,
						id_suffix,
						position
					);
				});
			}

			return result;
		},

		repeat_change_suffixes = function(repeat, control, position){
			control._param('repeat_position', position);

			control.$container[0].className =
				control.$container[0].className.replace(
					repeat.container_position_class_pattern, ''
				);

			if(!repeat.name_suffix_before){
				return;
			}

			control._.repeat_suffix
				= (repeat.parent && repeat.parent._.repeat_suffix
					? repeat.parent._.repeat_suffix : '')
				+ repeat.name_suffix_before
				+ position + repeat.name_suffix_after;

			control.$container.addClass(
				repeat.container_position_class + position
			);

			var option_names = {},
				root_options = control.root()._param('_option'), e;

			control.$container.find('[name], [data-name]').addBack('[name], [data-name]').each(function(){
				var $e = $(this),
					type = $e.attr('type'),
					name = $e.attr('name') ? $e.attr('name') : $e.data('name'),
					parts = name.replace(/_xp_repeat_temp$/, '').split(repeat.name_suffix_splitter),
					new_name = parts[0] + control._.repeat_suffix;

				for(var i = repeat.nesting * 2 + 3, l = parts.length; i < l; i++){
					new_name += parts[i];
				}

				if(name !== new_name){

					if($e.attr('name')){
						$e.attr('name', new_name);
						e = xP.controls.link($e)
						if(e){
							e.name = new_name;
						}
					}
					if($e.attr('data-name')){
						$e.attr('data-name', new_name);
						$e.data('name', new_name);
					}

					if(type === 'checkbox' || type === 'radio'){
						option_names[name] = new_name;
					}
				}
			});

			$.each(option_names, function(name, value){
				if(root_options && root_options[name]){
					root_options[value] = root_options[name];

					root_options[name] = null;
				}
			});

			var parent = control.parent();

			if(parent){
				parent.children().sort(function(a, b){
					if(
						a._param('repeat_position')
						< b._param('repeat_position')
					){
						return -1;
					}else{
						return 1;
					}
				});
			}
		},

		repeat_get_params = function(repeat, $container, object, id_suffix){
			var result = {};

			$.each(object, function(name, value){
				if(
					name.indexOf('_') != 0
					&& !(value instanceof jQuery)
					&& ($.type(value) !== 'function' || name === 'on')
				){
					result[name] = repeat_get_params_value(
						repeat,
						$container,
						value,
						id_suffix
					);
				}
			});

			return result;
		},

		repeat_get_params_value = function(
			repeat, $container, object, id_suffix
		){
			var	result, id, new_id, tainted_new_id;

			if($.type(object) === 'array'){
				result = [];

				for(var i = 0, l = object.length, v; i < l; i++){
					v = repeat_get_params_value(
							repeat, $container, object[i], id_suffix
						);

					if(v !== undefined){
						result.push(v);
					}
				}
			}else{
				if(
					object instanceof xP.controls._item
					&& object.$element
					&& object.$element.attr('id')
				){
					id = object.$element.attr('id');
				}else if(object && object.id){
					id = object.id;
				}

				if(id){
					new_id = id.replace(repeat.id_suffix_pattern, '')
						+ id_suffix;

					tainted_new_id = xP.taint_css(new_id);
				}

				if(
					id
					&& (
						$container.attr('id') == new_id
						|| $container.find('#' + tainted_new_id).length
					)
				){
					result = '[id=' + tainted_new_id + ']';
				}else if(
					object instanceof xP.repeats.item
					|| object instanceof xP.controls._item
				){
					result = object;
				}else if($.type(object) === 'object'){
					result = repeat_get_params(
						repeat, $container, object, id_suffix
					);
				}else{
					result = object;
				}
			}

			return result;
		},

		repeat_new_control_count = 0;


	return xP;
})();})(window, jQuery);
