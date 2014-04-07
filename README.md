# Expromptum <img src="expromptum.png"/>

- [Коротко](#Коротко)
- [Инициализация](#Инициализация)
- [Контролы](#Контролы-1)
- [Зависимости](#Зависимости-1)
- [Повторения](#Повторения-1)
- [Концепция](#Концепция-работы-с-библиотекой)
- [Режим диагностики](#Режим-диагностики)

Expromptum — библиотека JavaScript, предназначенная для расширения функциональности работы элементов в HTML.

Использует библиотеку [jQuery](http://jquery.com/) для работы с элементами.

Чтобы использовать библиотеку надо подключить ее к странице содержащей соответствующий HTML и выполнить [инициализацию](#Инициализация).


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

## Коротко


### [Контролы](#Контролы-1)

*Тип контрола определяется CSS-селектором или значением свойства `type` в атрибуте `data-xp`. Для остальных свойств контрола указаны противоположные или отличные от используемых по умолчанию значения.*


<div><a href="#Форма">Форма</a></div>
```html
<form data-xp="
	type: 'form',
	uncomplete_if_required: false,
	uncomplete_if_invalid_required: false,
	uncomplete_if_invalid: true,
	uncomplete_if_unchanged: true
"></form>
```

<div><a href="#Группа-полей-листы">Группа полей, листы</a></div>
```html
<div class="fields" data-xp="type: 'fields'"></div>
```

<div><a href="#Лист">Лист</a></div>
```html
<div class="sheets" data-xp="type: 'fields'">
	<strong for="sheet_1">Sheet 1</strong>

	<strong for="sheet_2">Sheet 2</strong>

	<div class="sheet" id="sheet_1" data-xp="type: 'sheet'"></div>

	<div class="sheet selected" id="sheet_2" data-xp="type: 'sheet'"></div>
</div>
```

<div><a href="#HTML">HTML</a></div>
```html
<span class="xp_html" data-xp="type: 'html', computed: '[name=some]' + '!'"></span>
```

*Без указания зависимости [computed](#Вычисляемое-значение), в этом контроле мало смысла.*

#### Кнопки

<div><a href="#Кнопка">Кнопка</a></div>
```html
<input type="button" value="Button" data-xp="type: 'button'"/>

<button data-xp="type: 'button'">Button<button>

<span class="button" data-xp="type: 'button'">Button<span>
```

<div><a href="#Кнопка-отправки">Кнопка отправки</a></div>
```html
<input type="submit" data-xp="type: 'submit'"/>
```


#### Поля для ввода

<div><a href="#Строковое-поле">Строковое поле</a></div>
```html
<input data-xp="type: 'string'"/>
```

<div><a href="#Текстовое-поле">Текстовое поле</a></div>
```html
<textarea data-xp="type: 'text'"></textarea>
```

<div><a href="#Скрытое-поле">Скрытое поле</a></div>
```html
<input type="hidden" data-xp="type: 'hidden'"/>
```

<div><a href="#Файловое-поле">Файловое поле</a></div>
```html
<input type="file" data-xp="type: 'file'"/>
```

<div><a href="#Поле-для-пароля">Поле для пароля</a></div>
```html
<input type="password" data-xp="type: 'password'"/>
```

<div><a href="#Поле-для-числа">Поле для числа</a></div>
```html
<input class="number" data-xp="
	type: 'number',
	min: 0,
	max: 10,
	step: 2,
	def: 0
"/>
```

<div><a href="#Поле-для-года-и-месяца">Поле для года и месяца</a></div>
```html
<input class="datemonth" data-xp="type: 'datemonth'"/>
```

<div><a href="#Поле-для-даты">Поле для даты</a></div>
```html
<input class="date" data-xp="type: 'date'"/>
```

<div><a href="#Поле-для-даты-и-времени">Поле для даты и времени</a></div>
```html
<input class="datetime" data-xp="type: 'datetime'"/>
```

<div><a href="#Поле-для-эл.-почты">Поле для эл. почты</a></div>
```html
<input class="email" data-xp="type: 'email'"/>
```

<div><a href="#Поле-для-телефона">Поле для телефона</a></div>
```html
<input class="phone" data-xp="type: 'phone'"/>
```


#### Выбор значений

<div><a href="#Выпадающий-список">Выпадающий список</a></div>
```html
<select data-xp="type: 'select', hide_disabled_option: false">...</select>
```

<div><a href="#Комбобокс">Комбобокс</a></div>
```html
<input class="combobox" list="combobox_1" data-xp="type: 'combobox'"/>
<select id="combobox_1">...</select>
```

<div><a href="#Группа-переключателей">Группа переключателей</a></div>
```html
<div class="options" data-xp="type: 'options'">
	<input type="radio" data-xp="type: 'radio'"/>
	<input type="radio" data-xp="type: 'radio'"/>
</div>

<div class="options" data-xp="type: 'options'">
	<input type="checkbox" data-xp="type: 'checkbox'"/>
</div>
```


### [Зависимости](#Зависимости-1)

*Для получения значений контролов в выражениях используются CSS-селекторы по атрибутам (например, `[name=some]`) и `[this]` для данного контрола.*

<div><a href="#Управление-атрибутом-класса">Управление атрибутом класса</a></div>
```html
<input data-xp="classed: {on: 'логическое выражение', do: 'имя класса'}"/>
```

<div><a href="#Вычисляемое-значение">Вычисляемое значение</a></div>
```html
<input data-xp="computed: 'выражение'"/>
<input data-xp="computed: {on: 'выражение', do: 'имя параметра'}"/>
```

<div><a href="#Доступность">Доступность</a></div>
```html
<input data-xp="enabled: 'логическое выражение'"/>
```

<div><a href="#Доступность-при-полном-заполнении">Доступность при полном заполнении</a></div>
```html
<input data-xp="enabled_on_completed: true"/>
```

<div><a href="#Обязательность-заполнения">Обязательность заполнения</a></div>
```html
<input data-xp="required: true"/>
<input data-xp="required: 'логическое выражение'"/>
```

<div><a href="#Соответствие-выражению">Соответствие выражению</a></div>
```html
<input data-xp="valid: 'логическое выражение'"/>
```


### [Повторения](#Повторения-1)

<div><a href="#Повторения-1">Повторения</a></div>
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

## Инициализация

Возвращает [список](#Список-объектов) expromptum контролов.

`expromptum()`
- Проинициализируются все элементы с атрибутом `data-xp` или подходящие под CSS-селекторы по умолчанию, заданные в контролах.

`expromptum(selector[, expromptum object | jQuery object])`
- Проинициализируются все элементы подходящие под CSS-селектор в первом параметре. Если передан и второй параметр, то селектор будет применен в контексте его элемента.

`expromptum(element | elements array | jQuery object)`
- Проинициализируются элементы переданные в качестве параметра.

* * *

## Список объектов

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

## Абстрактный класс

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

## Контролы

При инициализации контрола тип определяется по значению параметра `type` в атрибуте `data-xp` или по селектору типа.

###### Пример 1

```html
<input name="age" data-xp='{"type": "number"}'/>
```

###### Пример 2

```html
<input name="age" class="number"/>
```

### Создание нового контрола

###### Пример 1

Поле с проверкой на соответствие выражению.

```js
xP.controls.register({name: 'zip', base: '_field', prototype: {
	element_selector: '.zip input, input.zip',
	valid: '[this].val().match(/^\\d{6}$/)',
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
			case 'min':
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
			case 'min':
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

### Абстрактный контрол

- Тип `_item`
- Базовый тип [`xP.base`](#Абстрактный-класс)

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

### HTML

- Тип `html`
- Базовый тип [`_item`](#Абстрактный-контрол)
- Селектор элемента `.xp_html`

Используется для вывода в HTML значений других контролов через зависимость [`computed`](#Вычисляемое-значение).

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

### Абстрактный родитель

- Тип `_parent`
- Базовый тип [`_item`](#Абстрактный-контрол)
- Селектор элемента `.xp`

Используется в качестве базового класса для всех контролов, которые могут выступать родителем для других.

#### Методы

`.children()`
- Возвращает список контролов, находящихся внутри данного.

`.val([object | objects array])`
- Позволяет принимать в качестве значения объект или массив объектов. Значения свойств объекта будут устанавливаться в качестве значений для одноименных контролов, находящихся внутри данного.

* * *

### Форма

- Тип `form`
- Базовый тип [`_parent`](#Абстрактный-родитель)
- Селектор элемента `form`

#### Свойства

`.uncomplete_if_required = true`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при незаполненных обязательных контролах.

`.uncomplete_if_invalid_required = true`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных обязательных контролах.

`.uncomplete_if_invalid = false`
- Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных контролах.

`.uncomplete_if_unchanged = false`
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
Получить [список](#Список-объектов) конфликтных контролов, можно через метод `._param('зависимость')`.

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

### Группа полей, листы

- Тип `fields`
- Базовый тип [`_parent`](#Абстрактный-родитель)
- Селектор элемента `fieldset, .fields, .sheets`

#### Свойства

`.name`
- Имя группы полей. Необходимо для получения и присвоения значений при использовании повторений у данного контрола.

#### Методы

`.count()`
- Возвращает количество находящихся внутри данного контролов с непустыми значениями.

* * *

### Лист

- Тип `sheet`
- Базовый тип [`fields`](#Группа-полей-листы)
- Селектор элемента `.sheet`

#### Свойства

`.$label`
- jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

`.selected_class = 'selected'`
- Имя CSS-класса, назначаемое элементам отмеченного контрола (контейнеру и подписи).

`.unselected_class = 'unselected'`
- Имя CSS-класса, назначаемое элементам не отмеченных контролов (контейнерам и подписям).

#### Методы

`.select([selected])`
- Отмечает контрол. Возвращает данный контрол.

* * *

### Абстрактное поле

- Тип `_field`
- Базовый тип [`_parent`](#Абстрактный-родитель)
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

### Строковое поле

- Тип `string`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `input[type=text], input:not([type])`

* * *

### Текстовое поле

- Тип `text`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `textarea`

* * *

### Скрытое поле

- Тип `hidden`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `input[type=hidden]`

* * *

### Файловое поле

- Тип `file`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `input[type=file]`

* * *

### Кнопка

- Тип `button`
- Базовый тип [`_parent`](#Абстрактный-родитель)
- Селектор элемента `input[type=button], button, .button`

* * *

### Кнопка отправки

- Тип `submit`
- Базовый тип [`_item`](#Абстрактный-контрол)
- Селектор элемента `input[type=submit], button[type=submit]`

* * *

### Выпадающий список

- Тип `select`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `select`

#### Свойства

`.hide_disabled_option = true`
- Определяет видимость недоступных элементов. При значении `false` нужный результат будет только в тех браузерах, которые это поддерживают.

#### Методы

`.disable([disabled[, values]])`
- Определяет доступность контрола. Второй параметр может содержать одно или массив значений к которым нужно применить первый параметр. Возвращает данный контрол.

* * *

### Группа переключателей

- Тип `options`
- Базовый тип [`fields`](#Группа-полей-листы)
- Селектор элемента `.options`

Группирующий контрол, применяемый для назначения зависимостей на группу переключателей или включателей.

* * *

### Абстрактный переключатель

- Тип `_option`
- Базовый тип [`_field`](#Абстрактное-поле)
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

* * *

### Переключатель

- Тип `radio`
- Базовый тип [`_option`](#Абстрактный-переключатель)
- Селектор элемента `input[type=radio]`

* * *

### Включатель

- Тип `checkbox`
- Базовый тип [`_option`](#Абстрактный-переключатель)
- Селектор элемента `input[type=checkbox]`

* * *

### Поле для эл. почты

- Тип `email`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `.email input, input.email`

* * *

### Поле для телефона

- Тип `phone`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `.phone input, input.phone`

* * *

### Абстрактное поле со скрытым полем

- Тип `_secret`
- Базовый тип [`_field`](#Абстрактное-поле)

Используется в качестве базового класса для всех контролов, внешний вид которых требует создания альтернативных элементов для ввода данных.

#### Свойства

`.$secret`
- jQuery-объект, указывающий на на основной элемент контрола, который трансформирован в скрытый.

* * *

### Поле для пароля

- Тип `password`
- Базовый тип [`_secret`](#Абстрактное-поле-со-скрытым-полем)
- Селектор элемента `input[type=password]`

Позволяет управлять видимостью введенных символов в поле для ввода пароля.

#### Свойства

`.container_view_class = 'alt'`
- Имя CSS-класса, назначаемое элементу контейнеру после нажатия на дополнительно созданный элемент управления.

`.control_button_view_class = 'control_button_password_view'`
- Имя CSS-класса, назначаемое элементу управления после нажатия на него.

`.control_button_view_html = '<span class="control_button control_button_password"/>'`
- HTML-код для создания элемента управления видом контрола.

* * *

### Поле для числа

- Тип `number`
- Базовый тип [`_secret`](#Абстрактное-поле-со-скрытым-полем)
- Селектор элемента `input.number, .number input`

Позволяет вводить только числа и управлять значением с помощью стрелок на клавиатуре или созданных дополнительно элементов управления.

#### Свойства

`.step = 1`
- Шаг, на который будет меняться значение контрола.

`.min = 1 - Number.MAX_VALUE`
- Минимальное значение контрола.

`.def = 0`
- Значение по умолчанию.

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

* * *

### Поле для года и месяца

- Тип `datemonth`
- Базовый тип [`_field`](#Абстрактное-поле)
- Селектор элемента `input.datemonth, .datemonth input`

#### Методы

`.date([date])`
- Чтение и запись даты в качестве значения контрола.


###### Пример

```html
<input name="datemonth" value="2013-04" class="datemonth"/>
```

* * *

### Поле для даты

- Тип `date`
- Базовый тип [`datemonth`](#Поле-для-года-и-месяца)
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

* * *

### Поле для даты и времени

- Тип `datetime`
- Базовый тип [`date`](#Поле-для-даты)
- Селектор элемента `input.datetime, .datetime input`

###### Пример

```html
<input name="datetime" value="2013-04-01 12:00" class="datetime"/>
```

* * *

### Комбобокс

- Тип `combobox`
- Базовый тип [`string`](#Строковое-поле)
- Селектор элемента `.combobox input, input.combobox, input[list]`

Ввод данных с возможность выбора значений из выпадающего списка.

#### Свойства

`.search_from_start = true`
- Логическое значение true или false, по которому определяется каким образом фильтровать данные в списке — при совпадении с началом строки или в любом ее фрагменте.

`.[list](#Список-для-комбобокса)`
- Контрол, указывающий на список значений.

* * *

### Список для комбобокса

- Тип `_combolist`
- Базовый тип [`select`](#Выпадающий-список)

Вспомогательный контрол для комбобокса.

#### Методы

`.show()`
- Показывает список. Возвращает данный контрол.

`.hide()`
- Скрывает список. Возвращает данный контрол.

* * *

## Зависимости


### Абстрактная зависимость

- Тип `_item`
- Базовый тип [`expromptum.base`](#Абстрактный-класс)

Используется в качестве базового класса для всех зависисмостей.

#### Свойства

`.to='[this]'`
- Свойство, указывающее на контрол к которому применяется зависисмость.

* * *

### Управление атрибутом класса

- Тип `classed`
- Базовый тип [`_item`](#Абстрактная-зависимость)

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

* * *

### Вычисляемое значение

- Тип `computed`
- Базовый тип [`_item`](#Абстрактная-зависимость)

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

* * *

### Доступность

- Тип `enabled`
- Базовый тип [`_item`](#Абстрактная-зависимость)

#### Свойства

`.on`
- Логическое выражение, в случае **не**выполнения которого, контрол, указанный в свойстве `to`, будет недоступен для работы (`disabled`).

###### Пример

```html
<input name="a"/>

<input name="b" data-xp="enabled: '[name=a]'"/>
```

* * *

### Доступность при полном заполнении

- Тип `enabled_on_completed`
- Базовый тип [`_item`](#Абстрактная-зависимость)

В зависимости от выполнения условий на обязательность и правильность заполнения формы, делает контрол доступным или недоступным для работы (`disabled`).

###### Пример

```html
<form>
	<textarea name="message" data-xp="required: true"></textarea>

	<input type="submit" data-xp="enabled_on_completed: true"/>
</form>
```

* * *

### Абстрактная зависимость на полное заполнение

- Тип `_rooted`
- Базовый тип [`_item`](#Абстрактная-зависимость)

Используется в качестве базового класса для остальных зависисмостей, которые могут быть задействованы в условиях полного заполнения формы.

* * *

### Обязательность заполнения

- Тип `required`
- Базовый тип [`_rooted`](#Абстрактная-зависимость-на-полное-заполнение)

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

* * *

### Соответствие выражению

- Тип `valid`
- Базовый тип [`_rooted`](#Абстрактная-зависимость-на-полное-заполнение)

#### Свойства

`.on`
- Логическое выражение, от результата работы которого зависит считается ли данный контрол правильно заполненным.

`.container_valid_class = 'valid'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `true`.

`.container_invalid_class = 'invalid'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `false`.

###### Пример

```html
<input name="zip" data-xp="valid: '[this].val().match(/^\\d{6}$/)'"/>
```

* * *

### Изменение

- Тип `changed`
- Базовый тип [`_rooted`](#Абстрактная-зависимость-на-полное-заполнение)

Данная зависимость назначается всем контролам при инициализации.

#### Свойства

`.reset = false`
- Логическое значение true или false, по которому определяется сбрасывать значения новых контролов или нет.

`.container_changed_class = 'changed'`
- Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если его значение было изменено.

* * *

## Повторения

###### Пример 1
```html
<span class="field">
	<input name="a[0]" data-xp="repeat: true"/>

	<button class="repeat_append_button">+</button>

	<button class="repeat_remove_button">&minus;</button>
</span>
```

* * *

## Концепция работы с библиотекой

Все значения свойств у основных объектов библиотеки (контролов, зависимостей и повторений) устанавливаются через параметры при инициализации или через вызов метода `.param('имя', значение)`. Получение значений возможно и через прямое обращение к свойству.

Большинство методов основных объектов библиотеки возвращают сам объект.

Методы и свойства названия которых начинаются с символа подчеркивания, предназначены только для использования внутри библиотеки. Если же есть необходимости обратится к таким свойствам, это следует делать через вызов метода `._param('имя', значение)`.

Названия свойств, значениями которых являются jQuery-объекты, начинаются с символа доллара.

* * *

## Режим диагностики

Для диагностики работы в адресной строке можно передать параметр `xP=значение`. При этом в консоль браузера будут выводится все обнаруженные ошибки и соответствующие значению сообщения:
`controls` — инициализация контролов;
`submit` — отправка формы;
`dependencies` — инициализация и обработка всех зависимостей;
`classed`, `enabled`, `enabled_on_completed`, `required`, `valid`, `changed` — обработка зависимостей данного типа;
`repeats` — инициализация повторений.

* * *
