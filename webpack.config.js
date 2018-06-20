var path = require('path')

module.exports = [
    {
        mode : 'none',
        entry : './src/index.js',
        output : {
            path : path.resolve('.'),
            filename : 'expromptum.js'
        }
    }
]

if(process.env.NODE_ENV === 'production') {
    module.exports.push({
        mode : 'production',
        entry : './src/index.js',
        output : {
            path : path.resolve('.'),
            filename : 'expromptum.min.js'
        }
    })
}



