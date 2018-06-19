// Expromptum JavaScript Library
// Copyright Art. Lebedev | http://www.artlebedev.ru/
// License: BSD | http://opensource.org/licenses/BSD-3-Clause
// Author: Vladimir Tokmakov | vlalek
// Updated: 2018-05-15

require('./xp')
require('./locale')
require('./base')
require('./controls')
require('./_item')
require('./html')
require('./_parent')
require('./form')
require('./_labeled')
require('./fields')
require('./sheet')
require('./foldable')
require('./_field')
require('./string')
require('./text')
require('./file')
require('./button')
require('./submit')
require('./select')
require('./options')
require('./selectus')
require('./_option')
require('./radio')
require('./checkbox')
require('./email')
require('./phone')
require('./_secret')
require('./password')
require('./number')
require('./datemonth')
require('./date')
require('./datetime')
require('./date_picker')
require('./combobox')
require('./_combolist')
require('./hidden')
require('./dependencies')
require('./classed')
require('./computed')
require('./enabled')
require('./enabled_on_completed')
require('./_rooted')
require('./required')
require('./valid')
require('./changed')
require('./repeat_append_button')
require('./repeat_insert_button')
require('./repeat_remove_button')
require('./repeat_first_button')
require('./repeat_prev_button')
require('./repeat_next_button')
require('./repeat_last_button')
require('./repeats')

$(document).on('mouseup.expromptum_controls_opened', function(ev) {
    if(xP.controls.opened) {
        xP.controls.opened.close();
    }
});

xP.root = new xP.controls.fields({ $element : $('html') });
