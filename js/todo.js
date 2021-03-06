// **todo.js** содержит класс ``Todo``, который наследуется от класса [Matreshka.Object](http://ru.matreshka.io/#Matreshka.Object) и используется, в качестве модели ([Model](http://ru.matreshka.io/#Matreshka.Array-Model)) для главного класса ([Todos](todos.html)).
"use strict";
var Todo = Class({
	'extends': MK.Object,
	constructor: function(data, parent) {
		this
			// Присваиваем значения по умолчанию и добавляем ключи ``"title"`` и ``"completed"`` в список ключей, отвечающих за данные (см. [jset](http://ru.matreshka.io/#Matreshka.Object-jset)).
			// Свойство ``"title"`` по умолчанию - пустая строка.
			// Свойство ``"completed"`` по умолчанию - ``false``.
			.jset({
				title: '',
				completed: false
			})
			// Теперь присваиваем свойствам данные, которые конструктор получил в качестве аргумента, перезаписывая значения по умолчанию (например,  ``{ title: 'Do it!' }``).
			.set(data)
			// Свойство ``"visible"`` отвечает за видимость элемента списка дел на странице.
			// Сохраняем ссылку на коллекцию ``Todos`` в свойстве ``"parent"``.
			.set({
				visible: true,
				parent: parent
			});
	},

	// Ждем событие ``"render"``, используя виртуальный метод [onRender](http://ru.matreshka.io/#Matreshka.Array-onRender). Событие срабатывает, когда отрисовывается элемент, соответствующий экземпляру класса.
	onRender: function() {
		var binders = MK.binders;
		this
		// Привязка элементов, которые не требуют указания привязчика (binder). Здесь используются стандартные привязчики ([defaultBinders](http://ru.matreshka.io/#Matreshka.defaultBinders)), если возможно.
		// * Свойство ``"completed"`` привязывается к чекбоксу с классом ``toggle``
		// * Свойство ``"edit"`` привязывается к полю (input type=text) с классом ``edit``
		// * Свойство ``"destroy"`` привязывается к элементу с классом ``destroy``, который не имеет стандартного привязчика. Это значит, что элемент просто ассоциируется со свойством, не синхронизируясь с его значением.
			.bindNode({
				completed: ':sandbox .toggle',
				edit: ':sandbox .edit',
				destroy: ':sandbox .destroy'
			})
			// Эти привязки используют третий аргумент в качестве привязчика.
			// * Видимость главного элемента будет зависеть от значения свойства ``"visible"` ([binders.visibility](http://ru.matreshka.io/#Matreshka.binders.visibility))
			// * Наличие класса ``"completed"`` у главного элемента будет зависеть от значения свойства ``"completed"`` ([binders.className](http://ru.matreshka.io/#Matreshka.binders.className))
			// * Наличие класса ``"editing"`` у главного элемента будет зависеть от значения свойства ``"editing"``
			// * Привязываем элемент ``label``, чей  ``innerHTML`` будет синхронизироваться со значением свойства ``"title"`` ([binders.html](http://ru.matreshka.io/#Matreshka.binders.html))
			.bindNode('visible', ':sandbox', binders.visibility())
			.bindNode('completed', ':sandbox', binders.className('completed'))
			.bindNode('editing', ':sandbox', binders.className('editing'))
			.bindNode('title', ':sandbox label', binders.html())
			// Добавляем обработчик события двойного щелчка мышью (``"dblclick"``) для элемента, привязанного к свойству ``"title"`` (тег ``label``).
			// Когда срабатывает обработчик, мы меняем режим экземпляра на редактирование, присваивая свойству ``"editing"`` значение ``true``. Это действие добавляет класс ``"edit"`` главному элементу (см. привязки выше).
			// Затем мы присваиваем текущее значение свойства ``"title"`` свойству ``"edit"``.
			// После этого устанавливаем фокус на поле, привязанное к свойству ``"edit"``.
			.on('dblclick::title', function() {
				this.editing = true;
				this.edit = this.title;
				this.$bound('edit').focus();
			})
			// Добавляем обработчик события ``"keyup"`` элементу, привязанному к свойству ``"edit"``.
			// Если нажата клавиша ``Esc``, возвращаемся из режима редактирования в обычный режим.
			// Если нажата класиша ``Enter``, удаляем лишние пробелы у значения свойства ``"edit"`` и присваиваем его свойству ``"title"``. Затем, возвращаемся из режима редактирования в обычный режим. Если значение - пустая строка, удаляем элемент из коллекции ``Todos``.
			.on('keyup::edit', function(evt) {
				var editValue;
				if (evt.which === ESC_KEY) {
					this.editing = false;
				} else if (evt.which === ENTER_KEY) {
					if (editValue = this.edit.trim()) {
						this.title = editValue;
						this.editing = false;
					} else {
						this.parent.pull(this);
					}
				}
			})
			// Если кликнуть по элементу, отвечающему за удаление пункта, удаляем его из родительского списка ``Todos`` методом [pull](http://ru.matreshka.io/#!Matreshka.Array-pull).
			.on('click::destroy', function() {
				this.parent.pull(this);
			});
	}
});
