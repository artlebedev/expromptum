// Expromptum JavaScript Library
// Copyright Art. Lebedev | http://www.artlebedev.ru/
// Updated 2014-03-18 Vladimir Tokmakov <vlalek>


(function(window){
if(window.expromptum){return;}

window.expromptum = (function(undefined){

/* Core */

	var xp = function(params, parent){
		// TODO: Добавить третий параметр в котором можно передавать data-xp.
		if(!params){
			params = '[data-xp], [data-expromptum]';
			for(var i = 0, ii = xp_controls_registered.length; i < ii; i++){
				params += ','
					+ xp.controls[xp_controls_registered[i]]
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
						parent instanceof xp.controls._item
							? parent.$container
							: parent
					)
					: null
			);
		}

		if(params instanceof jQuery){
			return xp.controls.init(params);
		}else if(params instanceof Object && parent){
			return xp.controls.create(params, parent);
			// Create by params.
		}else{
			if(xp.debug()){
				console.log('Error', 'Unknown params', params);
			}

			return new xp.list();
		}
	};



/* Tools */

	xp.register = function(params){
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

	xp.list = function(arr){
		var result = $.type(arr) === 'array' ? arr: (arr ? [arr] : []);

		result.append = function(obj){
			if(!obj){
				return this;
			}

			if($.type(obj) === 'array'){
				for(var i = 0, ii = obj.length; i < ii; i++){
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

		result.each = function(handler){
			var i = 0, ii = this.length, current, result;

			while(i < ii){
				current = this[i];

				result = handler.apply(current, [i]);

				if(result === false){
					break;
				}

				if(this[i] === current){
					i++;
				}else{
					ii = this.length;
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
				handler.apply(this[i % this.length]);
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

	xp.debug = function(type){
		return location.href.indexOf('xp=' + (type ? type : '')) > 0;
	};

	xp.after = function(handler, i){
		if(i){
			return setTimeout(function(){xp.after(handler, --i);}, 0);
		}else{
			return setTimeout(function(){handler()}, 0);
		}
	};

	xp.taint_regexp = function(value){
		return value.replace(xp.taint_regexp_pattern, '\\');
	};

	xp.taint_regexp_pattern = /(?=[\\\^\$\.\[\]\|\(\)\?\*\+\{\}])/g;

	xp.taint_css = function(value){
		return value.replace(xp.taint_css_pattern, '\\');
	};

	xp.taint_css_pattern
		= /(?=[\\\^\$\.\[\]\|\(\)\?\*\+\{\}\:\<\>\@\/\~\&\=])/g;



/* Locale */

	xp.locale = {
		init: function(){
			var t = xp.locale.number;

			$.extend(
				t,
				{
					format: {
						decimal: /\./,
						grouping: /(\d)(?=(\d{3})+([^\d]|$))/g
					},
					unformat: {
						decimal: new RegExp('[\\.\\' + t.decimal + ']'),
						grouping: new RegExp('\\' + t.grouping, 'g')
					}
				}
			);
		},

		destroy: function(){
		},

		// TODO: Надо сделать выбор.
		abbr: 'ru',

		number: {decimal: ',', grouping: ' '},

		date: 'dd.mm.yy',

		month: [
			{abbr: 'янв', name: 'Январь',   name_genitive: 'января'},
			{abbr: 'фев', name: 'Февраль',  name_genitive: 'февраля'},
			{abbr: 'мар', name: 'Март',     name_genitive: 'марта'},
			{abbr: 'апр', name: 'Апрель',   name_genitive: 'апреля'},
			{abbr: 'мая', name: 'Май',      name_genitive: 'мая'},
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

		next_month: 'Следующий',

		yesterday: 'Вчера',

		today: 'Сегодня',

		tomorrow: 'Завтра'
	};

	xp.locale.init();



/* Base */

	xp.base = xp.register({name: 'xp.base', prototype: {

		init: function(params){
			this._.on_destroy = new xp.list();
			this._.on_change  = new xp.list();

			$.extend(this, params);
		},

		destroy: function(handler, remove){
			if(!arguments.length){
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
					var that = this;

					that._.change_inquiry = xp.after(function(){
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

	var xp_controls_registered = [];

	xp.controls = {
		register: function(params){
			var name = params.name;

			if(!params.prototype){
				params.prototype = {};
			}

			params.prototype.type = name;

			this[params.name] = xp.register(
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
				xp_controls_registered.push(name);
			}
		},

		init: function($elements){
			var result = new xp.list(), that = this;

			$elements.each(function(){
				var $element = $(this), control = that.link($element);

				if(!control){
					var params = $element.data('expromptum')
						|| $element.data('xp');

					if($.type(params) === 'string'){
						if(!params.match(/^^\s*\{/)){
							params = '{' + params + '}';
						}

						params = eval(
							'(function(){return '
							+ params
								.replace(/([\{,])\s*do\s*:/g, '$1\'do\':')
							+ '})()'
						);
					}

					$element
						.removeAttr('data-expromptum')
						.removeAttr('data-xp');

					if(!params){
						params = {};
					}

					if(!params.type){
						var i = xp_controls_registered.length;

						while(i--){
							if(
								$element.is(
									xp.controls[xp_controls_registered[i]]
										.prototype.element_selector
								)
							){
								params.type = xp_controls_registered[i];

								break;
							}
						}
					}

					if(
						xp.controls[params.type]
						&& xp.controls[params.type].base
					){
						params.$element = $element;

						control = new xp.controls[params.type](params);
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

				$element[0].expromptum = control;
			}else{
				return $element.data('expromptum.control');
			}
		}
	};


	xp.controls.register({name: '_item', base: xp.base,  prototype: {
		init: function(params){
			xp.controls._item.base.init.apply(this, arguments);

			if(!this.$element){
				this.create();
			}

			if(xp.debug('controls')){
				console.log('init', this.$element, this);
			}

			if(!this.$container && this.container_selector){
				this.$container
					= this.$element.parents(this.container_selector).first();
			}

			if(!this.$container || !this.$container.length){
				this.$container = this.$element;
			}

			var a = ['disabled', 'required', 'autofocus', 'min', 'max', 'step'],
				i = a.length, v;

			while(i--){
				v = this.$element.attr(a[i]);

				if(v !== undefined && !this[a[i]] !== undefined){
					this[a[i]] = v;
				}
			}

			if(this.autofocus){
				// TODO: Надо подумать, как лучше поступать при disabled.
				this.$element.focus();
			}

			/*if(!this.valid){
				v = this.$element.attr('pattern');

				if(v){
					this.valid = new RegExp(v);
				}else{
					v = xp.dependencies.valid_match[
						this.$element.attr('type')
					];

					if(v){
						this.valid = v;
					}
				}
			}*/

			var that = this;


			this._init_val();

			if(this.disabled || this.enabled === false){
				this.disabled = false;
				// Чтобы отключить добавленные элементы (secret).
				xp.after(function(){
					that.disable();
				});
			}

			xp.after(function(){
				that.change();
				that._init_val();
			});


			if(!this._.parent){
				// TODO: Дописать перемещение детей из родителя.
				this.$element.parentsUntil('body').each(function(){
					var control = xp.controls.link($(this));

					if(control){
						that._.parent = control;
						return false;
					}
				});
			}

			if(this._.parent){
				this._.no_root_dependencies
					= this._.parent._.no_root_dependencies;

				this._.parent._.children.append(this);

				this._.root = this._.parent._.root;
			}else{
				this._.root = this;
			}

			xp.controls.link(this.$element, this);
			xp.controls.link(this.$container, this);

			if(xp.repeats){
				xp.repeats.init(this);
			}

			xp.dependencies.init(this);
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
		},

		destroy: function(handler, remove){
			xp.controls._item.base.destroy.apply(this, arguments);

			if(!arguments.length){
				if(this._.parent){
					this._.parent._.children.remove(this);
				}

				this.$container
					= this.$element
					= this._
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
		}
	}});


	xp.controls.register({name: 'html', base: '_item', prototype: {
		element_selector: '.xp_html',

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


	xp.controls.register({name: '_parent', base: '_item', prototype: {
		element_selector: '.xp',

		init: function(params){
			this.changed = {};

			this._.children = new xp.list();

			xp.controls._parent.base.init.apply(this, arguments);

			this._.children_values = {};

			var parent4values = this._.parent || this._.root;

			while(
				!parent4values.name
				&& !parent4values.repeat
				&& parent4values._.parent
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

			return xp.controls._parent.base.destroy.apply(this, arguments);
		},

		disable: function(disabled){
			if(this.disabled !== disabled){
				xp.controls._parent.base.disable.apply(this, arguments);

				if(this.disabled){
					this._.parent4values._unsave_val(this);
				}

				this._.children.each(function(){
					this.disable(disabled);
				});
			}

			return this;
		},

		val: function(value, _suffix){
			if(!arguments.length){
				return this._.children_values;
			}else{
				var that = this;

				if(this.repeat){
					if($.type(value) !== 'array'){
						value = [value];
					}

					for(var i = 0, ii = value.length, j, suffix; i < ii; i++){
						if(i){
							that = that.repeat.append(that);
						}
						that._set_vals(
							value[i],
							_suffix + that.repeat.name_suffix_before
								+ i + that.repeat.name_suffix_after
						);
					}
				}else{
					that._set_vals(value, '');
				}

				return this;
			}
		},

		_set_vals: function(value, suffix){
			var that = this;

			xp.after(function(){
				$.each(value, function(name, value){
					var controls = that._find_by_name(name)
							|| that._find_by_name(name + suffix);

					if(controls){
						for(var i = 0, ii = controls.length; i < ii; i++){
							controls[i].val(value, suffix);
						}
					}
				});
			}, 4);
			// TODO: Ох уж эти мне таймауты. Нужно с ними разбираться.
		},

		change: function(handler, remove){
			if(!arguments.length && this._.parent4values){
				this._.parent4values._save_val(this);
			}

			return xp.controls._parent.base.change.apply(this, arguments);
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

					if(child instanceof xp.controls.checkbox){
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

					if(!(subresult[0] instanceof xp.controls._option)){
						return false;
					}
				}
			});

			return result.length ? result : null;
		}
	}});


	xp.controls.register({name: 'form', base: '_parent', prototype: {
		element_selector: 'form',

		init: function(params){

			this.uncomplete_if_required = true;
			this.uncomplete_if_invalid_required = true;
			//this.uncomplete_if_invalid = false;
			//this.uncomplete_if_unchanged = false;

			xp.controls.form.base.init.apply(this, arguments);

			this._.onsubmit = new xp.list();

			var that = this;

			this.$element.bind('submit', function(){
				return that.submit();
			});

			this.submit(function(){
				var uncompleted = this.uncompleted();

				if(uncompleted){
					if(xp.debug('submit')){
						console.log(uncompleted);
					}

					return false;
				}else if(this.locked){
					if(xp.debug('submit')){
						console.log('locked');
					}

					return false;
				}else{
					this.locked = true;
				}

				if(xp.debug('submit')){
					console.log('submit');

					return false;
				}
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
				this.uncomplete_if_required
				&& this._.required
				&& $.grep(
					this._.required,
					function(ctrl){return !ctrl.disabled}
				).length
			){
				return 'required';
			}

			if(
				this.uncomplete_if_invalid_required
				&& this._.invalid
				&& $.grep(
					this._.invalid,
					function(ctrl){return !ctrl.disabled && ctrl.required}
				).length
			){
				return 'invalid_required';
			}

			if(
				this.uncomplete_if_invalid
				&& this._.invalid
				&& $.grep(
					this._.invalid,
					function(ctrl){return !ctrl.disabled}
				).length
			){
				return 'invalid';
			}

			if(
				this.uncomplete_if_unchanged
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


	xp.controls.register({name: 'fields', base: '_parent', prototype: {
		element_selector: 'fieldset, .fields, .sheets',

		count: function(){
			if(this.disabled || !this.children().length){
				return undefined;
			}

			var result = 0;

			this.children().each(function(){
				if(this instanceof xp.controls.fields){
					if(this.val()){
						result++;
					}
				}else if(this.val() != ''){
					result++;
				}
			});

			return result;
		}
	}});


	xp.controls.register({name: 'sheet', base: 'fields', prototype: {
		element_selector: '.sheet',

		init: function(params){
			xp.controls.sheet.base.init.apply(this, arguments);

			var id = this.$element.attr('id');

			if(!this.$label && id){
				this.$label = $("[for='" + xp.taint_css(id) + "']");
			}

			if(this.$label && this.$label[0]){
				var parent = this.parent(), that = this;

				this.select(
					!parent._param('selected_sheet')
					|| this.selected
					|| this.$label.hasClass(this.selected_class)
				);

				this.$label.click(function(){
					var previous = parent._param('selected_sheet');

					if(previous && previous !== that){
						previous.select(false);
					}

					that.select();
				});
			}
		},

		select: function(selected){
			if(!arguments.length || selected){
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

		selected_class: 'selected',
		unselected_class: 'unselected'
	}});


	xp.controls.register({name: '_field', base: '_parent', prototype: {
		element_selector: 'input',
		container_selector: '.field',

		init: function(params){
			xp.controls._field.base.init.apply(this, arguments);

			var that = this;

			this.$element.bind(this.change_events, function(){
				that.change();
			});

			this.$element.blur(function(){
				that.$container.addClass(that.container_blured_class);
			});

			this.name = this.$element.attr('name');

			var id = this.$element.attr('id');

			if(!this.$label && id){
				this.$label = $("[for='" + xp.taint_css(id) + "']");
			}

			if(this.$container == this.$element){
				this.$container = this.$container.add(this.$label);
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

			xp.controls._field.base.change.apply(this);
		},

		change_events: 'keyup change',
		container_blured_class: 'blured',

		destroy: function(handler, remove){
			if(!arguments.length){
				this.$label = null;
			}

			return xp.controls._field.base.destroy.apply(this, arguments);
		},

		change: function(handler, remove){
			if(!arguments.length){
				var that = this,
					changed = false,
					old = this._param('value'),
					cur = this.val();

				if(old != cur){
					changed = true;
					this._param('value', cur);
				}

				if(changed){
					return xp.controls._field.base.change.apply(
						this,
						arguments
					);
				}else{
					return this;
				}
			}else{
				return xp.controls._field.base.change.apply(this, arguments);
			}
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled ? undefined : this.$element.val();
			}else{
				var el = this.$element[0],
					start = el.selectionStart,
					end = el.selectionEnd;

				if(el.value != value){
					el.value = value;

					if(this.$element.is(':focus')){
						el.selectionStart = start;

						el.selectionEnd = end;
					}

					this.change();
				}

				return this;
			}
		}
	}});


	xp.controls.register({name: 'string', base: '_field', prototype: {
		element_selector: 'input[type=text], input:not([type])'
	}});


	xp.controls.register({name: 'text', base: '_field', prototype: {
		element_selector: 'textarea'
	}});


	xp.controls.register({name: 'hidden', base: '_field', prototype: {
		element_selector: 'input[type=hidden]'
	}});


	xp.controls.register({name: 'file', base: '_field', prototype: {
		element_selector: 'input[type=file]'
	}});


	xp.controls.register({name: 'button', base: '_parent', prototype: {
		element_selector: 'input[type=button], button, .button'
	}});


	xp.controls.register({name: 'submit', base: '_item', prototype: {
		element_selector: 'input[type=submit], button[type=submit]'
	}});


	xp.controls.register({name: 'select', base: '_field', prototype: {
		element_selector: 'select',

		hide_disabled_option: true,

		init: function(params){
			xp.controls.select.base.init.apply(this, arguments);

			this._.options =  this.$element[0].options;

			this._.all_options = [];

			var options = this.$element[0].options, i = 0, ii = options.length;

			for(;i < ii; i++){
				this._.all_options[i] = options[i];
			}
		},

		disable: function(disabled, values){
			// TODO: Добавить поддержку values к radio и checkbox-ам.
			if(values !== undefined){
				if($.type(values) !== 'array'){
					values = [values];
				}

				// TODO: Добавить поддержку optgroup.
				var i = 0, ii = this._.all_options.length, option,
					j, jj = values.length, disable, k = 0, value = this.val(),
					options = this._.options, selected;

				if(this.hide_disabled_option){
					options.length = 0;
				}

				if(disabled){
					this._.disabled_value = value;
				}else{
					var that = this;

					xp.after(function(){
						that._.disabled_value = undefined;
					});
				}

				for(;i < ii; i++){
					disable = true;

					option = this._.all_options[i];

					if(!this.hide_disabled_option){
						k = i;
					}

					if(!disabled){
						for(j = 0;j < jj; j++){
							if($.type(values[j]) === 'regexp'){
								disable = !option.value.match(values[j]);
							}else{
								disable = option.value != values[j];
							}

							if(!disable){
								if(
									selected === undefined
									|| value == option.value
									|| (
										value === null
										&& this._.disabled_value == option.value
									)
								){
									selected = k;
								}

								option.disabled = '';

								if(
									this.hide_disabled_option
									&& !option.parentNode
								){
									options[options.length] = option;
									k++;
								}

								break;
							}
						}
					}

					if(disable){
						option.disabled = 'true';
					}
				}

				if(
					selected !== undefined
					&& this._.options[selected].value != value
				){
					this.$element[0].selectedIndex = selected;

					this.$element.change();
				}
				return this;
			}else{
				return xp.controls.select.base.disable.apply(this, arguments);
			}
		}
	}});


	xp.controls.register({name: 'options', base: 'fields', prototype: {
		element_selector: '.options'
	}});


	xp.controls.register({name: '_option', base: '_field', prototype: {
		container_selector: '.option',

		init: function(params){
			xp.controls._option.base.init.apply(this, arguments);

			if(!this.root()._param(this.type)){
				this.root()._param(this.type, {});
			}

			if(!this.root()._param(this.type)[this.name]){
				this.root()._param(this.type)[this.name]
					= {siblings: new xp.list()};
			}

			this._.group = this.root()._param(this.type)[this.name];

			this._.group.siblings.append(this);

			this.selected = null;

			this._init_val();
		},

		change_events: 'change',

		change: function(handler, remove){
			this.select(this.$element.is(':checked'), true);

			xp.controls._option.base.change.apply(this, arguments);

			return this;
		},

		_init_val: function(){
			/*this.select(this.$element.is(':checked'));*/

			if(this.selected){
				this.$container.addClass(this.container_initial_selected_class);
			}

			xp.controls._option.base._init_val.apply(this, arguments);
		},

		container_initial_selected_class: 'initial_selected',
		container_selected_class: 'selected',

		val: function(value){
			if(!arguments.length){
				return !this.selected
					? ''
					: xp.controls._option.base.val.apply(this, arguments);
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
					this.$element.attr('checked', true);
					this.$element[0].checked = true; // For FF 18.
				}else{
					this.$element.removeAttr('checked');
				}

				if(!_onchange){
					this.change();
				}
			}
			return this;
		}
	}});


	xp.controls.register({name: 'radio', base: '_option', prototype: {
		element_selector: 'input[type=radio]',

		disable: function(disabled){
			if(this.disabled !== disabled){
				xp.controls.radio.base.disable.apply(this, arguments);

				if(disabled){
					if(this.selected){
						//xp.after(function(){
						this._.group.siblings.each(function(){
							if(!this.disabled){
								this.select();

								return false;
							}
						});
						//});
					}
				}else if(
					this._.group.selected
					&& this._.group.selected.disabled
				){
					this.select();

					this.change();
				}
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
						//xp.after(function(){
						that_selected.select(false);
						//});
					}
				}
				xp.controls.radio.base.select.apply(this, arguments);
			}

			return this;
		}
	}});


	xp.controls.register({name: 'checkbox', base: '_option', prototype: {
		element_selector: 'input[type=checkbox]'
	}});


	xp.controls.register({name: 'email', base: '_field', prototype: {
		element_selector: '.email input, input.email',
		valid: '[this].val().match(/^\\S+@\\S+\\.\\S{2,4}$/)'
	}});


	xp.controls.register({name: 'phone', base: '_field', prototype: {
		element_selector: '.phone input, input.phone',
		valid: '[this].val().match(/^(?=[^()]*\\(([^()]*\\)[^()]*)?$|[^()]*$)(?=[\\s(]*\\+[^+]*$|[^+]*$)([-+.\\s()]*\\d){11,18}$/)'
	}});


	xp.controls.register({name: '_secret', base: 'string', prototype: {
		init: function(params){
			xp.controls._secret.base.init.apply(this, arguments);

			// Это тот элемент, который будет отправлен формой.
			this.$secret = $(
				$('<div>')
					.append(this.$element.clone().hide())
					.html()
					.replace(/\s+(type|id)\s*=\s*[^\s>]+/g, '')
			).insertBefore(this.$element);

			this.$element.removeAttr('name');

			xp.controls.link(this.$secret, this);
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this.$secret = null;
			}

			return xp.controls._secret.base.destroy.apply(this, arguments);
		},

		disable: function(disabled){
			if(this.disabled !== disabled){
				if(disabled){
					this.$secret.attr('disabled', true);
				}else{
					this.$secret.removeAttr('disabled');
				}
				xp.controls._secret.base.disable.apply(this, arguments);
			}

			return this;
		}
	}});


	xp.controls.register({name: 'password', base: '_secret', prototype: {
		element_selector: 'input[type=password]',

		init: function(params){
			xp.controls.password.base.init.apply(this, arguments);

			var that = this;

			this.$element.bind('keyup change', function(){
				that.$secret.val(that.$element.val());
			});

			this.$secret.bind('keyup', function(){
				that.$element.val(that.$secret.val());
			});

			this.control_button_view
				= $(this.control_button_view_html)
					.insertAfter(this.$element)
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


	xp.controls.register({name: 'number', base: '_secret', prototype: {
		element_selector: 'input.number, .number input',

		step: 1,
		min: 1 - Number.MAX_VALUE,
		def: 0,
		max: Number.MAX_VALUE - 1,
		locale: xp.locale,

		init: function(params){
			this.allow_chars_pattern = new RegExp(
				'^[-0-9\\s'
				+ this.locale.number.decimal
				+ this.locale.number.grouping
				+ ']$'
			);

			xp.controls.number.base.init.apply(this, arguments);

			var that = this;

			this.$element.wrap(this.element_wrap_html);

			$(this.control_button_dec_html)
			. insertBefore(this.$element)
			. mousedown(function(){
				if(that.disabled){
					return false;
				}

				that.dec();

				return false;
			});

			$(this.control_button_inc_html)
				.insertAfter(this.$element)
				.mousedown(function(){
					if(that.disabled){
						return false;
					}

					that.inc();

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

			this.change(function(){
				this.$secret.val(that.val());
			});

			this.$element.blur(function(){
				that.val(that.val());
			});
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				// TODO: Подумать об этом.
				//this.locale.destroy();
			}

			return xp.controls.number.base.destroy.apply(this, arguments);
		},

		element_wrap_html: '<span class="number_control"/>',

		control_button_dec_html:
			'<span class="control_button control_button_dec"/>',

		control_button_inc_html:
			'<span class="control_button control_button_inc"/>',
		//TODO: Добавить кнопку reset.

		inc: function(){
			var value = this.val();

			if(!value && value !== 0){
				value = this.def;
			}

			value = value - 0 + this.step * 1;

			if(value > this.max * 1){
				return false;
			}

			return this.val(value);
		},

		dec: function(){
			var value = this.val();

			if(!value && value !== 0){
				value = this.def;
			}

			value = value - this.step * 1;

			if(value < this.min * 1){
				return false;
			}

			return this.val(value);
		},

		val: function(value){
			// TODO: Надо посмотреть нет ли тут лишних преобразований.
			if(!arguments.length){
				return this.disabled
					? undefined
					: this._unformat(this.$element.val());
			}else{
				this.$secret.val(this._unformat(value));

				return xp.controls.number.base.val.apply(
					this,
					[this._format(value)]
				);
			}
		},

		_format: function(value){
			var num = this.locale.number;

			value += '';

			return value
				.replace(num.format.decimal, num.decimal)
				.replace(num.format.grouping, '$1' + num.grouping);
		},

		_unformat: function(value){
			var num = this.locale.number;

			value += '';

			return value
				.replace(num.unformat.grouping, '')
				.replace(num.unformat.decimal, '.');
		}
	}});


	xp.controls.register({name: 'date', base: '_secret', prototype: {
		element_selector: 'input.date, .date input',

		init: function(params){
			this.locale = xp.locale;

			xp.controls.date.base.init.apply(this, arguments);

			var month_names = [],
				day_names = [this.locale.weekday[6].name],
				day_names_min = [this.locale.weekday[6].abbr];

			for(var i = 0, ii = this.locale.month.length; i < ii; i++){
				month_names.push(this.locale.month[i].name);
			}

			for(var i = 0, ii = this.locale.weekday.length - 1; i < ii; i++){
				day_names.push(this.locale.weekday[i].name);

				day_names_min.push(this.locale.weekday[i].abbr);
			}

			this.$element.datepicker($.extend({
				autoSize: true,
				changeMonth: true,
				changeYear: true,
				dateFormat: this.locale.date,
				firstDay: this.locale.first_day,
				prevText: this.locale.prev_month,
				nextText: this.locale.next_month,
				dayNames: day_names,
				dayNamesMin: day_names_min,
				monthNamesShort: month_names,
				altField: this.$secret,
				altFormat: 'yy-mm-dd'
			}, this.datepicker));

			if(this._.initial_value){
				this.$element.datepicker(
					'setDate',
					new Date(this._.initial_value.replace(/\s*\d+:\S+\s*/, ''))
				);
			}
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this.locale.destroy();

				this.$element.datepicker('destroy');
			}
			return xp.controls.date.base.destroy.apply(this, arguments);
		},

		param: function(name, value){
			switch(name){
				case 'min':
					this.$element.datepicker('option', 'minDate', value);
					return value;
					break;

				default:
					return xp.controls.date.base.param.apply(this, arguments);
			};
		},

		date: function(){
			return this.$element.datepicker('getDate');
		},

		val: function(value){
			if(!arguments.length){
				return this.disabled
					? undefined
					: (
						this.$secret
							? this.$secret.val()
							: this.$element.val()
					);
			}else{
				this.$element.datepicker('setDate', new Date(value));

				return this;
			}
		}
	}});


	xp.controls.register({name: 'datetime', base: 'date', prototype: {
		element_selector: 'input.datetime, .datetime input',

		init: function(params){
			var value = params.$element.val();

			xp.controls.datetime.base.init.apply(this, arguments);

			this._.$time = $('<input value="' + value.substr(11,2)
				+ '" class="hours"/>:<input value="' + value.substr(14,2)
				+ '" class="minutes"/>').insertAfter(this.$element);

			var that = this,
				add_time = function(){
					that.$secret.val(
						that.$secret.val().replace(/\s+\d+:\d+/, '')
							+ ' ' + that._.$time.first().val() + ':'
							+ that._.$time.last().val()
					);
				};

			this._.time_control = new xp.list();

			this._.$time.filter('input').each(function(){
				that._.time_control.append(
					(new xp.controls.number({
						$element: $(this),
						min: 0,
						max: 23,
						changed: null
					}))
						.change(add_time)
						.change(function(){
							that.change();
						})
				);
			});

			this._.time_control.last().max = 59;

			this.change(add_time);

			if(this._.initial_value){
				this.$secret.val(this._.initial_value);
			}
		},

		destroy: function(handler, remove){
			if(!arguments.length){
				this._.time_control.each(function(){this.destroy();});

				this._.$time.remove();
			}

			return xp.controls.datetime.base.destroy.apply(this, arguments);
		},

		disable: function(disabled){
			if(this.disabled !== disabled){
				xp.controls.datetime.base.disable.apply(this, arguments);

				this._.time_control.each(function(){this.disable(disabled);});
			}

			return this;
		}
	}});


	xp.controls.register({name: 'combobox', base: 'string', prototype: {
		element_selector: '.combobox input, input.combobox, input[list]',
		
		search_from_start: true,

		init: function(params){
			xp.controls.combobox.base.init.apply(this, arguments);

			var $element = $(
					"select#" + xp.taint_css(this.$element.attr('list'))
				);

			if($element[0]){
				var list = new xp.controls._combolist({
						$element: $element,
						$container: $element
					}),
					that = this;

				that.list = list;

				this.change(function(){
					var value = this.val();

					if(value != ''){
						var length = list._param('options').length;

						list.disable(
							false,
							new RegExp(
								(this.search_from_start ? '^' : '')
								+ xp.taint_css(value)
							)
						);

						var new_length = list._param('options').length;

						if(new_length === 0){
							list.hide();
						}
					}else{
						list.disable(false, /.?/);
					}
					list.$element[0].selectedIndex = 8888;
				});

				this.$element
					.bind('focus click', function(){
						list.show();
					})
					.keydown(function(ev){
						if(ev.keyCode === 38 || ev.keyCode === 40){
							// up & down.
							list._param('do_not_hide', true);
							list.show();
							list.$element.focus();
						}
					})
					.blur(function(){
						if(!list._param('do_not_hide')){
							list.hide();
						}
					});

				list.$element
					.mousedown(function(ev){
						list._param('do_not_hide', true);
					})
					.bind('keydown click', function(ev){
						if(ev.type === 'click' || ev.keyCode === 13){
							// enter.
							that.val(list.val());
							that.$element.focus();
							list.hide();
						}
					})
					.bind('blur keypress', function(ev){
						if(ev.type === 'blur' || ev.keyCode === 27){
							// escape.
							that.$element.focus();
							list.hide();
						}
					});
			}
		}
	}});


	xp.controls.register({name: '_combolist', base: 'select', prototype: {

		init: function(params){
			xp.controls._combolist.base.init.apply(this, arguments);

			this.$element.css({'position': 'absolute', 'z-index': 888});
			this.$element.attr('size', 7);
			this.hide();
		},

		show: function(){
			if(this.$element[0].options.length){
				this.$element.show();
			}
			return this;
		},

		hide: function(){
			this._param('do_not_hide', false);
			this.$element.hide();
			return this;
		}
	}});



/* Dependencies */

	var xp_dependencies_registered = [];

	xp.dependencies = {
		_controls: {},
		_functions: [],

		register: function(params){
			var name = params.name;

			if(!params.prototype){
				params.prototype = {};
			}

			params.prototype.type = name;

			this[params.name] = xp.register(
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

			xp_dependencies_registered.push(name);
		},

		init: function(params, control){
			var that = this;

			xp.after(function(){
				if(!control && params instanceof xp.controls._item){
					control = params;
				}

				var i = 0, ii = xp_dependencies_registered.length, param;

				for(; i < ii; i++){
					param = params[xp_dependencies_registered[i]];

					if(param && !(param instanceof xp.dependencies._item)){
						if($.type(param) === 'array'){
							for(var j = 0, jj = param.length; j < jj; j++){
								new that[xp_dependencies_registered[i]](
									param[j], control
								);
							}
						}else{
							new that[xp_dependencies_registered[i]](
								param, control
							);
						}
					}
				}
			});
		}
	};

	xp.dependencies.register({name: '_item', base: xp.base, prototype: {
		init: function(params, control){
			this.to = control;

			if($.type(params) === 'string'){
				params = {on: params};
			}

			xp.dependencies._item.base.init.apply(this, arguments);

			var that = this;

			//TODO: Оптимизировать. Теперь все проще.
			var parse_controls = function(param){
					if($.type(param) !== 'array'){
						param = [param];
					}

					var result = new xp.list();
					for(var i = 0, ii = param.length; i < ii; i++){
						if($.type(param[i]) === 'string'){
							result.append(xp(param[i]));
						}else{
							result.append(param[i]);
						}
					}
					return result;
				};

			this.to = parse_controls(this.to);

			this.from = parse_controls(this.from);


			if($.type(this.on) === 'string'){
				this.on = this.on.replace(
					/((?:\[(?:[^\[\]]+=(?:[^\[\]]|\[[^\[\]]*\])+|this|self)\])+)(\.?)/g,
					function(){
						var control;

						if(
							arguments[1] === '[this]'
							|| arguments[1] === '[self]'
						){
							control = that.to;
						}else{
							control = xp(arguments[1]);
						}

						that.from.append(control);

						id = that.from.index(control[0]);

						return 'arguments["' + id + '"].'
							+ (arguments[2] == '.'
								? ''
								: (control[0] instanceof xp.controls.fields
									? 'count'
									: 'val') + '()'
							);
					});

				eval('this.on = function(){return ' + this.on + '}');
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

			this.to.each(function(){
				if(this[that.type] instanceof xp.dependencies._item){
					//this[that.type].destroy();
				}
				this[that.type] = that;
				// TODO: Нужно удалять только, когда удалены все контролы.
				this.destroy(destroy);
			});

			if(
				control
				&& !(control[this.type] instanceof xp.dependencies._item)
			){
				control[this.type] = null;
			}

			this.init_process();

			if(xp.debug('dependencies')){
				console.log('init', this.to.first().$element, this);
			}
		},

		init_process: function(){
			xp.after(this.suprocess, 0);
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


	xp.dependencies.register({name: 'classed', base: '_item', prototype: {
		process: function(){
			if(xp.debug('dependencies') || xp.debug('classed')){
				console.log('classed', this.to.first().$element, this.to);
			}

			xp.dependencies.classed.base.process.apply(this);

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


	xp.dependencies.register({name: 'computed', base: '_item', prototype: {
		process: function(){
			if(xp.debug('dependencies') || xp.debug('computed')){
				console.log('computed', this.to.first().$element, this.to);
			}

			xp.dependencies.classed.base.process.apply(this);

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


	xp.dependencies.register({name: 'enabled', base: '_item', prototype: {
		init_process: function(){
			this.suprocess();

			this.to.each(function(){
				//this._init_val();
			});

		},

		process: function(){

			xp.dependencies.enabled.base.process.apply(this);

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

			var that = this, enable;

			this.to.each(function(){
				if(that.values){
					if(that.result){
						enable = this;
						xp.after(function(){
							enable.disable(false, that.values);
						});
					}else{
						this.disable(true, '');
					}
				}else{
					this.disable(!that.result);

					if(that.result && this.children){
						subprocess(this.children());
					}
				}
			});

			if(xp.debug('dependencies') || xp.debug('enabled')){
				console.log(
					'enabled', this.to.first().$element, this.to, this.result
				);
			}
		}
	}});


	//TODO: Надо бы сделать ее рабочей и для sheet-ов (для кнопок next и prev).
	xp.dependencies.register({name: 'enabled_on_completed', base: '_item', prototype: {
		init: function(params, control){
			xp.dependencies.enabled_on_completed.base.init.apply(
				this,
				[{from: [control.root()]}, control]
			);
		},

		process: function(){
			if(xp.debug('dependencies') || xp.debug('enabled_on_completed')){
				console.log(
					'enabled_on_completed',
					this.to.first().$element,
					this.to
				);
			}

			this.result = this.to.first().root().uncompleted();

			var that = this;

			this.to.each(function(){
				this.disable(that.result);
			});
		}
	}});


	xp.dependencies.register({name: '_rooted', base: '_item', prototype: {
		init: function(params, control){
			if(!this._.root_type){
				this._.root_type = this.type;
			}

			xp.dependencies._rooted.base.init.apply(this, arguments);

			var root = this.to.first().root();

			this._.root = root._param(this._.root_type)
				|| root._param(this._.root_type, new xp.list());
		},

		destroy: function(){
			if(this.to){
				this.to_root(false);

				this.to.first().root().change();
			}

			return xp.dependencies._rooted.base.destroy.apply(this, arguments);
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


	xp.dependencies.register({name: 'required', base: '_rooted', prototype: {
		init: function(params, control){
			if($.type(params) === 'string'){
				params = {on: params};
			}
			if(
				$.type(params.on) === 'string'
				&& !params.on.match(/\[(?:this|self)\]/)
			){
				params.on = "![this] || !(" + params.on + ")";
			}
			if(!params.on){
				this.on = "![this]";
			}
			xp.dependencies.required.base.init.apply(this, [params, control]);
		},

		process: function(){
			if(xp.debug('dependencies') || xp.debug('required')){
				console.log('required', this.to.first().$element, this.to);
			}

			xp.dependencies.required.base.process.apply(this);

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


	xp.dependencies.register({name: 'valid', base: '_rooted', prototype: {
		init: function(params, control){
			this._.root_type = 'invalid';

			xp.dependencies.valid.base.init.apply(this, arguments);
		},

		process: function(){
			if(xp.debug('dependencies') || xp.debug('valid')){
				console.log(
					'valid', this.result, this.to.first().$element, this.to
				);
			}

			var that = this;
			
			this.to.each(function(){
				// TODO: Избавиться бы от проверки типа.
				if(!this.val() && !(this instanceof xp.controls.fields)){
					this.$container
						.removeClass(that.container_valid_class)
						.removeClass(that.container_invalid_class);

					that.result = true;
				}else{
					xp.dependencies.valid.base.process.apply(that);

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


	xp.dependencies.register({name: 'changed', base: '_rooted', prototype: {
		init: function(params, control){
			xp.dependencies.changed.base.init.apply(this, arguments);

			var that = this;

			xp.after(function(){
				//that.change_parents();
			}, 1);
		},

		process: function(){
			if(xp.debug('dependencies') || xp.debug('changed')){
				console.log('changed', this.to.first().$element, this.to);
			}

			var that = this;

			this.to.each(function(){
				// TODO: Разобраться с этой строчкой. Можно оптимизировать.
				var cur = this.val(),//this._param('value'),
					ini = this._param('initial_value');

				that.result = (ini === undefined ? '' : ini) != cur;

				this.$container.toggleClass(
					that.container_changed_class,
					that.result
				);

				that.to_root(that.result);

				var parent = this.parent();

				if(parent){
					parent.change();
				}
				//that.change_parents();
			});
		},

		change_parents: function(){
			var parents = new xp.list();

			this.to.each(function(){
				var parent = this;

				while(parent = parent.parent()){
					parents.append(parent);
				}
			});

			parents.each(function(){
				this.change();
			});
		},

		container_changed_class: 'changed'
	}});



/* Repeats */

	xp.controls.register({name: 'repeat_append_button', base: 'button', prototype: {
		element_selector: '.repeat_append_button',

		init: function(params){
			xp.controls.repeat_append_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.append(parent);

				return false;
			});

			this.enabled = {
				on: function(){return repeat.val() < repeat.max}, from: repeat
			};
		}
	}});

	xp.controls.register({name: 'repeat_insert_button', base: 'button', prototype: {
		element_selector: '.repeat_insert_button',

		init: function(params){
			xp.controls.repeat_insert_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.append(parent, true);

				return false;
			});

			this.enabled = {
				on: function(){return repeat.val() < repeat.max}, from: repeat
			};
		}
	}});


	xp.controls.register({name: 'repeat_remove_button', base: 'button', prototype: {
		element_selector: '.repeat_remove_button',

		init: function(params){
			xp.controls.repeat_remove_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.remove(parent);

				return false;
			});

			this.enabled = {
				on: function(){return repeat.val() > repeat.min}, from: repeat
			};
		}
	}});


	xp.controls.register({name: 'repeat_first_button', base: 'button', prototype: {
		element_selector: '.repeat_first_button',

		init: function(params){
			xp.controls.repeat_first_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.move(parent, 0);

				return false;
			});

			this.enabled = {
				on: function(){return 0 < parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xp.controls.register({name: 'repeat_prev_button', base: 'button', prototype: {
		element_selector: '.repeat_prev_button',

		init: function(params){
			xp.controls.repeat_first_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.move(parent, parent._param('repeat_position') - 1);

				return false;
			});

			this.enabled = {
				on: function(){return 0 < parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xp.controls.register({name: 'repeat_next_button', base: 'button', prototype: {
		element_selector: '.repeat_next_button',

		init: function(params){
			xp.controls.repeat_first_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				repeat.move(parent, parent._param('repeat_position') * 1 + 1);

				return false;
			});

			this.enabled = {
				on: function(){return repeat.children().length - 1 > parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xp.controls.register({name: 'repeat_last_button', base: 'button', prototype: {
		element_selector: '.repeat_last_button',

		init: function(params){
			xp.controls.repeat_first_button.base.init.apply(this, arguments);

			var parent = this.parent(), repeat = parent.repeat;

			if(!(repeat instanceof xp.repeats.item)){
				return;
			}

			this.$element.click(function(){
				//repeat.remove(parent);
				repeat.move(parent, repeat.children().length - 1);

				return false;
			});

			this.enabled = {
				on: function(){return repeat.children().length - 1 > parent._param('repeat_position') * 1},
				from: repeat
			};
		}
	}});


	xp.repeats = {
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
					repeats[id] = new xp.repeats.item(control);
				}else{
					repeats[id].adopt(control);
				}
			}
		}
	};


	xp.repeats.item = xp.register({name: 'expromptum.repeats.item', base: xp.base, prototype: {
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
			if(xp.debug('repeats')){
				console.log('init', control.$element, control.repeat.id, this);
			}

			xp.repeats.item.base.init.apply(this);

			this.name_suffix_splitter = new RegExp(
				'('
				+ xp.taint_regexp(this.name_suffix_before)
				+ '\\d+'
				+ xp.taint_regexp(this.name_suffix_after)
				+ ')(?=(?:'
				+ xp.taint_regexp(this.name_suffix_before)
				+ '\\d+'
				+ xp.taint_regexp(this.name_suffix_after)
				+ ')*$)'
			);

			this.id_suffix_pattern = new RegExp(
				xp.taint_regexp(this.id_suffix_before)
				+ '\\d+'
				+ xp.taint_regexp(this.id_suffix_after)
				+ '$'
			);

			this.container_position_class_pattern = new RegExp(
				'(^|\\s)'
				+ xp.taint_regexp(this.container_position_class)
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

			xp.after(function(){
				if(!that.template){
					that.temp_template = true;
					// TODO: Добавить параметры reset_values и remove_siblings.

					var children = that.children(),
						control = children[children.length - 1];

					that.append(control);

					that.temp_template = false;
				}
			}, 1);
		},

		destroy: function(handler, remove){
			xp.repeats.item.base.destroy.apply(this, arguments);

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
				xp.after(function(){
					that.control = control;
				});

				control.$container
				.find('*:not([id])').andSelf('*:not([id])').each(function(){
					this.id = 'xp' + (Math.random() + '').substr(2, 8);
				});

				if(!control.html){
					control.html = $('<div>')
						.append(control.$container.clone())
						.html();
				}
			}

			xp.after(function(){
				control.$container
				.find('*[id^=xp]').andSelf('*[id^=xp]').each(function(){
					var $e = $(this),
						control = xp.controls.link($e);

					if(!control || control.$element[0] !== this){
						$e.removeAttr('id');
					}
				});
			});

			if(template){
				control._.repeat_template = true;
				control._.no_root_dependencies = true;

				control.$container.hide();

				control.$container.addClass(this.container_template_class);

				xp.after(function(){
					control.$container
					.find('input, textarea, select, button').andSelf()
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
			var children = this.children(), i, ii,
				old_position = control._param('repeat_position');

			if(new_position < old_position){
				control.$container.insertBefore(
					children[new_position].$container
				);

				i = new_position;
				ii = children.length;
			}else{
				control.$container.insertAfter(
					children[new_position].$container
				);

				i = old_position;
				ii = new_position + 1;
			}

			children.splice(
				new_position, 0, children.splice(old_position, 1)[0]
			);

			for(; i < ii; i++){
				repeat_change_suffixes(
					this,
					children[i],
					i
				);
			}

			this.change();
		},

		remove: function(control){
			var children = this.children(), i = children.length, ii = i - 1;

			while(i--){
				if(control === children[i]){
					children.splice(i, 1);

					break;
				}
			}

			control.remove();

			while(ii-- && ii >= i){
				repeat_change_suffixes(
					this,
					children[ii],
					ii
				);
			}

			this.change();
		},

		append: function(control, before){
			var children = this.children(), i = ii = children.length;

			while(i--){
				if(control === children[i]){
					break;
				}
			}

			if(before){
				i--;
			}

			while(ii-- && ii > i){
				repeat_change_suffixes(
					this,
					children[ii],
					ii + 1
				);
			}

			var id_suffix = this.id_suffix_before
					+ repeat_new_control_count + this.id_suffix_after,
				$container = $(
					this.control._get_html().replace(
						/(\s(id|for|list)\s*=\s*([\"\'])\S+)\3/g,
						'$1' + id_suffix + '$3'
					)
				);

			$container.find('[data-xp]').each(function(){
				$(this).removeAttr('data-xp');
			});

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

			if(!this.temp_template){
				var c = this.children().pop();

				this.children().splice(i + 1, 0, c);
			}

			this.change();

			return result;
		}

	}}, 'xp.repeats.item');


	var repeat_init_new_control = function(
			repeat, $container, control, id_suffix, position
		){
			var selector = '#'
				+ xp.taint_css(
					control.$element.attr('id').replace(
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
					params.repeat = {
						id: control.repeat.id + id_suffix
					};

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

			var result = xp.controls.link(params.$element);

			if(!result){
				result = new xp.controls[params.type](params);
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
				= (repeat.parent ? repeat.parent._.repeat_suffix : '')
				+ repeat.name_suffix_before
				+ position + repeat.name_suffix_after;

			control.$container.addClass(
				repeat.container_position_class + position
			);

			control.$container.find('[name]').andSelf('[name]').each(function(){
				var $e = $(this),
					name = $e.attr('name'),
					parts = name.split(repeat.name_suffix_splitter),
					new_name = parts[0] + control._.repeat_suffix;

				for(var i = repeat.nesting * 2 + 3; i < parts.length; i++){
					new_name += parts[i]
				}

				if(name !== new_name){
					$e.attr('name', new_name);
				}
			});

			control.parent().children().sort(function(a, b){
				if(a._param('repeat_position') < b._param('repeat_position')){
					b.change();

					return -1;
				}else{
					return 1;
				}
			});
		},

		repeat_get_params = function(repeat, $container, object, id_suffix){
			var result = {};

			$.each(object, function(name, value){
				if(
					(name.indexOf('_') != 0)
					&& !(value instanceof jQuery)
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

				for(var i = 0, ii = object.length, v; i < ii; i++){
					v = repeat_get_params_value(
							repeat, $container, object[i], id_suffix
						);

					if(v !== undefined){
						result.push(v);
					}
				}
			}else{
				if(
					object instanceof xp.controls._item
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

					tainted_new_id = xp.taint_css(new_id);
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
					object instanceof xp.repeats.item
					|| object instanceof xp.controls._item
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


	return xp;
})();})(window);
