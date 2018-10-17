const webpack = require('webpack'); 	// 用于访问内置插件
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    // filename: "css/[name]-[contenthash].css",
    filename: "d-video.css",
    disable: process.env.NODE_ENV === "development"
});

const resolve = function (dir) {
	return path.resolve(__dirname, dir);
}


module.exports = {
	// 正常run的 配置
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '',
		filename: '[name]-[hash].js'
	},

	// 打包发布npm的配置
	// entry: './src/script/Dvideo.js',
	// output: {
	// path: path.resolve(__dirname, 'lib'),
	// 	publicPath: '',
	// 	filename: 'd-video.js',
	// 	// filename: '[name]-[hash].js',
	// 	library: 'd-video', // library指定的就是你使用require时的模块名，这里便是require("VueMessage")
	// 	libraryTarget: 'umd', //libraryTarget会生成不同umd的代码，例如可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
	// 	umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
	// },
	module: {
		rules: [
			{
				test: /\.css$/,
        		use: ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:["css-loader"]
				})
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:["css-loader","sass-loader"]
				})
			},
			{
				test: /\.styl$/,
				use: ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:["css-loader","stylus-loader"]
				})
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader'
					}
        		]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
        		]
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin ({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		extractSass
	],
	devServer: {
		// 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过传入以下启用：
		contentBase: "./",
		// 端口号
		port: 1994,
		//当有编译器错误或警告时，在浏览器中显示全屏覆盖。默认禁用。如果您只想显示编译器错误：
		noInfo: true,
		// 配置端口号
		overlay: true,
	},
	resolve: {
		alias: {
			'src': resolve('src'),
			'commonjs': resolve('src/commonjs'),
			'scss': resolve('src/scss'),
			'stylus': resolve('src/stylus'),
			'script': resolve('src/script'),
			'static': resolve('static'),
		}
	},
};