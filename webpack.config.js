const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
		library: 'constellation3d',
		libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-flow']
					}
				}
			}
		]
	}
};
