xP.controls.register({
    name : 'form',
    base : '_parent',
    prototype : {
        element_selector : 'form',

        init : function(params) {

            this.completed_on_required = true;
            this.completed_on_valid_required = true;
            //this.completed_on_valid = false;
            //this.completed_on_changed = false;

            xP.controls.form.base.init.apply(this, arguments);

            this.init_locale(params);

            this._.root = this;

            // Обратная совместимость
            if(this.uncomplete_if_invalid !== undefined) {
                this.completed_on_valid = this.uncomplete_if_invalid;
            }

            if(this.uncomplete_if_unchanged !== undefined) {
                this.completed_on_changed = this.uncomplete_if_unchanged;
            }
            // Обратная совместимость

            this._.onsubmit = new xP.list();

            var that = this;

            this.$element.on('submit', function() {
                return that.submit();
            });

            this.submit(function() {
                var uncompleted = this.uncompleted();

                if(uncompleted) {
                    xP.debug('submit', uncompleted);

                    return false;
                }
                else if(this.locked) {
                    xP.debug('submit', 'locked');

                    return false;
                }
                else {
                    this.locked = true;
                }

                return !xP.debug('submit', 'submit');
            });
        },

        submit : function(handler, remove) {
            if(!arguments.length) {
                var that = this, result = true;

                this._.onsubmit.each(function() {
                    if(!this.call(that)) {
                        result = false;
                    }
                });

                return result;
            }
            else {
                if(remove) {
                    this._.onsubmit.remove(handler);
                }
                else {
                    this._.onsubmit.append(handler);
                }
                return this;
            }
        },

        uncompleted : function() {
            if(
                this.completed_on_required
                && this._.required
                && $.grep(
                this._.required,
                function(ctrl) {
                    return !ctrl.disabled
                }
                ).length
            ) {
                return 'required';
            }

            if(
                this.completed_on_valid_required
                && this._.invalid
                && $.grep(
                this._.invalid,
                function(ctrl) {
                    return !ctrl.disabled && (ctrl.required || (ctrl.pseudo && ctrl._.parent.required))
                }
                ).length
            ) {
                return 'invalid_required';
            }

            if(
                this.completed_on_valid
                && this._.invalid
                && $.grep(
                this._.invalid,
                function(ctrl) {
                    return !ctrl.disabled
                }
                ).length
            ) {
                return 'invalid';
            }

            if(
                this.completed_on_changed
                && !(
                    this._.changed
                    && $.grep(
                        this._.changed,
                        function(ctrl) {
                            return !ctrl.disabled
                        }
                    ).length
                )
            ) {
                return 'unchanged';
            }

            return null;
        }
    }
});
