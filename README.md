# Expromptum <img src="expromptum.png"/>

- [Коротко](#summary)
- [Инициализация](#init)
- [Контролы](#controls)
- [Зависимости](#dependencies)
- [Повторения](#repeats)
- [Концепция](#common)
- [Режим диагностики](#debug)

Expromptum — библиотека JavaScript, предназначенная для расширения функциональности работы элементов в HTML.

Использует библиотеку [jQuery](http://jquery.com/) для работы с элементами (версии 1.8.0 и выше).

Чтобы использовать библиотеку надо подключить ее к странице содержащей соответствующий HTML и выполнить [инициализацию](#init).


###### Пример

```html
<script src="jquery.js"></script>
<script src="expromptum.js"></script>
<style>
	.field {position: relative;}
	.show_on_blured_and_invalid {display: none;}
	.blured.invalid .show_on_blured_and_invalid {display: block; position: absolute; left: 0; bottom: -3em;}
</style>
...
<form method="post">
	<span class="field">
		<input name="email" placeholder="Email" data-xp="type: 'email', required: true"/>

		<span class="show_on_blured_and_invalid">Enter a&nbsp;valid email address.</span>
	</span>

	<span class="field">
		<input name="password" placeholder="Password" type="password" data-xp="required: true"/>
	</span>

	<input type="submit" value="Sign in" data-xp="enabled_on_completed: true"/>
</form>
...
<script>
	expromptum();
</script>
```

* * *

## <a href="#summary" name="summary">Коротко</a>


### [Контролы](#controls)

*Тип контрола определяется CSS-селектором или значением свойства `type` в атрибуте `data-xp`. Для остальных свойств контрола указаны противоположные или отличные от используемых по умолчанию значения.*


<div><a href="#controls.form">Форма</a></div>
```html
<form data-xp="
	type: 'form',
	completed_on_required: false,
	completed_on_valid_required: false,
	completed_on_valid: true,
	completed_on_changed: true
"></form>
```

<div><a href="#controls.fields">Группа полей, листы</a></div>
```html
<div class="fields" data-xp="type: 'fields'"></div>
```

<div><a href="#controls.foldable">Сворачиваемая панель</a></div>
```html
<strong for="foldable_1">Panel 1</strong>
<div class="foldable" id="foldable_1" data-xp="type: 'foldable', unfolded: true"></div>
```

<div><a href="#controls.sheet">Лист</a></div>
```html
<div class="sheets" data-xp="type: 'fields'">
	<strong for="sheet_1">Sheet 1</strong>

	<strong for="sheet_2">Sheet 2</strong>

	<div class="sheet" id="sheet_1" data-xp="type: 'sheet'"></div>

	<div class="sheet selected" id="sheet_2" data-xp="type: 'sheet'"></div>
</div>
```

<div><a href="#controls.html">HTML</a></div>
```html
<span class="xp_html" data-xp="type: 'html', computed: '[name=some]' + '!'"></span>
```

*Без указания зависимости [computed](#dependencies.computed), в этом контроле мало смысла.*

#### Кнопки

<div><a href="#controls.button">Кнопка</a></div>
```html
<input type="button" value="Button" data-xp="type: 'button'"/>

<button data-xp="type: 'button'">Button</button>

<span class="button" data-xp="type: 'button'">Button</span>
```

<div><a href="#controls.submit">Кнопка отправки</a></div>
```html
<input type="submit" data-xp="type: 'submit'"/>
```


#### Поля для ввода

<div><a href="#controls.string">Строковое поле</a></div>
```html
<input data-xp="type: 'string'"/>
```

<div><a href="#controls.text">Текстовое поле</a></div>
```html
<textarea data-xp="type: 'text'"></textarea>
```

<div><a href="#controls.hidden">Скрытое поле</a></div>
```html
<input type="hidden" data-xp="type: 'hidden'"/>
```

<div><a href="#controls.file">Файловое поле</a></div>
```html
<input type="file" data-xp="type: 'file'"/>
```

<div><a href="#controls.password">Поле для пароля</a></div>
```html
<input type="password" data-xp="type: 'password'"/>
```

<div><a href="#controls.number">Поле для числа</a></div>
```html
<input class="number" data-xp="
	type: 'number',
	min: 0,
	max: 10,
	step: 2,
	def: 0
"/>
```

<div><a href="#controls.datemonth">Поле для года и месяца</a></div>
```html
<input class="datemonth" data-xp="type: 'datemonth'"/>
```

<div><a href="#controls.date">Поле для даты</a></div>
```html
<input class="date" data-xp="type: 'date'"/>
```

<div><a href="#controls.datetime">Поле для даты и времени</a></div>
```html
<input class="datetime" data-xp="type: 'datetime'"/>
```

<div><a href="#controls.email">Поле для эл. почты</a></div>
```html
<input class="email" data-xp="type: 'email'"/>
```

<div><a href="#controls.phone">Поле для телефона</a></div>
```html
<input class="phone" data-xp="type: 'phone'"/>
```


#### Выбор значений

<div><a href="#controls.select">Выпадающий список</a></div>
```html
<select data-xp="type: 'select', hide_disabled_option: false">...</select>
```

<div><a href="#controls.combobox">Комбобокс</a></div>
```html
<input class="combobox" list="combobox_1" data-xp="type: 'combobox'"/>
<select id="combobox_1">...</select>
```

<div><a href="#controls.options">Группа переключателей</a></div>
```html
<div class="options" data-xp="type: 'options'">
	<input type="radio"/>
	<input type="radio"/>
</div>

<div class="options" data-xp="type: 'options'">
	<input type="checkbox"/>
</div>
```

<div><a href="#controls.selectus">Выпадающий список из переключателей</a></div>
```html
<div class="selectus" data-xp="type: 'selectus'">
	<input type="radio" id="r1"/>
	<label for="r1">Item 1</label>
	<input type="radio" id="r2"/>
	<label for="r2">Item 2</label>
</div>

<div class="selectus" data-xp="type: 'selectus'">
	<input type="checkbox" id="r1"/>
	<label for="r1">Item 1</label>
	<input type="checkbox" id="r2"/>
	<label for="r2">Item 2</label>
</div>
```


### [Зависимости](#dependencies)

*Для получения значений контролов в выражениях используются CSS-селекторы по атрибутам (например, `[name=some]`) и `[this]` для данного контрола.*

<div><a href="#dependencies.classed">Управление атрибутом класса</a></div>
```html
<input data-xp="classed: {on: 'логическое выражение', do: 'имя класса'}"/>
```

<div><a href="#dependencies.computed">Вычисляемое значение</a></div>
```html
<input data-xp="computed: 'выражение'"/>
<input data-xp="computed: {on: 'выражение', do: 'имя параметра'}"/>
```

<div><a href="#dependencies.enabled">Доступность</a></div>
```html
<input data-xp="enabled: 'логическое выражение'"/>
```

<div><a href="#dependencies.enabled_on_completed">Доступность при полном заполнении</a></div>
```html
<input data-xp="enabled_on_completed: true"/>
```

<div><a href="#dependencies.required">Обязательность заполнения</a></div>
```html
<input data-xp="required: true"/>
<input data-xp="required: 'логическое выражение'"/>
```

<div><a href="#dependencies.valid">Соответствие выражению</a></div>
```html
<input data-xp="valid: 'логическое выражение'"/>
```


### [Повторения](#repeats)

```html
<div data-xp="
	name: 'имя',
	repeat: {
		id: 'идентификатор',
		min: 1,
		max: 10,
		reset: true,
		template: true
	}
">
	...
	<button class="repeat_append_button">+</button>
	<button class="repeat_remove_button">&minus;</button>
</div>
```

* * *

## <a href="#init" name="init">Инициализация</a>

Возвращает [список](#list) expromptum контролов.

`expromptum()`
- Проинициализируются все элементы с атрибутом `data-xp` или подходящие под CSS-селекторы по умолчанию, заданные в контролах.

`expromptum(selector[, expromptum object | jQuery object])`
- Проинициализируются все элементы подходящие под CSS-селектор в первом параметре. Если передан и второй параметр, то селектор будет применен в контексте его элемента.

`expromptum(element | elements array | jQuery object)`
- Проинициализируются элементы переданные в качестве параметра.

* * *

## <a href="#list" name="list">Список объектов</a>

Возвращает массив объектов с дополнительными методами, позволяющими добавлять в него только уникальные экземпляры объектов.

`new expromptum.list(array)`

#### Методы

`.append(object)`
- Проверяет нет ли переданного объекта в массиве и если нет, добавляет его в конец. Возвращает список объектов.

`.remove(object)`
- Ищет переданный объект в массиве и если находит, удаляет его оттуда. Возвращает список объектов.

`.each(function())`
- Выполняет переданную функцию для каждого объекта в списке. Если функция вернет значение `false`, то перебор объектов завершится. Возвращает список объектов.

`.first([function()])`
- Возвращает первый объект в списке или значение `null`, если список пустой. Может выполнить переданную функцию для первого объекта.

`.last([function()])`
- Возвращает последний объект в списке или значение `null`, если список пустой. Может выполнить переданную функцию для последнего объекта.

`.eq(index[, function()])`
- Возвращает объект с переданным индексом в списке или значение `null`, если такового нет. Может выполнить переданную функцию для найденного объекта.

* * *

## <a href="#" name="base">Абстрактный класс</a>

Используется в качестве базового класса для всех остальных.

Класс `expromptum.base`

#### Методы

`.init(params)`
- Конструктор объекта.

`.destroy([function()[, remove]])`
- Деструктор объекта. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. При вызове метода без параметров — выполняет функции в списке. Возвращает объект.

`.change([function()[, remove]])`
- Обработчик изменения значения объекта. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. При вызове метода без параметров — выполняет функции в списке. Возвращает объект.

`.param(name[, value])`
- Чтение и запись свойств объекта. Возвращает значение указанного свойства.

* * *

## <a href="#controls" name="controls">Контролы</a>

При инициализации контрола тип определяется по значению параметра `type` в атрибуте `data-xp` или по селектору типа.

###### Пример 1

```html
<input name="age" data-xp='{"type": "number"}'/>
```

###### Пример 2

```html
<input name="age" class="number"/>
```

### <a href="#controls.new" name="controls.new">Создание нового контрола</a>

###### Пример 1

Поле с проверкой на соответствие выражению.

```js
xP.controls.register({name: 'zip', base: '_field', prototype: {
	element_selector: '.zip input, input.zip',
	valid: /^\d{6}$/,
	allow_chars_pattern: /^\d+$/
}});
```

###### Пример 2

Слайдер для числового значения с использованием виджета [Slider](http://jqueryui.com/slider/).

```js
xP.controls.register({name: 'slider_number', base: 'number', prototype: {
	element_selector: '.slider input',

	init: function(params){
		xP.controls.slider_number.base.init.apply(this, arguments);

		var that = this;

		var slider = this._param(
			'slider',
			$('<div class="slider_control"/>')
				.appendTo(this.$element.parent())
				.slider({
					min: params.min,
					max: params.max,
					value: this.val(),
					slide: function(event, ui){
						that.val(ui.value);
					}
				})
			);

		this.change(function(){
			slider.slider('value', this.val());
		});
	},

	destroy: function(handler, remove){
		if(!arguments.length){
			this._param('slider').destroy();
		}

		return xP.controls.slider_number.base.destroy.apply(
				this, arguments
			);
	},

	param: function(name, value){
		switch(name){
			case 'min':
			case 'max':
			case 'step':
				this._param('slider').slider('option', name, value);

				break;
		};

		return xP.controls.slider_number.base.param.apply(
				this, arguments
			);
	},

	disable: function(disabled){
		disabled = !arguments.length || disabled;

		if(this.disabled !== disabled){
			this._param('slider').slider(
				disabled ? 'disable' : 'enable'
			);
		}

		return xP.controls.slider_number.base.disable.apply(
				this, arguments
			);
	}
}});
```

###### Пример 3

Слайдер для набора значений с использованием виджета [Slider](http://jqueryui.com/slider/).

```js
xP.controls.register({name: 'slider_select', base: 'select', prototype: {
	element_selector: '.slider select',

	init: function(params){
		xP.controls.slider_select.base.init.apply(this, arguments);

		var that = this;

		var slider = this._param(
			'slider',
			$('<div class="slider_control"/>')
				.insertAfter(this.$element)
				.slider({
					min: 0,
					max: this.$element[0].options.length - 1,
					value: this.$element[0].selectedIndex,
					slide: function(event, ui){
						that.$element[0].selectedIndex = ui.value;
					}
				})
			);

		this.change(function(){
			slider.slider('value', this.$element[0].selectedIndex);
		});
	},

	destroy: function(handler, remove){
		if(!arguments.length){
			this._param('slider').destroy();
		}

		return xP.controls.slider_select.base.destroy.apply(
				this, arguments
			);
	},

	param: function(name, value){
		switch(name){
			case 'min':
			case 'max':
			case 'step':
				this._param('slider').slider('option', name, value);

				break;
		};

		return xP.controls.slider_select.base.param.apply(
				this, arguments
			);
	},

	disable: function(disabled){
		disabled = !arguments.length || disabled;

		if(this.disabled !== disabled){
			this._param('slider').slider(
				disabled ? 'disable' : 'enable'
			);
		}

		return xP.controls.slider_select.base.disable.apply(
				this, arguments
			);
	}
}});
```

###### Пример 4

Поле с редактированием через [Реформатор](http://www.artlebedev.ru/tools/reformator/).

```js
xP.controls.register({name: 'wysiwyg', base: 'string', prototype: {
	element_selector: '.wysiwyg textarea',

	init: function(params){
		xP.controls.wysiwyg.base.init.apply(this, arguments);
		this._param('reformator', reformator.append(this.$element[0], {bar: true}));
	},

	destroy: function(handler, remove){
		if(!arguments.length){
			this._param('reformator').destroy();
		}

		return xP.controls.wysiwyg.base.destroy.apply(this, arguments);
	}
}});
```

###### Пример 5

Поля для ввода даты с использованием виджета [Datepicker](http://jqueryui.com/datepicker/).

```js
xP.controls.register({name: 'date_picker', base: '_secret', prototype: {
	element_selector: 'input.date.picker, .date.picker input',

	init: function(params){
		this.locale = xP.locale;

		xP.controls.date_picker.base.init.apply(this, arguments);

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
		return xP.controls.date_picker.base.destroy.apply(this, arguments);
	},

	param: function(name, value){
		switch(name){
			case 'min':
				this.$element.datepicker('option', 'minDate', value);
				return value;
				break;

			default:
				return xP.controls.datepicker.base.param.apply(this, arguments);
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


xP.controls.register({name: 'datetime_picker', base: 'date_picker', prototype: {
	element_selector: 'input.datetime.picker, .datetime.picker input',

	init: function(params){
		var value = params.$element.val();

		xP.controls.datetime_picker.base.init.apply(this, arguments);

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

		this._.time_control = new xP.list();

		this._.$time.filter('input').each(function(){
			that._.time_control.append(
				(new xP.controls.number({
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

		return xP.controls.datetime_picker.base.destroy.apply(this, arguments);
	},

	disable: function(disabled){
		disabled = !arguments.length || disabled;

		if(this.disabled !== disabled){
			xP.controls.datetime_picker.base.disable.apply(this, arguments);

			this._.time_control.each(function(){this.disable(disabled);});
		}

		return this;
	}
}});
```


* * *

### <a href="#controls._item" name="controls._item">Абстрактный контрол</a>

- Тип `_item`
- Базовый тип [`xP.base`](#base)

Используется в качестве базового класса для классов контролов.

#### Свойства

`.$element`
- jQuery-объект, указывающий на основной элемент контрола.

`.$container`
- jQuery-объект, указывающий на элемент, найденный по CSS-селектору из свойства `container_selector` или на основной элемент.

`.disabled`
- Логическое значение `true` или `false`, в зависимости от доступности контрола.

`.container_selector`
- CSS-селектор по которому находится элемент контейнер.

`.container_disabled_class = 'disabled'`
- Имя CSS-класса, назначаемое элементу контейнеру в зависимости от доступности контрола.

`.autofocus`
- Логическое значение `true` или `false`, по которому определяется необходимость перехода фокуса на данный контрол при инициализации.

#### Методы

`.remove()`
- Удаляет контрол, в том числе, и все его элементы из DOM-дерева.

`.parent()`
- Возвращает родительский контрол.

`.root()`
- Возвращает корневой контрол.

`.val([value])`
- Чтение и запись значения контрола.

`.disable([disabled])`
- Определяет доступность контрола. Возвращает данный контрол.

* * *

### <a href="#controls.html" name="controls.html">HTML</a>

- Тип `html`
- Базовый тип [`_item`](#controls._item)
- Селектор элемента `.xp_html`

Используется для вывода в HTML значений других контролов через зависимость [`computed`](#dependencies.computed).

###### Пример

```html
<input name="number_1" data-xp="type: 'number'"/>

<select name="operator">
	<option>+</option>
	<option>-</option>
	<option>*</option>
	<option>/</option>
</select>

<input name="number_2" data-xp="type: 'number'"/>

=

<span data-xp="type: 'html', computed: 'eval([name=number_1] * 1 + [name=operator] + [name=number_2] * 1)'"></span>
```

* * *

### <a href="#controls._parent" name="controls._parent">Абстрактный родитель</a>

- Тип `_parent`
- Базовый тип [`_item`](#controls._item)
- Селектор элемента `.xp`

Используется в качестве базового класса для всех контролов, которые могут выступать родителем для других.

#### Методы

`.children()`
- Возвращает список контролов, находящихся внутри данного.

`.val([object | objects array])`
- Позволяет принимать в качестве значения объект или массив объектов. Значения свойств объекта будут устанавливаться в качестве значений для одноименных контролов, находящихся внутри данного.

`.focus()`
- Устанавливает фокус. Возвращает данный контрол.

* * *

### <a href="#controls.form" name="controls.form">Форма</a>

- Тип `form`
- Базовый тип [`_parent`](#controls._parent)
- Селектор элемента `form`

#### Свойства

`.completed_on_required = true`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при незаполненных обязательных контролах.

`.completed_on_valid_required = true`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных обязательных контролах.

`.completed_on_valid = false`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных контролах.

`.completed_on_changed = false`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки если не менялось значение хотя бы одного из контролов.

`.locked = false`
- Логическое значение `true` или `false`, по которому определяется возможность отправки формы. Можно использовать для калькуляторов или форм работающих через ajax.

#### Методы

`.submit([function()[, remove]])`
- Обработчик события отправки формы.
	1. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. Возвращает контрол.
	2. При вызове метода без параметров — выполняет функции в списке. Возвращает логическое значение `true` или `false`.

`.uncompleted()`
- Проверяет готовность формы. Если готова, возвращает `null`. Иначе — строку в которой указана причина (`required`, `invalid_required`, `invalid`, `unchanged`).
Получить [список](#list) конфликтных контролов, можно через метод `._param('зависимость')`.

###### Пример

```html
<form method="post">
	<div class="field">
		<label for="field_name">Name</label>
		<input name="name" id="field_name" data-xp="required: true"/>
	</div>

	<div class="field">
		<label for="field_email">Email</label>
		<input name="email" id="field_email" data-xp="type: 'email', required: true"/>
	</div>

	<div class="field">
		<label for="field_message">Message</label>
		<textarea name="message" id="field_message" data-xp="required: true"></textarea>
	</div>

	<div class="field">
		<input type="submit" value="Send" data-xp="enabled_on_completed: true"/>
	</div>

	<div id="uncompleted"></div>
</form>

<script>
	(function(){
		expromptum();

		var uncompleted = $('#uncompleted');

		expromptum('form').first().change(function(){
			var html = '';

			this._param('required')
				.append(this._param('invalid'))
				.each(function(){
					html += (html ? ', ': '') + this.$label.text();
				});

			uncompleted.html((html ? 'Fill fields: ' : '') + html);
		});
	})();
</script>
```


* * *

### <a href="#controls.fields" name="controls.fields">Группа полей, листы</a>

- Тип `fields`
- Базовый тип [`_parent`](#controls._parent)
- Селектор элемента `fieldset, .fields, .sheets`

#### Свойства

`.name`
- Имя группы полей. Необходимо для получения и присвоения значений при использовании повторений у данного контрола.

`.$label`
- jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

#### Методы

`.count()`
- Возвращает количество находящихся внутри данного контролов с непустыми значениями.

* * *

### <a href="#controls.sheet" name="controls.sheet">Лист</a>

- Тип `sheet`
- Базовый тип [`fields`](#controls.fields)
- Селектор элемента `.sheet`

#### Свойства

`.$label`
- jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

`.selected_class = 'selected'`
- Имя CSS-класса, назначаемое элементам отмеченного контрола (контейнеру и подписи).

`.unselected_class = 'unselected'`
- Имя CSS-класса, назначаемое элементам не отмеченных контролов (контейнерам и подписям).

#### Методы

`.select([select])`
- Отмечает контрол. Возвращает данный контрол.

`.show([complete])`
- Отмечает контрол и выполняет после этого переданную функцию. Возвращает данный контрол.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#sheet)

* * *

### <a href="#controls.foldable" name="controls.foldable">Сворачиваемая панель</a>

- Тип `foldable`
- Базовый тип [`fields`](#controls.fields)
- Селектор элемента `.foldable`

#### Свойства

`.duration = 200`
- Продолжительность сворачивания (разворачивания) контрола в миллисекундах.

`.folded_class = 'folded'`
- Имя CSS-класса, назначаемое элементам свернутого контрола (контейнеру и подписи).

`.unfolded_class = 'unfolded'`
- Имя CSS-класса, назначаемое элементам не свернутого контрола (контейнеру и подписи).

#### Методы

`.fold([fold, complete])`
- Сворачивает или разворачивает (в случае `fold = false`) контрол и выполняет после этого функцию переданную в параметре `complete`. Возвращает данный контрол.

`.show([complete])`
- Отмечает контрол и выполняет после этого переданную функцию. Возвращает данный контрол.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#foldable)

* * *

### <a href="#controls.field" name="controls.field">Абстрактное поле</a>

- Тип `_field`
- Базовый тип [`_parent`](#controls._parent)
- Селектор элемента `input`
Селектор контейнера `.field`

#### Свойства

`.$label`
- jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

`.allow_chars_pattern`
- RegExp, содержащий разрешенные для ввода с клавиатуры символы.

`.container_blured_class = 'blured'`
- Имя CSS-класса, назначаемое элементу контейнера после того, как произойдет событие `blur` у основного элемента данного контрола.

#### Методы

`.val([value])`
- Чтение и запись значения контрола.

* * *

### <a href="#controls.string" name="controls.string">Строковое поле</a>

- Тип `string`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `input[type=text], input:not([type])`

* * *

### <a href="#controls.text" name="controls.text">Текстовое поле</a>

- Тип `text`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `textarea`

* * *

### <a href="#controls.hidden" name="controls.hidden">Скрытое поле</a>

- Тип `hidden`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `input[type=hidden]`

* * *

### <a href="#controls.file" name="controls.file">Файловое поле</a>

- Тип `file`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `input[type=file]`

* * *

### <a href="#controls.button" name="controls.button">Кнопка</a>

- Тип `button`
- Базовый тип [`_parent`](#controls._parent)
- Селектор элемента `input[type=button], button, .button`

#### Методы

`.click([function()[, remove]])`
- Обработчик нажатия кнопки. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. При вызове метода без параметров — выполняет функции в списке. Возвращает контрол.

* * *

### <a href="#controls.submit" name="controls.submit">Кнопка отправки</a>

- Тип `submit`
- Базовый тип [`_item`](#controls._item)
- Селектор элемента `input[type=submit], button[type=submit]`

* * *

### <a href="#controls.select" name="controls.select">Выпадающий список</a>

- Тип `select`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `select`

#### Свойства

`.hide_disabled_option = true`
- Определяет видимость недоступных элементов. При значении `false` нужный результат будет только в тех браузерах, которые это поддерживают.

`enable_by = 'value'`
- Определяет по какому свойству option определять доступность.

#### Методы

`.disable([disabled[, values]])`
- Определяет доступность контрола. Второй параметр может содержать одно или массив значений к которым нужно применить первый параметр. Возвращает данный контрол.

`.append(values)`
- Добавляет пункты выбора. Параметр может содержать одно или массив значений. Каждое из значений может быть: строкой, массивом (вида: `[значение для подписи, значение для value]`) или объектом (вида: `{value: значение для value, label: значение для подписи}`). Возвращает данный контрол.

`.remove()`
- Удаляет все пункты выбора. Возвращает данный контрол.

`.text()`
- Возращает текстовое значение выбранного option.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#select)

* * *

### <a href="#controls.options" name="controls.options">Группа переключателей</a>

- Тип `options`
- Базовый тип [`fields`](#controls.fields)
- Селектор элемента `.options`

Группирующий контрол, применяемый для назначения зависимостей на группу переключателей или включателей.

* * *

### <a href="#controls.selectus" name="controls.selectus">Выпадающий список из переключателей</a>

- Тип `selectus`
- Базовый тип [`options`](#controls.options)
- Селектор элемента `.selectus`

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#selectus)

* * *

### <a href="#controls._option" name="controls._option">Абстрактный переключатель</a>

- Тип `_option`
- Базовый тип [`_field`](#controls._field)
Селектор контейнера `.option`

Используется в качестве базового класса для контролов переключателей и включателей.

#### Свойства

`.container_selector = '.option'`
- CSS-селектор по которому находится элемент контейнер.

`.selected = null`
- Логическое значение `true` или `false`, по которому определяется отмечен данный контрол или нет.

`.container_initial_selected_class = 'initial_selected'`
- Имя CSS-класса, назначаемое элементу контейнеру если данный контрол был отмечен на момент инициализации.

`.container_selected_class = 'selected'`
- Имя CSS-класса, назначаемое элементу контейнеру если данный контрол отмечен.


#### Методы

`.select([selected])`
- Определяет отмечен контрол или нет.

`.append(values)`
- Добавляет пункты выбора. Параметр может содержать одно или массив значений. Каждое из значений может быть: строкой, массивом (вида: `[значение для value, значение для подписи]`) или объектом (вида: `{value: значение для value, label: значение для подписи}`). Возвращает список добавленных контролов.

* * *

### <a href="#controls.radio" name="controls.radio">Переключатель</a>

- Тип `radio`
- Базовый тип [`_option`](#controls._option)
- Селектор элемента `input[type=radio]`

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#radio)

* * *

### <a href="#controls.checkbox" name="controls.checkbox">Включатель</a>

- Тип `checkbox`
- Базовый тип [`_option`](#controls._option)
- Селектор элемента `input[type=checkbox]`

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#radio)

* * *

### <a href="#controls.email" name="controls.email">Поле для эл. почты</a>

- Тип `email`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `.email input, input.email`

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#email)

* * *

### <a href="#controls.phone" name="controls.phone">Поле для телефона</a>

- Тип `phone`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `.phone input, input.phone`

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#phone)

* * *

### <a href="#controls._secret" name="controls._secret">Абстрактное поле со скрытым полем</a>

- Тип `_secret`
- Базовый тип [`_field`](#controls._field)

Используется в качестве базового класса для всех контролов, внешний вид которых требует создания альтернативных элементов для ввода данных.

#### Свойства

`.$secret`
- jQuery-объект, указывающий на на основной элемент контрола, который трансформирован в скрытый.

* * *

### <a href="#controls.password" name="controls.password">Поле для пароля</a>

- Тип `password`
- Базовый тип [`_secret`](#controls._field-со-скрытым-полем)
- Селектор элемента `input[type=password]`

Позволяет управлять видимостью введенных символов в поле для ввода пароля.

#### Свойства

`.container_view_class = 'alt'`
- Имя CSS-класса, назначаемое элементу контейнеру после нажатия на дополнительно созданный элемент управления.

`.control_button_view_class = 'control_button_password_view'`
- Имя CSS-класса, назначаемое элементу управления после нажатия на него.

`.control_button_view_html = '<span class="control_button control_button_password"/>'`
- HTML-код для создания элемента управления видом контрола.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#password)

* * *

### <a href="#controls.number" name="controls.number">Поле для числа</a>

- Тип `number`
- Базовый тип [`_secret`](#controls._field-со-скрытым-полем)
- Селектор элемента `input.number, .number input`

Позволяет вводить только числа и управлять значением с помощью стрелок на клавиатуре или созданных дополнительно элементов управления.

#### Свойства

`.step = 1`
- Шаг, на который будет меняться значение контрола.

`.min = 1 - Number.MAX_VALUE`
- Минимальное значение контрола.

`.def = 0`
- Значение по умолчанию, используемое в методах `inc` и `dec` при пустом `value`.

`.max = Number.MAX_VALUE - 1`
- Максимальное значение контрола.

`.element_wrap_html = '<span class="number_control"/>'`
- HTML-код обертки для созданного дополнительно элемента, через который будет осуществляться ввод данных пользователем.

`.control_button_dec_html = '<span class="control_button control_button_dec"/>'`
- HTML-код кнопки увеличения значения контрола.

`.control_button_inc_html = '<span class="control_button control_button_inc"/>'`
- HTML-код кнопки уменьшения значения контрола.

#### Методы

`.inc()`
- Увеличивает значения контрола. Возвращает данный контрол.

`.dec()`
- Уменьшает значения контрола. Возвращает данный контрол.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#number)

* * *

### <a href="#controls.datemonth" name="controls.datemonth">Поле для года и месяца</a>

- Тип `datemonth`
- Базовый тип [`_field`](#controls._field)
- Селектор элемента `input.datemonth, .datemonth input`

#### Методы

`.date([date])`
- Чтение и запись даты в качестве значения контрола.


###### Пример

```html
<input name="datemonth" value="2013-04" class="datemonth"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#datemonth)

* * *

### <a href="#controls.date" name="controls.date">Поле для даты</a>

- Тип `date`
- Базовый тип [`datemonth`](#controls.datemonth)
- Селектор элемента `input.date, .date input`

###### Пример

```html
<span class="date field">
	<input id="date_from" name="date_from" value="2010-02-20"/>
</span>

<span class="date field">
	<input id="date_to" name="date_to" data-xp="
		valid: '[name=date_from] < [this]'
	"/>
</span>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#date)

* * *

### <a href="#controls.datetime" name="controls.datetime">Поле для даты и времени</a>

- Тип `datetime`
- Базовый тип [`date`](#controls.date)
- Селектор элемента `input.datetime, .datetime input`

###### Пример

```html
<input name="datetime" value="2013-04-01 12:00" class="datetime"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#datetime)

* * *

### <a href="#controls.combobox" name="controls.combobox">Комбобокс</a>

- Тип `combobox`
- Базовый тип [`string`](#controls.string)
- Селектор элемента `.combobox input, input.combobox, input[list]`

Ввод данных с возможность выбора значений из выпадающего списка.

#### Свойства

`.search_from_start = true`
- Логическое значение true или false, по которому определяется каким образом фильтровать данные в списке — при совпадении с началом строки или в любом ее фрагменте.

`.case_sensitive = false`
- Логическое значение true или false, по которому определяется каким образом фильтровать данные в списке — с учетом регистра или без.

`.[list](#controls._combolist)`
- Контрол, указывающий на список значений.

[Демо](http://www.artlebedev.ru/tools/expromptum/controls/#combobox)

* * *

### <a href="#controls._combolist" name="controls._combolist">Список для комбобокса</a>

- Тип `_combolist`
- Базовый тип [`select`](#controls.select)

Вспомогательный контрол для комбобокса.

#### Методы

`.show()`
- Показывает список. Возвращает данный контрол.

`.hide()`
- Скрывает список. Возвращает данный контрол.

* * *

## <a href="#dependencies" name="dependencies">Зависимости</a>


### <a href="#dependencies._item" name="dependencies._item">Абстрактная зависимость</a>

- Тип `_item`
- Базовый тип [`expromptum.base`](#base)

Используется в качестве базового класса для всех зависисмостей.

#### Свойства

`.to='[this]'`
- Свойство, указывающее на контрол к которому применяется зависисмость.

* * *

### <a href="#dependencies.classed" name="dependencies.classed">Управление атрибутом класса</a>

- Тип `classed`
- Базовый тип [`_item`](#dependencies._item)

#### Свойства

`.on`
- Логическое выражение, в случае выполнения которого, элементу контейнеру контрола указанного в свойстве `to`, будет назначено имя CSS-класса из свойства `do`.

`.do`
- Имя CSS-класса.

###### Пример 1

```html
<input name="some"/>

<input name="thing" data-xp="classed: {on: '[name=some]', do: 'some'}"/>
```

###### Пример 2

```html
<input name="some"/>

<input name="thing" data-xp="classed: [{on: '[name=some]', do: 'some'}, {on: '[name=some] == \'\'', do: 'no'}]"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#classed)

* * *

### <a href="#dependencies.computed" name="dependencies.computed">Вычисляемое значение</a>

- Тип `computed`
- Базовый тип [`_item`](#dependencies._item)

#### Свойства

`.on`
- Выражение, результат которого будет присвоен в качестве значения (через метод `.val(значение)`) контролу, указанному в свойстве `to`.

`.do`
- Имя свойства. Если указано значение, то результат выражения будет присвоен свойству (через метод `.param(свойство, значение)`) контрола, указанного в свойстве `to`. 

###### Пример 1

```html
<input name="number_1" data-xp="type: 'number'"/>

<select name="operator">
	<option>+</option>
	<option>-</option>
	<option>*</option>
	<option>/</option>
</select>

<input name="number_2" data-xp="type: 'number'"/>

=

<input name="number_3" data-xp="type: 'number', computed: 'eval([name=number_1] * 1 + [name=operator] + [name=number_2] * 1)'" readonly="true"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#computed)

* * *

### <a href="#dependencies.enabled" name="dependencies.enabled">Доступность</a>

- Тип `enabled`
- Базовый тип [`_item`](#dependencies._item)

#### Свойства

`.on`
- Логическое выражение, в случае **не**выполнения которого, контрол, указанный в свойстве `to`, будет недоступен для работы (`disabled`).

###### Пример

```html
<input name="a"/>

<input name="b" data-xp="enabled: '[name=a]'"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#enabled)

* * *

### <a href="#dependencies.enabled_on_completed" name="dependencies.enabled_on_completed">Доступность при полном заполнении</a>

- Тип `enabled_on_completed`
- Базовый тип [`_item`](#dependencies._item)

В зависимости от выполнения условий на обязательность и правильность заполнения формы, делает контрол доступным или недоступным для работы (`disabled`).

###### Пример

```html
<form>
	<textarea name="message" data-xp="required: true"></textarea>

	<input type="submit" data-xp="enabled_on_completed: true"/>
</form>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#enabled_on_completed)

* * *

### <a href="#dependencies._rooted" name="dependencies._rooted">Абстрактная зависимость на полное заполнение</a>

- Тип `_rooted`
- Базовый тип [`_item`](#dependencies._item)

Используется в качестве базового класса для остальных зависисмостей, которые могут быть задействованы в условиях полного заполнения формы.

* * *

### <a href="#dependencies.required" name="dependencies.required">Обязательность заполнения</a>

- Тип `required`
- Базовый тип [`_rooted`](#dependencies._rooted)

#### Свойства

`.on`
- Логическое значение true. Или логическое выражение, в случае выполнения которого, контрол указанный в свойстве `to`, становится обязательным для заполнения.

`.container_required_class = 'required'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если он не заполнен.

`.container_unrequired_class = 'unrequired'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если он заполнен.

###### Пример 1

```html
<input name="name" data-xp="required: true"/>
```

###### Пример 2

```html
<input name="a"/>

<input name="b" data-xp="required: '[name=a]'"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#required)

* * *

### <a href="#dependencies.valid" name="dependencies.valid">Соответствие выражению</a>

- Тип `valid`
- Базовый тип [`_rooted`](#dependencies._rooted)

#### Свойства

`.on`
- Логическое выражение, от результата работы которого зависит считается ли данный контрол правильно заполненным.

`.container_valid_class = 'valid'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `true`.

`.container_invalid_class = 'invalid'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `false`.

###### Пример

```html
<input name="zip" data-xp="valid: /^\d{6}$/'"/>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/dependencies/#valid)

* * *

### <a href="#dependencies.changed" name="dependencies.changed">Изменение</a>

- Тип `changed`
- Базовый тип [`_rooted`](#dependencies._rooted)

Данная зависимость назначается всем контролам при инициализации.

#### Свойства

`.container_changed_class = 'changed'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если его значение было изменено.

* * *

## <a href="#repeats" name="repeats">Повторения</a>

#### Свойства

`.max = 300`
- Максимальное число повторений, по достижении которого, перестает быть доступным контрол добавления.

`.min = 1`
- Минимальное число повторений, по достижении которого, перестает быть доступным контрол удаления.

`.reset`
- Логическое значение true сбрасывает значения добавляемых контролов. Для каждого из контролов можно задавать свое соответствующее значение в свойстве `reset_on_repeat`.

`.template`
- Логическое значение true определяет данный контрол в качестве шаблона для добавляемых контролов.

###### Пример 1
```html
<span class="field">
	<input name="a[0]" data-xp="repeat: true"/>

	<button class="repeat_append_button">+</button>

	<button class="repeat_remove_button">&minus;</button>
</span>
```

[Демо](http://www.artlebedev.ru/tools/expromptum/repeats/)

* * *

## <a href="#common" name="common">Концепция работы с библиотекой</a>

Все значения свойств у основных объектов библиотеки (контролов, зависимостей и повторений) устанавливаются через параметры при инициализации или через вызов метода `.param('имя', значение)`. Получение значений возможно и через прямое обращение к свойству.

Большинство методов основных объектов библиотеки возвращают сам объект.

Методы и свойства названия которых начинаются с символа подчеркивания, предназначены только для использования внутри библиотеки. Если же есть необходимости обратится к таким свойствам, это следует делать через вызов метода `._param('имя', значение)`.

Названия свойств, значениями которых являются jQuery-объекты, начинаются с символа доллара.

* * *

## <a href="#debug" name="debug">Режим диагностики</a>

Для диагностики работы в адресной строке можно передать параметр `xP=значение`. При этом в консоль браузера будут выводится все обнаруженные ошибки и соответствующие значению сообщения:
`controls` — инициализация контролов;
`submit` — отправка формы;
`dependencies` — инициализация и обработка всех зависимостей;
`classed`, `enabled`, `enabled_on_completed`, `required`, `valid`, `changed` — обработка зависимостей данного типа;
`repeats` — инициализация повторений.

* * *
