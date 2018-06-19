xP.controls.register({
    name : 'foldable',
    base : 'fields',
    prototype : {
        element_selector : '.foldable',
        duration : 200,

        init : function(params) {
            // TODO: Надо будет на этой базе и аккордеон сделать.
            xP.controls.foldable.base.init.apply(this, arguments);

            if(this.$label && this.$label[0]) {
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

                this.$label.click(function() {
                    that.fold(that.unfolded);
                    return false;
                });
            }
        },

        show : function(complete) {
            return this.fold(false, complete);
        },

        fold : function(fold, complete, _duration) {
            this.unfolded = !fold;

            var that = this;

            if(fold) {
                this.$container.slideUp(
                    _duration || this.duration,
                    function() {
                        that.$container.add(that.$label)
                            .removeClass(that.unfolded_class)
                            .addClass(that.folded_class);

                        if(complete) {
                            complete();
                        }
                    }
                );
            }
            else {
                this.$container.slideDown(
                    _duration || this.duration,
                    function() {
                        that.$container.add(that.$label)
                            .removeClass(that.folded_class)
                            .addClass(that.unfolded_class);

                        if(complete) {
                            complete();
                        }
                    }
                );
            }

            return this;
        },

        folded_class : 'folded',
        unfolded_class : 'unfolded'
    }
});
