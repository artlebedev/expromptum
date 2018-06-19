xP.controls.register({
    name : 'email',
    base : '_field',
    prototype : {
        element_selector : '.email input, input.email',
        valid : /^\S+@\S+\.\S{2,}$/
    }
});
