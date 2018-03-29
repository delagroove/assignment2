var path = require('path');

const ENTRY_DIR = path.resolve(__dirname, 'app/static/javascript/src');
const MODULES_DIR = path.resolve(__dirname, 'node_modules/');
var config = {
    target: 'web',
    devtool: 'eval',
    mode: 'development',
    watch: true,
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
				exclude:  MODULES_DIR,
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
