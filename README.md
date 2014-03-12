# Expromptum

- [Коротко][summary]
- [Инициализация][expromptum]
- [Контролы][controls]
- [Зависимости][dependencies]
- [Повторения][repeats]
- [Концепция][conception]
- [Режим диагностики][debug]

Expromptum — библиотека JavaScript, предназначенная для расширения функциональности работы элементов форм в HTML.

Использует библиотеку [jQuery](http://jquery.com/) для работы с элементами.

Чтобы использовать библиотеку надо подключить ее к странице содержащей соответствующий HTML и выполнить [инициализацию][expromptum].


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

## [id]:summary Коротко

### [Контролы][controls]

*Тип контрола определяется CSS-селектором или значением свойства `type` в атрибуте `data-xp` (выделены **полужирным начертанием**). Для остальных свойств контрола указаны противоположные или отличные от используемых по умолчанию значения.*

```html
<**form** data-xp="
	type: '**[form][controls.form]**',
	uncomplete_if_required: false,
	uncomplete_if_invalid_required: false,
	uncomplete_if_invalid: true,
	uncomplete_if_unchanged: true
"></form>
```

```html
<div class="**fields**" data-xp="
	type: '**[fields][controls.fields]**'
"></div>
```



```html
<div class="**sheets**" data-xp="
	**type: '[fields][controls.fields]'**
">
	<strong for="**sheet_1**">Sheet 1</strong>

	<strong for="**sheet_2**">Sheet 2</strong>

	<div class="**sheet**" id="**sheet_1**" data-xp="
		**type: '[sheet][controls.sheet]'**
	"></div>

	<div class="**sheet** selected" id="**sheet_2**" data-xp="
		**type: '[sheet][controls.sheet]'**
	"></div>
</div>
```

```html
<span class="**xp_html**" data-xp="
	type: '**[html][controls.html]**',
	**[computed][dependencies.computed]**: '[name=some]' + '!'
"></span>
```

*Без указания зависимости [computed][dependencies.computed], в этом контроле мало смысла.*

#### Кнопки

```html
<**input** type="**button**" value="Button" data-xp="
	type: '**[button][controls.button]**'
"/>

<**button** data-xp="
	type: '**[button][controls.button]**'
">Button<button>

<span class="**button**" data-xp="
	type: '**[button][controls.button]**'
">Button<span>
```

```html
<**input** type="**submit**" data-xp="
	type: '**[submit][controls.submit]**'
"/>
```


#### Поля для ввода

```html
<**input** data-xp="
	type: '**[string][controls.string]**'
"/>
```

```html
<**textarea** data-xp="
	type: '**[text][controls.text]**'
"></textarea>
```

```html
<**input** type="**hidden**" data-xp="
	type: '**[hidden][controls.hidden]**'
"/>
```

```html
<**input** type="**file**" data-xp="
	type: '**[file][controls.file]**'
"/>
```

```html
<**input** type="**password**" data-xp="
	type: '**[password][controls.password]**'
"/>
```

```html
<**input** class="**number**" data-xp="
	type: '**[number][controls.number]**',
	min: 0,
	max: 10,
	step: 2,
	def: 0
"/>
```

```html
<**input** class="**date**" data-xp="
	type: '**[date][controls.date]**'
"/>
```

```html
<**input** class="**datetime**" data-xp="
	type: '**[datetime][controls.datetime]**'
"/>
```

```html
<**input** class="**email**" data-xp="
	type: '**[email][controls.email]**'
"/>
```

```html
<**input** class="**phone**" data-xp="
	type: '**[phone][controls.phone]**'"
/>
```


#### Выбор значений

```html
<**select** data-xp="
    type: '**[select][controls.select]**',
    hide_disabled_option: false
">...</select>
```

```html
<**input** class="**combobox**" list="**combobox_1**" data-xp="
	type: '**[combobox][controls.combobox]**'
"/>
<select id="**combobox_1**">...</select>
```

```html
<div class="**options**" data-xp="
	type: '**[options][controls.options]**'
">
	<**input** type="**radio**" data-xp="type: '**[radio][controls.radio]**'"/>
	<**input** type="**radio**" data-xp="type: '**[radio][controls.radio]**'"/>
</div>

<div class="options" data-xp="type: '[options][controls.options]'">
	<**input** type="**checkbox**" data-xp="type: '**[checkbox][controls.checkbox]**'"/>
</div>
```


### [Зависимости][dependencies]

*Для получения значений контролов в выражениях используются CSS-селекторы по атрибутам (например, *`[name=some]`*) и *`[this]`* для данного контрола.*

```html
<input data-xp="[classed][dependencies.classed]: {**on: '*логическое выражение*'**, **do: '*имя класса*'**}"/>
```

```html
<input data-xp="[computed][dependencies.computed]: '*выражение*'"/>
<input data-xp="[computed][dependencies.computed]: {on: '*выражение*', do: '*имя параметра*'}"/>
```

```html
<input data-xp="[enabled][dependencies.enabled]: '*логическое выражение*'"/>
```

```html
<input data-xp="[enabled_on_completed][dependencies.enabled_on_completed]: true"/>
```

```html
<input data-xp="[required][dependencies.required]: true"/>
<input data-xp="[required][dependencies.required]: '*логическое выражение*'"/>
```

```html
<input data-xp="[valid][dependencies.valid]: '*логическое выражение*'"/>
```


### [Повторения][repeats]

```html
<div data-xp="
	**name: '*имя*'**,
	[repeat][repeats]: {
		**id: '*идентификатор*'**,
		min: 1,
		max: 10,
		template: true
	}
">
	...
	<button class="**repeat_append_button**">+</button>
	<button class="repeat_remove_button">&minus;</button>
</div>
```

* * *

## [id]:expromptum Инициализация

Возвращает [список][list] expromptum контролов.

`expromptum()`
Проинициализируются все элементы с атрибутом `data-xp` или подходящие под CSS-селекторы по умолчанию, заданные в контролах.

`expromptum(selector[, expromptum object | jQuery object])`
Проинициализируются все элементы подходящие под CSS-селектор в первом параметре. Если передан и второй параметр, то селектор будет применен в контексте его элемента.

`expromptum(element | elements array | jQuery object)`
Проинициализируются элементы переданные в качестве параметра.

* * *

## [id]:list Список объектов

Возвращает массив объектов с дополнительными методами, позволяющими добавлять в него только уникальные экземпляры объектов.

`new expromptum.list(array)`

#### Методы

`.append(object)`
Проверяет нет ли переданного объекта в массиве и если нет, добавляет его в конец. Возвращает список объектов.

`.remove(object)`
Ищет переданный объект в массиве и если находит, удаляет его оттуда. Возвращает список объектов.

`.each(function())`
Выполняет переданную функцию для каждого объекта в списке. Если функция вернет значение `false`, то перебор объектов завершится. Возвращает список объектов.

`.first([function()])`
Возвращает первый объект в списке или значение `null`, если список пустой. Может выполнить переданную функцию для первого объекта.

`.last([function()])`
Возвращает последний объект в списке или значение `null`, если список пустой. Может выполнить переданную функцию для последнего объекта.

`.eq(index[, function()])`
Возвращает объект с переданным индексом в списке или значение `null`, если такового нет. Может выполнить переданную функцию для найденного объекта.

* * *

## [id]:expromptum.base Абстрактный класс

Используется в качестве базового класса для всех остальных.

Класс `expromptum.base`

#### Методы

`.init(params)`
Конструктор объекта.

`.destroy([function()[, remove]])`
Деструктор объекта. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. При вызове метода без параметров — выполняет функции в списке. Возвращает объект.

`.change([function()[, remove]])`
Обработчик изменения значения объекта. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. При вызове метода без параметров — выполняет функции в списке. Возвращает объект.

`.param(name[, value])`
Чтение и запись свойств объекта. Возвращает значение указанного свойства.

* * *

## [id]:controls Контролы

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

```js
expromptum.controls.register({name: 'zip', base: '_field', prototype: {
	element_selector: '.zip input, input.zip',
	valid: '[this].val().match(/^\\d{6}$/)',
	allow_chars_pattern: /^\d+$/
}});
```

###### Пример 2

```js
expromptum.controls.register({name: 'wysiwyg', base: 'string', prototype: {
	element_selector: '.wysiwyg textarea',

	init: function(params){
		expromptum.controls.wysiwyg.base.init.apply(this, arguments);
		this._param('reformator', reformator.append(this.$element[0], {bar: true}));
	},

	destroy: function(handler, remove){
		if(!arguments.length){
			this._param('reformator').destroy();
		}

		return expromptum.controls._secret.base.destroy.apply(this, arguments);
	}
}});
```

* * *

### [id]:controls._item Абстрактный контрол

Тип `_item`
Базовый тип `[expromptum.base][expromptum.base]`

Используется в качестве базового класса для классов контролов.

#### Свойства

`.$element`
jQuery-объект, указывающий на основной элемент контрола.

`.$container`
jQuery-объект, указывающий на элемент, найденный по CSS-селектору из свойства `container_selector` или на основной элемент.

`.disabled`
Логическое значение `true` или `false`, в зависимости от доступности контрола.

`.container_selector`
CSS-селектор по которому находится элемент контейнер.

`.container_disabled_class = 'disabled'`
Имя CSS-класса, назначаемое элементу контейнеру в зависимости от доступности контрола.

`.autofocus`
Логическое значение `true` или `false`, по которому определяется необходимость перехода фокуса на данный контрол при инициализации.

#### Методы

`.remove()`
Удаляет контрол, в том числе, и все его элементы из DOM-дерева.

`.parent()`
Возвращает родительский контрол.

`.root()`
Возвращает корневой контрол.

`.val([value])`
Чтение и запись значения контрола.

`.disable([disabled])`
Определяет доступность контрола. Возвращает данный контрол.

* * *

### [id]:controls.html HTML

Тип `html`
Базовый тип `[_item][controls._item]`
Селектор элемента `.xp_html`

Используется для вывода в HTML значений других контролов через зависимость `[computed][dependencies.computed]`.

* * *

### [id]:controls._parent Абстрактный родитель

Тип `_parent`
Базовый тип `[_item][controls._item]`
Селектор элемента `.xp`

Используется в качестве базового класса для всех контролов, которые могут выступать родителем для других.

#### Методы

`.children()`
Возвращает список контролов, находящихся внутри данного.

`.val([object | objects array])`
Позволяет принимать в качестве значения объект или массив объектов. Значения свойств объекта будут устанавливаться в качестве значений для одноименных контролов, находящихся внутри данного.

* * *

### [id]:controls.form Форма

Тип `form`
Базовый тип `[_parent][controls._parent]`
Селектор элемента `form`

#### Свойства

`.uncomplete_if_required = true`
Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при незаполненных обязательных контролах.

`.uncomplete_if_invalid_required = true`
Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных обязательных контролах.

`.uncomplete_if_invalid = false`
Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки при неправильно заполненных контролах.

`.uncomplete_if_unchanged = false`
Логическое значение `true` или `false`, по которому определяется считается ли форма готовой для отправки если не менялось значение хотя бы одного из контролов.

`.locked = false`
Логическое значение `true` или `false`, по которому определяется возможность отправки формы. Можно использовать для калькуляторов или форм работающих через ajax.

#### Методы

`.submit([function()[, remove]])`
Обработчик события отправки формы.
1. При передачи в параметре функции, добавляет ее в список. При передаче значения `true` во втором параметре, удаляет функцию из списка. Возвращает контрол.
2. При вызове метода без параметров — выполняет функции в списке. Возвращает логическое значение `true` или `false`.

`.uncompleted()`
Проверяет готовность формы. Если готова, возвращает `null`. Иначе — строку в которой указана причина (`required`, `invalid_required`, `invalid`, `unchanged`).
Получить [список][list] конфликтных контролов, можно через метод `._param('*зависимость*')`.

* * *

### [id]:controls.fields Группа полей, листы

Тип `fields`
Базовый тип `[_parent][controls._parent]`
Селектор элемента `fieldset, .fields, .sheets`

#### Свойства

`.name`
Имя группы полей. Необходимо для получения и присвоения значений при использовании повторений у данного контрола.

#### Методы

`.count()`
Возвращает количество находящихся внутри данного контролов с непустыми значениями.

* * *

### [id]:controls.sheet Лист

Тип `sheet`
Базовый тип `[fields][controls.fields]`
Селектор элемента `.sheet`

#### Свойства

`.$label`
jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

`.selected_class = 'selected'`
Имя CSS-класса, назначаемое элементам отмеченного контрола (контейнеру и подписи).

`.unselected_class = 'unselected'`
Имя CSS-класса, назначаемое элементам не отмеченных контролов (контейнерам и подписям).

#### Методы

`.select([selected])`
Отмечает контрол. Возвращает данный контрол.

* * *

### [id]:controls._field Абстрактное поле

Тип `_field`
Базовый тип `[_parent][controls._parent]`
Селектор элемента `input`
Селектор контейнера `.field`

#### Свойства

`.$label`
jQuery-объект, указывающий на элемент с атрибутом `for` равным `id` основного элемента данного контрола.

`.allow_chars_pattern`
RegExp, содержащий разрешенные для ввода с клавиатуры символы.

`.container_blured_class = 'blured'`
Имя CSS-класса, назначаемое элементу контейнера после того, как произойдет событие `blur` у основного элемента данного контрола.

* * *

### [id]:controls.string Строковое поле

Тип `string`
Базовый тип `[_field][controls._field]`
Селектор элемента `input[type=text], input:not([type])`

* * *

### [id]:controls.text Текстовое поле

Тип `text`
Базовый тип `[_field][controls._field]`
Селектор элемента `textarea`

* * *

### [id]:controls.hidden Скрытое поле

Тип `hidden`
Базовый тип `[_field][controls._field]`
Селектор элемента `input[type=hidden]`

* * *

### [id]:controls.file Файловое поле

Тип `file`
Базовый тип `[_field][controls._field]`
Селектор элемента `input[type=file]`

* * *

### [id]:controls.button Кнопка

Тип `button`
Базовый тип `[_item][controls._item]`
Селектор элемента `input[type=button], button, .button`

* * *

### [id]:controls.submit Кнопка отправки

Тип `submit`
Базовый тип `[_item][controls._item]`
Селектор элемента `input[type=submit], button[type=submit]`

* * *

### [id]:controls.select Выпадающий список

Тип `select`
Базовый тип `[_field][controls._field]`
Селектор элемента `select`

#### Свойства

`.hide_disabled_option = true`
Определяет видимость недоступных элементов. При значении `false` нужный результат будет только в тех браузерах, которые это поддерживают.

#### Методы

`.disable([disabled[, values]])`
Определяет доступность контрола. Второй параметр может содержать одно или массив значений к которым нужно применить первый параметр. Возвращает данный контрол.

* * *

### [id]:controls.options Группа переключателей

Тип `options`
Базовый тип `[fields][controls.fields]`
Селектор элемента `.options`

Группирующий контрол, применяемый для назначения зависимостей на группу переключателей или включателей.

* * *

### [id]:controls._option Абстрактный переключатель

Тип `_option`
Базовый тип `[_field][controls._field]`
Селектор контейнера `.option`

Используется в качестве базового класса для контролов переключателей и включателей.

#### Свойства

`.container_selector = '.option'`
CSS-селектор по которому находится элемент контейнер.

`.selected = null`
Логическое значение `true` или `false`, по которому определяется отмечен данный контрол или нет.

`.container_initial_selected_class = 'initial_selected'`
Имя CSS-класса, назначаемое элементу контейнеру если данный контрол был отмечен на момент инициализации.

`.container_selected_class = 'selected'`
Имя CSS-класса, назначаемое элементу контейнеру если данный контрол отмечен.


#### Методы

`.select([selected])`
Определяет отмечен контрол или нет.

* * *

### [id]:controls.radio Переключатель

Тип `radio`
Базовый тип `[_option][controls._option]`
Селектор элемента `input[type=radio]`

* * *

### [id]:controls.checkbox Включатель

Тип `checkbox`
Базовый тип `[_option][controls._option]`
Селектор элемента `input[type=checkbox]`

* * *

### [id]:controls.email Поле для эл. почты

Тип `email`
Базовый тип `[_field][controls._field]`
Селектор элемента `.email input, input.email`

* * *

### [id]:controls.phone Поле для телефона

Тип `phone`
Базовый тип `[_field][controls._field]`
Селектор элемента `.phone input, input.phone`

* * *

### [id]:controls._secret Абстрактное поле со скрытым полем

Тип `_secret`
Базовый тип `[string][controls.string]`

Используется в качестве базового класса для всех контролов, внешний вид которых требует создания альтернативных элементов для ввода данных.

#### Свойства

`.$secret`
jQuery-объект, указывающий на на основной элемент контрола, который трансформирован в скрытый.

* * *

### [id]:controls.password Поле для пароля

Тип `password`
Базовый тип `[_secret][controls._secret]`
Селектор элемента `input[type=password]`

Позволяет управлять видимостью введенных символов в поле для ввода пароля.

#### Свойства

`.container_view_class = 'alt'`
Имя CSS-класса, назначаемое элементу контейнеру после нажатия на дополнительно созданный элемент управления.

`.control_button_view_class = 'control_button_password_view'`
Имя CSS-класса, назначаемое элементу управления после нажатия на него.

`.control_button_view_html = '<span class="control_button control_button_password"/>'`
HTML-код для создания элемента управления видом контрола.

* * *

### [id]:controls.number Поле для числа

Тип `number`
Базовый тип `[_secret][controls._secret]`
Селектор элемента `input.number, .number input`

Позволяет вводить только числа и управлять значением с помощью стрелок на клавиатуре или созданных дополнительно элементов управления.

#### Свойства

`.step = 1`
Шаг, на который будет меняться значение контрола.

`.min = 1 - Number.MAX_VALUE`
Минимальное значение контрола.

`.def = 0`
Значение по умолчанию.

`.max = Number.MAX_VALUE - 1`
Максимальное значение контрола.

`.element_wrap_html = '<span class="number_control"/>'`
HTML-код обертки для созданного дополнительно элемента, через который будет осуществляться ввод данных пользователем.

`.control_button_dec_html = '<span class="control_button control_button_dec"/>'`
HTML-код кнопки увеличения значения контрола.

`.control_button_inc_html = '<span class="control_button control_button_inc"/>'`
HTML-код кнопки уменьшения значения контрола.

#### Методы

`.inc()`
Увеличивает значения контрола. Возвращает данный контрол.

`.dec()`
Уменьшает значения контрола. Возвращает данный контрол.

* * *

### [id]:controls._secret Поле для даты

Тип `date`
Базовый тип `[_secret][controls._secret]`
Селектор элемента `input.date, .date input`

Использует виджет [Datepicker](http://jqueryui.com/datepicker/).

#### Методы

`.date()`
Возвращает указанную дату.

###### Пример

```html
<input id="date_from" name="date_from" value="2010-02-20"/>

<input id="date_to" name="date_to" data-xp="
	valid: '[name=date_from] < [name=date_to]',
	computed: {
		on: 'new Date([name=date_from].date() \* 1 + 86400 \* 1000)',
		do: 'min'
	}
"/>
```

* * *

### [id]:controls.datetime Поле для даты и времени

Тип `datetime`
Базовый тип `[date][controls.date]`
Селектор элемента `input.datetime, .datetime input`

Использует виджет [Datepicker](http://jqueryui.com/datepicker/). И добавляет два контрола для указания времени, с соответствующими ограничениями.

* * *

### [id]:controls.combobox Комбобокс

Тип `combobox`
Базовый тип `[string][controls.string]`
Селектор элемента `.combobox input, input.combobox, input[list]`

Ввод данных с возможность выбора значений из выпадающего списка.

#### Свойства

`.search_from_start = true`

Логическое значение true или false, по которому определяется каким образом фильтровать данные в списке — при совпадении с началом строки или в любом ее фрагменте.

`.[list][controls._combolist]`
Контрол, указывающий на список значений.

* * *

### [id]:controls._combolist Список для комбобокса

Тип `_combolist`
Базовый тип `[select][controls.select]`

Вспомогательный контрол для комбобокса.

#### Методы

`.show()`
Показывает список. Возвращает данный контрол.

`.hide()`
Скрывает список. Возвращает данный контрол.

* * *

## [id]:dependencies Зависимости


### [id]:dependencies._item Абстрактная зависимость

Тип `_item`
Базовый тип `[expromptum.base][expromptum.base]`

Используется в качестве базового класса для всех зависисмостей.

#### Свойства

`.to='[this]'`
Свойство, указывающее на контрол к которому применяется зависисмость.

* * *

### [id]:dependencies.classed Управление атрибутом класса

Тип `classed`
Базовый тип `[_item][dependencies._item]`

#### Свойства

`.on`
Логическое выражение, в случае выполнения которого, элементу контейнеру контрола указанного в свойстве `to`, будет назначено имя CSS-класса из свойства `do`.

`.do`
Имя CSS-класса.

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

### [id]:dependencies.computed Вычисляемое значение

Тип `computed`
Базовый тип `[_item][dependencies._item]`

#### Свойства

`.on`
Выражение, результат которого будет присвоен в качестве значения (через метод `.val(*значение*)`) контролу, указанному в свойстве `to`.

`.do`
Имя свойства. Если указано значение, то результат выражения будет присвоен свойству (через метод `.param(*свойство*, *значение*)`) контрола, указанного в свойстве `to`. 

###### Пример 1

```html
<input name="a"/> \* <input name="b"/> = <span data-xp="computed: '[name=a] \* [name=b]'"></span>
```

###### Пример 2

```html
<input id="date_from" name="date_from" value="2013-12-28"/>

<input id="date_to" name="date_to" data-xp="
	valid: '[name=date_from] < [name=date_to]',
	computed: {
		on: 'new Date([name=date_from].date() \* 1 + 86400 \* 1000)',
		do: 'min'
	}
"/>
```

* * *

### [id]:dependencies.enabled Доступность

Тип `enabled`
Базовый тип `[_item][dependencies._item]`

`.on`
Логическое выражение, в случае **не**выполнения которого, контрол, указанный в свойстве `to`, будет недоступен для работы (`disabled`).

###### Пример

```html
<input name="a"/>

<input name="b" data-xp="enabled: '[name=a]'"/>
```

* * *

### [id]:dependencies.enabled_on_completed Доступность при полном заполнении

Тип `enabled_on_completed`
Базовый тип `[_item][dependencies._item]`

В зависимости от выполнения условий на обязательность и правильность заполнения формы, делает контрол доступным или недоступным для работы (`disabled`).

###### Пример

```html
<form>
	<textarea name="message" data-xp="required: true"></textarea>

	<input type="submit" data-xp="enabled_on_completed: true"/>
</form>
```

* * *

### [id]:dependencies._rooted Абстрактная зависимость на полное заполнение

Тип `_rooted`
Базовый тип `[_item][dependencies._item]`

Используется в качестве базового класса для остальных зависисмостей, которые могут быть задействованы в условиях полного заполнения формы.

* * *

### [id]:dependencies.required Обязательность заполнения

Тип `required`
Базовый тип `[_rooted][dependencies._rooted]`

#### Свойства

`.on`
Логическое значение true. Или логическое выражение, в случае выполнения которого, контрол указанный в свойстве `to`, становится обязательным для заполнения.

`.container_required_class = 'required'`
Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если он не заполнен.

`.container_unrequired_class = 'unrequired'`
Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если он заполнен.

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

### [id]:dependencies.valid Соответствие выражению

Тип `valid`
Базовый тип `[_rooted][dependencies._rooted]`

#### Свойства

`.on`
Логическое выражение, от результата работы которого зависит считается ли данный контрол правильно заполненным.

`.container_valid_class = 'valid'`
Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `true`.

`.container_invalid_class = 'invalid'`
Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если выражение в свойстве `on` возвращает `false`.

###### Пример

```html
<input name="zip" data-xp="valid: '[this].val().match(/^\\d{6}$/)'"/>
```

* * *

### [id]:dependencies.changed Изменение

Тип `changed`
Базовый тип `[_rooted][dependencies._rooted]`

Данная зависимость назначается всем контролам при инициализации.

#### Свойства

`.container_changed_class = 'changed'`
Имя CSS-класса, назначаемое элементу контейнеру контрола, в случае, если его значение было изменено.

* * *

## [id]:repeats Повторения

###### Пример 1
```html
<span class="field">
	<input name="a[0]" data-xp="repeat: true"/>

	<button class="repeat_append_button">+</button>

	<button class="repeat_remove_button">&minus;</button>
</span>
```

* * *

## [id]:conception Концепция работы с библиотекой

Все значения свойств у основных объектов библиотеки (контролов, зависимостей и повторений) устанавливаются через параметры при инициализации или через вызов метода `.param('*имя*', *значение*)`. Получение значений возможно и через прямое обращение к свойству.

Большинство методов основных объектов библиотеки возвращают сам объект.

Методы и свойства названия которых начинаются с символа подчеркивания, предназначены только для использования внутри библиотеки. Если же есть необходимости обратится к таким свойствам, это следует делать через вызов метода `._param('*имя*', *значение*)`.

Названия свойств, значениями которых являются jQuery-объекты, начинаются с символа доллара.

* * *

## [id]:debug Режим диагностики

Для диагностики работы в адресной строке можно передать параметр `xp=значение`. При этом в консоль браузера будут выводится все обнаруженные ошибки и соответствующие значению сообщения:
`controls` — инициализация контролов;
`submit` — отправка формы;
`dependencies` — инициализация и обработка всех зависимостей;
`classed`, `enabled`, `enabled_on_completed`, `required`, `valid`, `changed` — обработка зависимостей данного типа;
`repeats` — инициализация повторений.

* * *
