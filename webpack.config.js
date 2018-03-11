var path = require('path');

const ENTRY_DIR = path.resolve(__dirname, 'app/static/javascript/src');

var config = {
    target: 'node',
	entry: ENTRY_DIR  + '/index.js',
	output: {
		path: path.resolve(__dirname, 'app/static/javascript/bin'),
		filename: 'bundle.js'
	},
	module : {
		rules : [
			{
				test : /\.js?/,
				include : ENTRY_DIR,
				loader : 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	}
};

module.exports = config;