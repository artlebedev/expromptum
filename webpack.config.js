var path = require('path')

module.exports = {
    mode : 'none',
    entry : './src/index.js',
    output : {
        path : path.resolve('.'),
        filename : 'expromptum.js'
    }
}
