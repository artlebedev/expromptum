xP.controls.register({
    name : 'date',
    base : 'datemonth',
    prototype : {
        element_selector : 'input.date, .date input',

        _month_name : 'name_genitive',

        _spliters : ['-', '-', '']
    }
});
