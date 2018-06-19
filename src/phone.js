xP.controls.register({
    name : 'phone',
    base : '_field',
    prototype : {
        element_selector : '.phone input, input.phone',
        valid : /^(?=[^()]*\(([^()]*\)[^()]*)?$|[^()]*$)(?=[\s(]*\+[^+]*$|[^+]*$)([-+.\s()]*\d){10,18}$/
    }
});
